import React from 'react';
import { Sparkles } from 'lucide-react';

export default function IntroModal({ onEnter }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #141c3d 0%, #050711 85%)',
        padding: '24px',
      }}
    >
      <div
        className="royal-glass"
        style={{
          maxWidth: '620px',
          width: '100%',
          padding: ' clamp(32px, 5vw, 48px) clamp(20px, 4vw, 36px)',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(212, 175, 55, 0.25)',
          border: '1.5px solid rgba(212, 175, 55, 0.5)',
          animation: 'fadeInUp 1.2s ease-out',
        }}
      >
        <div className="ornament-corner-tl" style={{ width: '22px', height: '22px' }} />
        <div className="ornament-corner-br" style={{ width: '22px', height: '22px' }} />

        {/* Sacred Ganesha Motif */}
        <div style={{ marginBottom: '18px' }}>
          <div
            style={{
              width: '74px',
              height: '74px',
              margin: '0 auto',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, transparent 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.25)',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{ width: '50px', height: '50px', fill: 'url(#goldGradientIntro)' }}
            >
              <defs>
                <linearGradient id="goldGradientIntro" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fdf3d9" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#9c7b22" />
                </linearGradient>
              </defs>
              <path d="M50 8 C46 8 43 11 43 15 C43 18 45 20 47 21 C41 23 35 28 32 35 C28 32 23 30 18 31 C12 32 8 38 9 44 C10 50 16 54 22 53 C24 53 26 52 28 50 C29 60 36 68 45 71 C45 77 47 84 52 88 C55 90 58 89 59 86 C60 83 58 80 56 79 C53 78 52 75 52 71 C62 69 70 60 71 50 C73 52 75 53 77 53 C83 54 89 50 90 44 C91 38 87 32 81 31 C76 30 71 32 67 35 C64 28 58 23 52 21 C54 20 56 18 56 15 C56 11 53 8 50 8 Z M50 25 C56 25 61 29 63 35 C59 38 55 42 52 47 C49 42 45 38 41 35 C43 29 48 25 50 25 Z" />
            </svg>
          </div>
        </div>

        {/* Sacred Sanskrit Invocation */}
        <h2
          className="font-sanskrit gold-shimmer-text"
          style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2rem)',
            letterSpacing: '0.06em',
            marginBottom: '6px',
          }}
        >
          ॥ श्री गणेशाय नमः ॥
        </h2>

        <p
          className="font-editorial"
          style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            marginBottom: '20px',
          }}
        >
          वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
          निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
        </p>

        <div
          style={{
            height: '1px',
            width: '100px',
            margin: '0 auto 20px auto',
            background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)',
          }}
        />

        <p
          className="font-serif"
          style={{
            fontSize: '1.15rem',
            color: 'var(--gold-light)',
            marginBottom: '6px',
            letterSpacing: '0.04em',
          }}
        >
          The Wedding Celebration of
        </p>

        <h1
          className="font-serif gold-gradient-text"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 2.8rem)',
            fontWeight: 700,
            marginBottom: '16px',
            letterSpacing: '0.02em',
          }}
        >
          Vinay &amp; Priya
        </h1>

        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--text-light)',
            lineHeight: 1.6,
            maxWidth: '460px',
            margin: '0 auto 28px auto',
            opacity: 0.9,
          }}
        >
          With the divine blessings of Lord Ganesha and the love of our families,
          we cordially invite you to share in our timeless joy.
        </p>

        <button
          onClick={onEnter}
          className="btn-gold"
          style={{
            fontSize: '1rem',
            padding: '14px 34px',
          }}
        >
          <Sparkles size={17} />
          <span>Enter the Royal Celebration</span>
        </button>
      </div>
    </div>
  );
}
