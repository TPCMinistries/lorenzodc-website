'use client';

import { useEffect } from 'react';

export default function DelegatedAuthorityPresentation() {
  useEffect(() => {
    // Redirect to the static HTML presentation
    window.location.href = '/delegated-authority.html';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading Presentation...</h1>
        <p>Redirecting to the full presentation experience.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
          If not redirected automatically, <a href="/delegated-authority.html" style={{ color: '#60a5fa' }}>click here</a>
        </p>
      </div>
    </div>
  );
}