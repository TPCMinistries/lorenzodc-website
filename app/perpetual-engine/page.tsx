'use client';

import { useEffect } from 'react';

export default function PerpetualEnginePage() {
  useEffect(() => {
    // Redirect to the static HTML presentation
    window.location.href = '/perpetual-engine.html';
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
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading Presentation...</h1>
        <p>Redirecting to the GDI Perpetual Engine experience.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
          If not redirected automatically, <a href="/perpetual-engine.html" style={{ color: '#64ffda' }}>click here</a>
        </p>
      </div>
    </div>
  );
}