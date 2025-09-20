"use client";
import { useEffect, useRef, useState } from "react";
// import { saveConversation, getConversations, deleteConversation, type Conversation, type Message } from supabase/conversations - temporarily disabled
import { useSubscription, incrementMessageUsage } from "../lib/subscription";
import { DatabaseUsageTracker } from "../lib/subscription/database-usage";
import UpgradeModal from "../components/UpgradeModal";
import AuthModal from "../components/AuthModal";
import UsageDisplay from "../components/UsageDisplay";
import { useAuth } from "../lib/hooks/useAuth";

// Speech recognition types now defined in app/types/speech.d.ts

const COACHING_PROMPTS = {
  newbie: "I'm new to AI and need simple, step-by-step guidance. Help me understand how to apply AI to my specific situation without overwhelming technical details.",
  business: "I need strategic business advice. Help me think like a successful entrepreneur and identify opportunities I might be missing.",
  automation: "Help me identify tasks I can automate to save 10+ hours per week. Focus on practical, implementable solutions.",
  strategy: "Help me think more strategically about AI adoption. Coach me on the questions I should be asking and the framework I should use for decision-making."
};

const VOICE_OPTIONS = [
  { id: 'samantha', name: 'Samantha (Premium)' },
  { id: 'karen', name: 'Karen (Professional)' },
  { id: 'alex', name: 'Alex (Natural)' },
  { id: 'female', name: 'System Female' },
  { id: 'male', name: 'System Male' }
];

