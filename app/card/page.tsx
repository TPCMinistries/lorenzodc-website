'use client';

import { useEffect } from 'react';

export default function CardPage() {
  useEffect(() => {
    // Load QR code library and generate QR code
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = () => {
      // @ts-ignore
      new QRCode(document.getElementById("qrcode"), {
        text: "https://lorenzodc.com",
        width: 180,
        height: 180,
        colorDark: "#1e293b",
        colorLight: "#ffffff",
        // @ts-ignore
        correctLevel: QRCode.CorrectLevel.H
      });
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Lorenzo A. Daughtry-Chambers
N:Daughtry-Chambers;Lorenzo;A;;
TITLE:Spiritual Strategist & AI Transformation Expert
ORG:The Global Development Enterprise
EMAIL;TYPE=INTERNET,WORK:Lorenzo@theglobalenterprise.org
TEL;TYPE=CELL:(917) 862-3550
URL:https://lorenzodc.com
NOTE:Bridging Divine Vision with Systematic Implementation\\n\\nKey Offerings:\\n• AI Transformation & Enterprise Consulting\\n• Divine Activation & Spiritual Strategy\\n• Global Development & Impact Missions\\n• The Perpetual Engine - Social Enterprise Model\\n• Catalyst AI Platform\\n• Kenya 2026 Medical Mission\\n• $50M Impact Fund
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Lorenzo-Daughtry-Chambers.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show success message
    const message = document.getElementById('successMessage');
    if (message) {
      message.style.transform = 'translateX(-50%) translateY(0)';
      message.style.opacity = '1';
      setTimeout(() => {
        message.style.transform = 'translateX(-50%) translateY(-100px)';
        message.style.opacity = '0';
      }, 3000);
    }
  };

  const containerStyle = {
    margin: 0,
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const successMessageStyle = {
    position: 'fixed' as const,
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%) translateY(-100px)',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '14px',
    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
    opacity: 0,
    transition: 'all 0.4s ease',
    zIndex: 1000
  };

  const cardContainerStyle = {
    maxWidth: '450px',
    width: '100%'
  };

  const businessCardStyle = {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const buttonStyle = {
    padding: '14px 20px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '13px',
    textAlign: 'center' as const,
    textDecoration: 'none',
    transition: 'all 0.3s',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #f97316, #ef4444)',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#e2e8f0',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  return (
    <div style={containerStyle}>
      <div id="successMessage" style={successMessageStyle}>
        ✓ Contact saved! Check your downloads
      </div>

      <div style={cardContainerStyle}>
        <div style={businessCardStyle}>
          {/* Header gradient bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #f97316, #ef4444, #8b5cf6)'
          }}></div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Lorenzo A. Daughtry-Chambers
            </h1>
            <p style={{ fontSize: '16px', color: '#f97316', fontWeight: 600, marginBottom: '4px' }}>
              Spiritual Strategist & AI Transformation Expert
            </p>
            <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
              Bridging Divine Vision with Systematic Implementation
            </p>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            margin: '25px 0'
          }}></div>

          {/* What I Do */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '12px', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', fontWeight: 600 }}>What I Do</h3>
            <div style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '8px', paddingLeft: '18px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#f97316', fontWeight: 'bold' }}>→</span>
              AI Transformation & Enterprise Consulting
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '8px', paddingLeft: '18px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#f97316', fontWeight: 'bold' }}>→</span>
              Divine Activation & Spiritual Strategy
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '8px', paddingLeft: '18px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#f97316', fontWeight: 'bold' }}>→</span>
              Global Development & Impact Missions
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '8px', paddingLeft: '18px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#f97316', fontWeight: 'bold' }}>→</span>
              Speaking & Executive Coaching
            </div>
          </div>

          {/* Key Offerings */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '12px', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', fontWeight: 600 }}>Key Offerings</h3>
            <div style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '8px', paddingLeft: '18px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#f97316', fontWeight: 'bold' }}>→</span>
              The Perpetual Engine - Social Enterprise Model
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '8px', paddingLeft: '18px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#f97316', fontWeight: 'bold' }}>→</span>
              Catalyst AI Platform - Business Transformation
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '8px', paddingLeft: '18px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#f97316', fontWeight: 'bold' }}>→</span>
              Kenya 2026 Medical Mission - $100K+ Impact
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '8px', paddingLeft: '18px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#f97316', fontWeight: 'bold' }}>→</span>
              $50M Impact Fund - AI & Social Good
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            margin: '25px 0'
          }}></div>

          {/* Contact Info */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#e2e8f0', fontSize: '14px' }}>
              <svg style={{ width: '18px', height: '18px', marginRight: '12px', color: '#f97316' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <a href="mailto:Lorenzo@theglobalenterprise.org" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                Lorenzo@theglobalenterprise.org
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#e2e8f0', fontSize: '14px' }}>
              <svg style={{ width: '18px', height: '18px', marginRight: '12px', color: '#f97316' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <a href="tel:9178623550" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                (917) 862-3550
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#e2e8f0', fontSize: '14px' }}>
              <svg style={{ width: '18px', height: '18px', marginRight: '12px', color: '#f97316' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/>
              </svg>
              <a href="https://lorenzodc.com" target="_blank" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                lorenzodc.com
              </a>
            </div>
          </div>

          {/* QR Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            marginTop: '25px'
          }}>
            <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600, marginBottom: '15px' }}>
              Scan to Visit My Website
            </div>
            <div id="qrcode" style={{ display: 'inline-block' }}></div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', fontWeight: 500 }}>
              lorenzodc.com
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}>
            <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
              💾 Save my contact or 🌐 explore my work
            </p>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '25px' }}>
            <button onClick={downloadVCard} style={primaryButtonStyle}>
              <svg style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Add to Contacts
            </button>
            <a href="https://lorenzodc.com" target="_blank" style={secondaryButtonStyle}>
              Visit Website
            </a>
          </div>

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <a href="https://lorenzodc.com/perpetual-engine" target="_blank" style={{
              color: '#f97316',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              display: 'inline-block',
              padding: '8px 0'
            }}>
              🔄 Learn About The Perpetual Engine →
            </a>
          </div>

          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <a href="mailto:Lorenzo@theglobalenterprise.org" style={{
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '13px'
            }}>
              ✉️ Quick Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}