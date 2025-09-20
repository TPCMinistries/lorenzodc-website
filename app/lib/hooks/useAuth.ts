'use client';
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } // Supabase temporarily disabled for deployment

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle sign in success
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.email);
        }

        // Handle sign out
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  };

  const isAuthenticated = !!user;
  const userId = user?.id || null;
  const userEmail = user?.email || null;

  return {
    user,
    session,
    loading,
    isAuthenticated,
    userId,
    userEmail,
    signOut
  };
}