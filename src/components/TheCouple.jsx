import React from 'react';
import { Heart, Sparkles, ExternalLink } from 'lucide-react';

const InstagramIcon = ({ size = 18, color = '#E1306C' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function TheCouple() {
  return (
    <section id="couple" className="section-wrapper">
      {/* Chapter 03 Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--gold-primary)',
            fontSize: '0.85rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          <Sparkles size={14} />
          <span>Chapter III • The Royal Protagonists</span>
          <Sparkles size={14} />
        </div>
        <h2
          className="font-serif gold-gradient-text"
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 700,
            marginBottom: '18px',
            letterSpacing: '0.02em',
          }}
        >
          The Bride &amp; The Groom
        </h2>
        <p
          className="font-editorial"
          style={{
            fontSize: '1.25rem',
            fontStyle: 'italic',
            color: 'var(--text-light)',
            maxWidth: '720px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          “Two souls destined across time, woven in royal heritage, bound in eternal love and sacred vows.”
        </p>
      </div>

      {/* Grand Dual Portrait Showcase */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          marginBottom: '50px',
        }}
      >
        {/* The Groom: Vinay Singh */}
        <div
          className="royal-glass"
          style={{
            padding: ' clamp(24px, 4vw, 36px)',
            border: '1.5px solid var(--border-gold-bright)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div className="ornament-corner-tl" />
          <div className="ornament-corner-br" />

          {/* Portrait Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              height: '480px',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '24px',
              border: '2px solid var(--gold-primary)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.7)',
            }}
          >
            <img
              src="/assets/vinay_royal_sherwani.jpg"
              alt="Vinay Singh — Royal Groom Portrait in crimson sherwani and safa"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px',
                background: 'linear-gradient(to top, rgba(10, 15, 36, 0.95), transparent)',
              }}
            >
              <span
                style={{
                  color: 'var(--gold-light)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                The Royal Groom
              </span>
            </div>
          </div>

          <h3
            className="font-serif gold-gradient-text"
            style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '6px' }}
          >
            Vinay Singh
          </h3>

          <p
            className="font-editorial"
            style={{
              fontSize: '1.15rem',
              color: 'var(--ivory-warm)',
              fontStyle: 'italic',
              marginBottom: '14px',
            }}
          >
            Son of Babu Singh &amp; Mithilesh Singh
          </p>

          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-light)',
              opacity: 0.88,
              lineHeight: 1.6,
              maxWidth: '340px',
              marginBottom: '22px',
            }}
          >
            Dignified, gracious, and standing tall with the blessings of ancestors and the affection of loved ones.
          </p>

          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/vinay412/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              padding: '10px 22px',
            }}
          >
            <InstagramIcon size={17} color="#E1306C" />
            <span>@vinay412</span>
            <ExternalLink size={13} style={{ opacity: 0.7 }} />
          </a>
        </div>

        {/* The Bride: Priya Singh */}
        <div
          className="royal-glass"
          style={{
            padding: 'clamp(24px, 4vw, 36px)',
            border: '1.5px solid var(--border-gold-bright)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div className="ornament-corner-tl" />
          <div className="ornament-corner-br" />

          {/* Portrait Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              height: '480px',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '24px',
              border: '2px solid var(--gold-primary)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.7)',
            }}
          >
            <img
              src="/assets/priya_royal_lehenga.jpg"
              alt="Priya Singh — Imperial Bride Portrait in crimson lehenga and royal jewelry"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px',
                background: 'linear-gradient(to top, rgba(10, 15, 36, 0.95), transparent)',
              }}
            >
              <span
                style={{
                  color: 'var(--gold-light)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                The Imperial Bride
              </span>
            </div>
          </div>

          <h3
            className="font-serif gold-gradient-text"
            style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '6px' }}
          >
            Priya Singh
          </h3>

          <p
            className="font-editorial"
            style={{
              fontSize: '1.15rem',
              color: 'var(--ivory-warm)',
              fontStyle: 'italic',
              marginBottom: '14px',
            }}
          >
            Daughter of Ramniwas Singh &amp; Kalpana Singh
          </p>

          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-light)',
              opacity: 0.88,
              lineHeight: 1.6,
              maxWidth: '340px',
              marginBottom: '22px',
            }}
          >
            Radiant, joyful, and embodying royal grace, entering this sacred threshold with boundless happiness.
          </p>

          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/_silly.lilly_/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              padding: '10px 22px',
            }}
          >
            <InstagramIcon size={17} color="#E1306C" />
            <span>@_silly.lilly_</span>
            <ExternalLink size={13} style={{ opacity: 0.7 }} />
          </a>
        </div>
      </div>

      {/* Union of Two Prestigious Families */}
      <div
        className="royal-glass"
        style={{
          padding: 'clamp(28px, 4vw, 44px)',
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto',
          border: '1px solid var(--border-gold-bright)',
        }}
      >
        <span
          className="font-sanskrit gold-shimmer-text"
          style={{ fontSize: '1.4rem', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}
        >
          ॥ कुलं पवित्रं जननी कृतार्था ॥
        </span>

        <h3
          className="font-serif gold-gradient-text"
          style={{ fontSize: '1.8rem', marginBottom: '14px' }}
        >
          Two Families United In Joy &amp; Honor
        </h3>

        <p
          style={{
            color: 'var(--text-light)',
            lineHeight: 1.8,
            fontSize: '1rem',
            marginBottom: '24px',
            maxWidth: '680px',
            margin: '0 auto 24px auto',
          }}
        >
          With immense happiness, we request the honor of your gracious presence and heartfelt blessings
          as our families unite in this holy bond of marriage.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-gold)',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--gold-primary)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Groom’s Parents
            </span>
            <strong style={{ fontSize: '1.15rem', color: 'var(--ivory-warm)' }}>
              Babu Singh &amp; Mithilesh Singh
            </strong>
          </div>

          <div>
            <span
              style={{
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--gold-primary)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Bride’s Parents
            </span>
            <strong style={{ fontSize: '1.15rem', color: 'var(--ivory-warm)' }}>
              Ramniwas Singh &amp; Kalpana Singh
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}
