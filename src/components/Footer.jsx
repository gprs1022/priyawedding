import React from 'react';
import { ChevronUp, Heart } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 5,
        padding: '70px 24px 40px 24px',
        background: 'linear-gradient(to bottom, transparent, rgba(12, 18, 40, 0.95) 40%, #050711 100%)',
        borderTop: '1px solid var(--border-gold)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Sacred Shubh Vivah */}
        <p
          className="font-sanskrit gold-shimmer-text"
          style={{ fontSize: '2rem', letterSpacing: '0.08em', marginBottom: '12px' }}
        >
          ॥ शुभ विवाह ॥
        </p>

        <h3
          className="font-serif gold-gradient-text"
          style={{
            fontSize: '2.4rem',
            fontWeight: 700,
            marginBottom: '18px',
          }}
        >
          Vinay Singh &amp; Priya Singh
        </h3>

        <p
          className="font-editorial"
          style={{
            fontSize: '1.15rem',
            fontStyle: 'italic',
            color: 'var(--text-light)',
            lineHeight: 1.7,
            maxWidth: '560px',
            margin: '0 auto 28px auto',
          }}
        >
          “Your presence, prayers, and heartfelt wishes mean the world to us as we begin this sacred voyage of love and devotion.”
        </p>

        {/* Family Warm Regards */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '36px',
            padding: '24px 0',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
            marginBottom: '32px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-primary)' }}>
              With Warm Regards
            </span>
            <p style={{ color: 'var(--ivory-warm)', fontWeight: 600, marginTop: '4px' }}>
              Babu Singh &amp; Mithilesh Singh
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-primary)' }}>
              With Warm Regards
            </span>
            <p style={{ color: 'var(--ivory-warm)', fontWeight: 600, marginTop: '4px' }}>
              Ramniwas Singh &amp; Kalpana Singh
            </p>
          </div>
        </div>

        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          style={{
            background: 'rgba(12, 18, 40, 0.85)',
            border: '1px solid var(--border-gold)',
            color: 'var(--gold-light)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--gold-primary)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-gold)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ChevronUp size={22} />
        </button>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          24th – 26th November 2026 • Satna, Madhya Pradesh
        </p>
      </div>
    </footer>
  );
}
