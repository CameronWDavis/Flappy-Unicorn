import React from 'react';

export function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(30, 15, 50, 0.35)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.96)',
        padding: '1.75rem 2rem',
        borderRadius: 18,
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(100, 50, 150, 0.35)',
        maxWidth: '82%',
        border: '2px solid rgba(255,255,255,0.9)',
      }}>
        {children}
      </div>
    </div>
  );
}

export function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '0.7rem', color: '#8B6FB3', letterSpacing: '0.08em',
        fontWeight: 700, textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        fontSize: '2rem', fontWeight: 900, color: '#5B2A86',
        lineHeight: 1, marginTop: '0.2rem',
      }}>{value}</div>
    </div>
  );
}

