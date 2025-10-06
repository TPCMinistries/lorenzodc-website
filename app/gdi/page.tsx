'use client';

import { useEffect } from 'react';

export default function GDIPage() {
  useEffect(() => {
    // Redirect to the perpetual engine presentation
    window.location.href = '/perpetual-engine';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0e1a',
      color: '#e6f1ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Global Development Institute</h1>
        <p>Redirecting to the Perpetual Engine presentation...</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
          If not redirected automatically, <a href="/perpetual-engine" style={{ color: '#64ffda' }}>click here</a>
        </p>
      </div>
    </div>
  );
}