export default function Chat() {
  const [mounted, setMounted] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('samantha');
  const [showCoaching, setShowCoaching] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLimitOverlay, setShowLimitOverlay] = useState(false);
  const [coachMode, setCoachMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Conversation state
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Authentication
  const { user, isAuthenticated, userId, userEmail, loading: authLoading, signOut } = useAuth();

  // Subscription hook
  const {
    subscription,
    limits,
    usage,
    tier,
    isLoading: subscriptionLoading,
    isFreeTier,
    canSendMessage,
    canUseVoice,
    refreshSubscription
  } = useSubscription(userId);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [canSpeak, setCanSpeak] = useState(false);
  const [canListen, setCanListen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Set browser capabilities after client mount to prevent hydration mismatch
    setCanSpeak(typeof window !== "undefined" && "speechSynthesis" in window);
    setCanListen(typeof window !== "undefined" && (!!window.webkitSpeechRecognition || !!window.SpeechRecognition));

    loadConversations();

    if (canListen) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      let silenceTimer: NodeJS.Timeout;
      let finalTranscript = '';
      let isProcessing = false;

      recognitionRef.current.onresult = (event: any) => {
        if (isProcessing) return;

        let interimTranscript = '';
        let currentFinalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (currentFinalTranscript) {
          finalTranscript = currentFinalTranscript;
        }

        setMsg(finalTranscript + interimTranscript);

        if (silenceTimer) clearTimeout(silenceTimer);

        if (finalTranscript.trim().length > 5 && voiceMode && !isProcessing) {
          // Check if this might be echo by comparing to recent AI messages
          const isLikelyEcho = messages.slice(-2).some(msg =>
            msg.role === 'assistant' &&
            msg.content.toLowerCase().includes(finalTranscript.toLowerCase().substring(0, 20))
          );

          if (!isLikelyEcho) {
            silenceTimer = setTimeout(() => {
              if (finalTranscript.trim().length > 5 && !isProcessing) {
                isProcessing = true;
                if (recognitionRef.current) {
                  recognitionRef.current.stop();
                }
                handleVoiceSubmit(finalTranscript.trim());
                finalTranscript = '';
              }
            }, 2000);
          } else {
            console.log('Detected likely echo, ignoring:', finalTranscript);
            finalTranscript = '';
            setMsg('');
          }
        }
      };

      recognitionRef.current.onend = () => {
        if (voiceMode && !busy && !isProcessing) {
          setTimeout(() => {
            if (recognitionRef.current && voiceMode && !isProcessing) {
              recognitionRef.current.start();
            }
          }, 200);
        } else if (!voiceMode) {
          setListening(false);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setListening(false);
          setVoiceMode(false);
        }
      };
    }
  }, [canListen, voiceMode, messages]);

  async function loadConversations() {
    try {
      const convs = await getConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }

  function startNewConversation() {
    setCurrentConversation(null);
    setMessages([]);
    setMsg("");
  }

  function loadConversation(conversation: Conversation) {
    setCurrentConversation(conversation);
    setMessages(conversation.messages);
    setShowHistory(false);
  }

  async function handleDeleteConversation(conversationId: string) {
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      await deleteConversation(conversationId);

      if (currentConversation?.id === conversationId) {
        startNewConversation();
      }

      await loadConversations();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    }
  }

  async function saveCurrentConversation(newMessage: Message, assistantResponse: string) {
    try {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...messages, newMessage, assistantMessage];

      if (currentConversation) {
        const updatedConversation = {
          ...currentConversation,
          messages: updatedMessages,
          updated_at: new Date().toISOString()
        };

        await saveConversation(updatedConversation);
        setCurrentConversation(updatedConversation);
      } else {
        const newConversation: Conversation = {
          id: crypto.randomUUID(),
          title: newMessage.content.slice(0, 50) + (newMessage.content.length > 50 ? '...' : ''),
          messages: updatedMessages,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await saveConversation(newConversation);
        setCurrentConversation(newConversation);
      }

      setMessages(updatedMessages);
      await loadConversations();
    } catch (error) {
      console.error('Failed to save conversation:', error);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMessage, assistantMessage]);
    }
  }

  async function handleVoiceSubmit(voiceMessage: string) {
    if (!voiceMessage.trim() || busy) return;

    // Check authentication first
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setBusy(true);

    // COMPLETELY stop voice recognition to prevent echo
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.abort();
    }
    setListening(false);

    // Stop any current speech to prevent echo
    speechSynthesis.cancel();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: voiceMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setMsg("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: voiceMessage,
          conversationHistory: messages,
          isVoiceConversation: true,
          coachMode: coachMode
        })
      });

      const data = await response.json();

      if (data.ok && data.text) {
        await saveCurrentConversation(userMessage, data.text);

        // Always speak in voice mode
        if (canSpeak && voiceMode) {
          const utterance = new SpeechSynthesisUtterance(data.text);

          const setVoiceAndSpeak = () => {
            const voices = speechSynthesis.getVoices();
            console.log('Available voices:', voices.map(v => v.name));

            let selectedVoiceObj = voices.find(voice =>
              voice.name.toLowerCase().includes(selectedVoice.toLowerCase())
            );

            if (!selectedVoiceObj) {
              selectedVoiceObj = voices.find(voice =>
                voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('karen') ||
                voice.name.toLowerCase().includes('alex') ||
                voice.name.toLowerCase().includes('victoria') ||
                voice.name.toLowerCase().includes('serena')
              );
            }

            if (!selectedVoiceObj) {
              selectedVoiceObj = voices.find(voice =>
                voice.name.toLowerCase().includes('female')
              );
            }

            if (!selectedVoiceObj && voices.length > 0) {
              selectedVoiceObj = voices[0];
            }

            if (selectedVoiceObj) {
              utterance.voice = selectedVoiceObj;
              console.log('Using voice:', selectedVoiceObj.name);
            } else {
              console.log('No voice found, using system default');
            }

            utterance.rate = 0.95;
            utterance.pitch = 1.0;

            utterance.onend = () => {
              if (voiceMode) {
                console.log('AI speech ended, waiting before restarting recognition...');
                setTimeout(() => {
                  if (recognitionRef.current && voiceMode) {
                    console.log('Restarting voice recognition...');
                    try {
                      recognitionRef.current.start();
                    } catch (e) {
                      console.error('Error restarting recognition:', e);
                    }
                  }
                }, 3000);
              }
            };

            speechSynthesis.speak(utterance);
          };

          const voices = speechSynthesis.getVoices();
          if (voices.length > 0) {
            setVoiceAndSpeak();
          } else {
            speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
          }
        } else {
          if (voiceMode) {
            setTimeout(() => {
              if (recognitionRef.current && voiceMode) {
                recognitionRef.current.start();
              }
            }, 200);
          }
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Voice chat error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);

      if (voiceMode) {
        setTimeout(() => {
          if (recognitionRef.current && voiceMode) {
            recognitionRef.current.start();
          }
        }, 1500);
      }
    } finally {
      setBusy(false);
    }
  }

  function startListening() {
    if (recognitionRef.current) {
      setListening(true);
      setVoiceMode(true);

      if (!speaking) {
        setSpeaking(true);
      }

      recognitionRef.current.start();
    }
  }

  function stopVoiceMode() {
    setVoiceMode(false);
    setListening(false);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    speechSynthesis.cancel();
    setMsg("");
  }

  function handleCoachingSelect(type: keyof typeof COACHING_PROMPTS) {
    setMsg(COACHING_PROMPTS[type]);
    setShowCoaching(false);
  }

  async function handleSubmit() {
    if (!msg.trim() || busy) return;

    // Check authentication first
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Double-check usage limits with real database data
    try {
      const chatStatus = await DatabaseUsageTracker.canUserChat();
      if (!chatStatus.canChat) {
        setShowLimitOverlay(true);
        return;
      }
    } catch (error) {
      console.error('Error checking chat status:', error);
      // Fallback to original subscription check
      if (!canSendMessage) {
        setShowLimitOverlay(true);
        return;
      }
    }

    setBusy(true);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: msg.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const currentMsg = msg;
    setMsg("");

    try {
      // Increment usage
      await incrementMessageUsage(userId);

      // Refresh subscription to get updated usage
      await refreshSubscription();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: currentMsg,
          conversationHistory: messages,
          isVoiceConversation: speaking,
          coachMode: coachMode
        })
      });

      const data = await response.json();

      if (data.ok && data.text) {
        await saveCurrentConversation(userMessage, data.text);

        // Handle audio response if enabled
        if (speaking && canSpeak) {
          const utterance = new SpeechSynthesisUtterance(data.text);

          const setVoiceAndSpeak = () => {
            const voices = speechSynthesis.getVoices();
            console.log('Regular audio - Available voices:', voices.map(v => v.name));

            let selectedVoiceObj = voices.find(voice =>
              voice.name.toLowerCase().includes(selectedVoice.toLowerCase())
            );

            if (!selectedVoiceObj) {
              selectedVoiceObj = voices.find(voice =>
                voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('karen') ||
                voice.name.toLowerCase().includes('alex') ||
                voice.name.toLowerCase().includes('victoria') ||
                voice.name.toLowerCase().includes('serena')
              );
            }

            if (!selectedVoiceObj) {
              selectedVoiceObj = voices.find(voice =>
                voice.name.toLowerCase().includes('female')
              );
            }

            if (!selectedVoiceObj && voices.length > 0) {
              selectedVoiceObj = voices[0];
            }

            if (selectedVoiceObj) {
              utterance.voice = selectedVoiceObj;
              console.log('Regular audio - Using voice:', selectedVoiceObj.name);
            } else {
              console.log('Regular audio - No voice found, using system default');
            }

            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            speechSynthesis.speak(utterance);
          };

          const voices = speechSynthesis.getVoices();
          if (voices.length > 0) {
            setVoiceAndSpeak();
          } else {
            speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
          }
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setBusy(false);
    }
  }

  // Show loading screen while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300">Loading...</div>
        </div>
      </div>
    );
  }

  // Show loading state until client-side hydration complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-indigo-950/90 to-slate-900/95" />

        {/* Floating geometric shapes */}
        <div className="absolute top-32 left-16 w-28 h-28 bg-gradient-to-br from-cyan-500/15 to-blue-600/15 rounded-3xl rotate-45 animate-float blur-lg"></div>
        <div className="absolute top-56 right-24 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-2xl rotate-12 animate-float-delayed blur-md"></div>
        <div className="absolute bottom-40 left-1/3 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full animate-pulse-slow"></div>

        {/* Dynamic light beams */}
        <div className="absolute top-0 left-1/5 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-beam-1"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-beam-2"></div>

        {/* Particle effects */}
        {mounted && Array.from({length: 15}).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col flex-1">
      {/* Enhanced Chat Controls Bar */}
      <div className="border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                showHistory
                  ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                  : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white'
              }`}
            >
              📚 History ({conversations.length})
            </button>

            {/* Coach Mode Toggle */}
            <button
              onClick={() => setCoachMode(!coachMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                coachMode
                  ? 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-300'
                  : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white'
              }`}
              title={coachMode ? 'Coach Mode: ON - Getting prompting guidance' : 'Coach Mode: OFF - Standard responses'}
            >
              🧠 Coach Mode
              <div className={`w-2 h-2 rounded-full transition-colors ${
                coachMode ? 'bg-cyan-400' : 'bg-slate-500'
              }`} />
            </button>

            {/* Real-time Usage Display */}
            <UsageDisplay
              userId={userId}
              isAuthenticated={isAuthenticated}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />
          </div>

          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
              AI Chat
            </h1>
            {currentConversation && (
              <p className="text-xs text-slate-400 truncate max-w-xs mx-auto">
                {currentConversation.title}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="text-right">
                  <div className="text-sm text-slate-300">Welcome back</div>
                  <div className="text-xs text-slate-400">{userEmail}</div>
                </div>
                <button
                  onClick={startNewConversation}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-200 font-medium"
                >
                  ✨ New Chat
                </button>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl transition-all duration-200"
                  title="Sign Out"
                >
                  🚪
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 font-medium"
              >
                🔐 Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <div className="fixed left-4 top-24 bottom-4 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 z-30 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Your Conversations</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-slate-400 mb-2">🗨️</div>
                <p className="text-slate-400 text-sm">No conversations yet</p>
                <p className="text-slate-500 text-xs">Start chatting to see your history here</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group relative p-3 rounded-lg transition-all duration-200 ${
                    currentConversation?.id === conv.id
                      ? 'bg-cyan-500/20 border border-cyan-400/30'
                      : 'bg-slate-700/50 hover:bg-slate-600/50'
                  }`}
                >
                  <button
                    onClick={() => loadConversation(conv)}
                    className="w-full text-left"
                  >
                    <div className={`font-medium truncate ${
                      currentConversation?.id === conv.id ? 'text-cyan-300' : 'text-slate-300'
                    }`}>
                      {conv.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(conv.updated_at).toLocaleDateString()} • {conv.messages.length} messages
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all duration-200"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Coach Mode Indicator */}
          {coachMode && (
            <div className="sticky top-0 z-30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-400/20 px-6 py-2">
              <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                🧠 Coach Mode Active - Getting prompting guidance and AI tips
              </div>
            </div>
          )}
          {messages.length === 0 ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] px-6 py-8">
              <div className="text-center max-w-4xl w-full relative">
                {/* Floating accent elements */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse-glow"></div>

                <div className="relative group mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300 animate-pulse-bright">
                    <span className="text-4xl">💬</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-blue-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
                </div>

                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-text-shimmer bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-1000">
                    Your AI assistant for everything
                  </h2>
                  <p className="text-xl text-slate-200 mb-6 max-w-3xl mx-auto leading-relaxed">
                    Get instant help with work, personal projects, learning, and daily tasks. Every conversation is automatically saved and secured.
                  </p>

                  {/* Decorative elements */}
                  <div className="flex justify-center items-center space-x-4 mb-8">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan-400 animate-expand-right"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse-bright"></div>
                    <div className="w-12 h-px bg-gradient-to-l from-transparent to-blue-400 animate-expand-left"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  <button
                    onClick={() => setMsg("Give me 3 ways AI could save me 2 hours this week")}
                    className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 text-left transition-all duration-500 hover:scale-105 hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400/60 rounded-full animate-ping"></div>

                    <div className="relative z-10">
                      <div className="text-cyan-400 mb-3 text-lg font-semibold flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
                        💡 Quick Win
                      </div>
                      <div className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-100 transition-colors">
                        "Give me 3 ways AI could save me 2 hours this week"
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMsg("Help me learn something new - what should I focus on?")}
                    className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 text-left transition-all duration-500 hover:scale-105 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-3 right-3 w-2 h-2 bg-purple-400/60 rounded-full animate-ping"></div>

                    <div className="relative z-10">
                      <div className="text-purple-400 mb-3 text-lg font-semibold flex items-center gap-2 group-hover:text-purple-300 transition-colors">
                        🎓 Learning
                      </div>
                      <div className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-100 transition-colors">
                        "Help me learn something new - what should I focus on?"
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMsg("What tasks should I automate first?")}
                    className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 text-left transition-all duration-500 hover:scale-105 hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-400/60 rounded-full animate-ping"></div>

                    <div className="relative z-10">
                      <div className="text-emerald-400 mb-3 text-lg font-semibold flex items-center gap-2 group-hover:text-emerald-300 transition-colors">
                        ⚡ Productivity
                      </div>
                      <div className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-100 transition-colors">
                        "What tasks should I automate first?"
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMsg("Help me plan my week for maximum productivity")}
                    className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 text-left transition-all duration-500 hover:scale-105 hover:border-orange-400/60 hover:shadow-2xl hover:shadow-orange-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-3 right-3 w-2 h-2 bg-orange-400/60 rounded-full animate-ping"></div>

                    <div className="relative z-10">
                      <div className="text-orange-400 mb-3 text-lg font-semibold flex items-center gap-2 group-hover:text-orange-300 transition-colors">
                        📋 Planning
                      </div>
                      <div className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-100 transition-colors">
                        "Help me plan my week for maximum productivity"
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-4">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message, index) => (
                  <div key={message.id} className={`flex gap-4 animate-fade-in-up ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    {message.role === 'assistant' && (
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg hover:scale-110 transition-transform duration-200 animate-pulse-bright">
                        <span className="text-white text-sm font-bold">C</span>
                      </div>
                    )}
                    <div className={`group max-w-2xl p-5 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-600 text-white ml-12 shadow-lg hover:shadow-cyan-500/30'
                        : 'bg-slate-800/80 text-slate-100 border border-slate-700/50 hover:border-purple-400/30 shadow-lg hover:shadow-purple-500/20'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold opacity-80">
                          {message.role === 'user' ? 'You' : 'Catalyst AI'}
                        </span>
                        <span className="text-xs opacity-60">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="leading-relaxed whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg hover:scale-110 transition-transform duration-200 animate-pulse-bright">
                        <span className="text-white text-sm font-bold">Y</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Enhanced Input Area - Fixed at Bottom */}
        <div className="border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/10 to-blue-500/5 blur-xl"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 py-6">
            <div className="space-y-4">
              {/* Enhanced Text Input */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl blur-sm group-focus-within:from-cyan-500/30 group-focus-within:to-purple-500/30 transition-all duration-300"></div>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Message Catalyst AI..."
                  rows={1}
                  className="relative w-full bg-slate-800/95 border border-slate-600/30 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 resize-none text-base shadow-xl backdrop-blur-xl transition-all duration-300 group-focus-within:shadow-2xl"
                />
                {/* Typing indicator */}
                {msg.length > 0 && (
                  <div className="absolute bottom-2 right-4 flex space-x-1">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Enhanced Primary Action */}
                <button
                  onClick={handleSubmit}
                  disabled={!msg.trim() || busy || !canSendMessage}
                  className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    busy || !canSendMessage
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30'
                  }`}
                >
                  {!busy && !(!canSendMessage) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-xl transition-all duration-300"></div>
                  )}
                  <span className="relative flex items-center gap-2">
                    {busy ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Send
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">🚀</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Enhanced Coaching Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowCoaching(!showCoaching)}
                    className="group relative px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 text-sm transform hover:scale-105 shadow-lg hover:shadow-purple-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-xl transition-all duration-300"></div>
                    <span className="relative flex items-center gap-2">
                      🎯 Coach Me
                      <span className="transform group-hover:rotate-12 transition-transform duration-300">✨</span>
                    </span>
                  </button>

                  {showCoaching && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-800 border border-slate-600 rounded-xl p-4 z-50">
                      <p className="text-sm font-medium mb-3 text-white">Choose your coaching focus:</p>
                      <div className="space-y-2">
                        <button onClick={() => handleCoachingSelect('newbie')} className="w-full text-left p-2 hover:bg-slate-700 rounded text-sm text-slate-300 hover:text-white">
                          🆕 I'm new to AI
                        </button>
                        <button onClick={() => handleCoachingSelect('business')} className="w-full text-left p-2 hover:bg-slate-700 rounded text-sm text-slate-300 hover:text-white">
                          📊 Business strategy
                        </button>
                        <button onClick={() => handleCoachingSelect('automation')} className="w-full text-left p-2 hover:bg-slate-700 rounded text-sm text-slate-300 hover:text-white">
                          ⚡ Task automation
                        </button>
                        <button onClick={() => handleCoachingSelect('strategy')} className="w-full text-left p-2 hover:bg-slate-700 rounded text-sm text-slate-300 hover:text-white">
                          🎯 Strategic thinking
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Voice Input */}
                {canListen && (
                  voiceMode ? (
                    <button
                      onClick={stopVoiceMode}
                      className="group relative px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30 hover:border-red-400/50 transform hover:scale-105"
                    >
                      <span className="flex items-center gap-2">
                        🔴 Stop Dictation
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={startListening}
                      disabled={busy}
                      className="group relative px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/30 hover:border-slate-500/50 transform hover:scale-105"
                    >
                      <span className="flex items-center gap-2">
                        🎤 Dictation
                        <span className="transform group-hover:scale-110 transition-transform duration-300">🎙️</span>
                      </span>
                    </button>
                  )
                )}

                {/* Enhanced Audio Response Toggle */}
                {canSpeak && (
                  <button
                    onClick={() => setSpeaking(!speaking)}
                    className={`group relative px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm transform hover:scale-105 ${
                      speaking
                        ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400/50'
                        : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      🔊 {speaking ? 'Audio ON' : 'Audio'}
                      {speaking && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-bright"></div>}
                      {!speaking && <span className="transform group-hover:scale-110 transition-transform duration-300">🔈</span>}
                    </span>
                  </button>
                )}

                {/* Voice Selection */}
                {canSpeak && speaking && (
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="px-2 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  >
                    {VOICE_OPTIONS.map(voice => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Status */}
                <div className="text-xs text-slate-500 ml-auto">
                  Secure & Auto-Saved
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Simple Limit Reached Overlay */}
      {showLimitOverlay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">Usage Limit Reached</h3>
            <p className="text-slate-400 mb-6">
              You've reached your {tier.name} plan limit. Upgrade to continue chatting with unlimited access.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium"
              >
                Upgrade Now
              </button>
              <button
                onClick={() => setShowLimitOverlay(false)}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          setShowLimitOverlay(false);
          // Refresh subscription state
          refreshSubscription();
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => {
          setShowAuthModal(false);
          // Refresh the page to load user data
          window.location.reload();
        }}
      />
    </div>
  );
}