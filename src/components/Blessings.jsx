import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Send, CheckCircle2 } from 'lucide-react';

const WhatsAppIcon = ({ size = 20, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 6.83C9.34 6.84 9.09 6.9 8.87 7.14C8.65 7.38 8.04 7.95 8.04 9.12C8.04 10.28 8.89 11.41 9.01 11.57C9.13 11.73 10.66 14.22 13.08 15.16C15.1 15.94 15.51 15.78 15.95 15.74C16.39 15.7 17.37 15.16 17.57 14.59C17.77 14.03 17.77 13.55 17.71 13.45C17.65 13.35 17.49 13.3 17.24 13.17C17 13.05 15.77 12.44 15.54 12.36C15.31 12.28 15.15 12.24 14.99 12.48C14.83 12.72 14.37 13.3 14.23 13.46C14.09 13.62 13.95 13.64 13.7 13.52C13.46 13.4 12.67 13.14 11.74 12.31C11.01 11.66 10.52 10.86 10.38 10.62C10.24 10.38 10.36 10.25 10.49 10.13C10.6 10.02 10.74 9.84 10.86 9.7C10.99 9.56 11.03 9.46 11.11 9.3C11.19 9.14 11.15 9 11.09 8.88C11.03 8.76 10.57 7.63 10.38 7.17C10.19 6.72 10 6.78 9.85 6.77C9.71 6.77 9.54 6.83 9.53 6.83Z" />
  </svg>
);

const InstagramIcon = ({ size = 16, color = '#E1306C' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Blessings() {
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    message: '',
  });
  const [sentSuccess, setSentSuccess] = useState(false);

  // Clear any legacy test data from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('priya_vinay_blessings');
    } catch (e) {}
  }, []);

  const standardGreeting =
    'Congratulations to Vinay Singh & Priya Singh! 💐 Wishing you both a lifetime of love, happiness, and togetherness. May your new journey be filled with beautiful memories and endless blessings. ❤️';

  const handleSendWishes = (e) => {
    e.preventDefault();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#d4af37', '#f5e8c7', '#a81c32', '#25D366', '#ffffff'],
      });
    } catch (err) {}

    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 5000);

    // Compose prefilled WhatsApp message
    const messageToSend = formData.message.trim()
      ? `${formData.message.trim()}\n\n— With warm regards,\n${formData.name.trim() || 'Well-wisher'}${
          formData.relation ? ` (${formData.relation})` : ''
        }`
      : `${standardGreeting}\n\n— With warm regards,\n${formData.name.trim() || 'Well-wisher'}${
          formData.relation ? ` (${formData.relation})` : ''
        }`;

    const whatsappUrl = `https://wa.me/919589062507?text=${encodeURIComponent(messageToSend)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="blessings" className="section-wrapper">
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--gold-primary)',
            fontSize: '0.85rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          <Sparkles size={15} />
          <span>Chapter VI • Auspicious Blessings</span>
          <Sparkles size={15} />
        </div>
        <h2
          className="font-serif gold-gradient-text"
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 700,
            marginBottom: '14px',
          }}
        >
          Send Wishes &amp; Blessings
        </h2>
        <p
          className="font-editorial"
          style={{
            fontSize: '1.25rem',
            fontStyle: 'italic',
            color: 'var(--gold-champagne)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Your presence and prayers complete our happiness. Send your warm congratulations directly to the Singh family.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'stretch',
        }}
      >
        {/* Left: Royal WhatsApp Wishing Portal */}
        <div
          className="royal-glass"
          style={{
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div className="ornament-corner-tl" />
          <div className="ornament-corner-br" />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid #25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WhatsAppIcon size={22} color="#25D366" />
              </div>
              <div>
                <h3 className="font-serif" style={{ color: 'var(--gold-light)', fontSize: '1.5rem', fontWeight: 600 }}>
                  Wish on WhatsApp
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Direct to the Couple &amp; Family</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-light)', fontSize: '0.92rem', marginBottom: '22px', lineHeight: 1.6 }}>
              Type your name and your personal congratulations. Clicking the button opens WhatsApp with your pre-filled wedding message.
            </p>

            {sentSuccess && (
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid #25D366',
                  color: '#e2fbe8',
                  marginBottom: '18px',
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <CheckCircle2 size={18} color="#25D366" />
                <span>Opening WhatsApp with your wishes! Thank you for showering your love.</span>
              </div>
            )}

            <form onSubmit={handleSendWishes} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--gold-primary)',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Singh & Family"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: 'rgba(10, 16, 38, 0.85)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--gold-primary)',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  Relationship / City (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Relative / Satna, MP"
                  value={formData.relation}
                  onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: 'rgba(10, 16, 38, 0.85)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--gold-primary)',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  Your Blessing Message (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Defaults to: Congratulations to Vinay & Priya! 💐 Wishing you a lifetime of love and happiness..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: 'rgba(10, 16, 38, 0.85)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-sans)',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-wishes-whatsapp"
                style={{
                  width: '100%',
                  padding: '15px 24px',
                  fontSize: '1.02rem',
                  marginTop: '8px',
                  cursor: 'pointer',
                }}
              >
                <WhatsAppIcon size={22} color="#ffffff" />
                <span>Send Wishes on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Auspicious Family Blessings & Vedic Ashirwad */}
        <div
          className="royal-glass"
          style={{
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div className="ornament-corner-tl" />
          <div className="ornament-corner-br" />

          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span
                className="font-sanskrit"
                style={{
                  fontSize: '1.3rem',
                  color: 'var(--gold-primary)',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                ॥ मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः ॥
              </span>
              <p
                className="font-editorial"
                style={{
                  fontStyle: 'italic',
                  fontSize: '1.05rem',
                  color: 'var(--gold-champagne)',
                  lineHeight: 1.5,
                }}
              >
                “May the divine bond of marriage bring timeless bliss, prosperity, and joy into the lives of Vinay and Priya.”
              </p>
            </div>

            {/* Parents Warm Regards Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '26px' }}>
              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid var(--border-gold)',
                  borderLeft: '4px solid var(--gold-primary)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 className="font-serif" style={{ color: 'var(--gold-light)', fontSize: '1.1rem', fontWeight: 600 }}>
                    Babu Singh &amp; Mithilesh Singh
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Groom's Parents
                  </span>
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                  “With hearts full of gratitude and love, we bless our children for an enchanting, harmonious life together.”
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid var(--border-gold)',
                  borderLeft: '4px solid var(--gold-primary)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 className="font-serif" style={{ color: 'var(--gold-light)', fontSize: '1.1rem', fontWeight: 600 }}>
                    Ramniwas Singh &amp; Kalpana Singh
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Bride's Parents
                  </span>
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                  “May Lord Ganesha bestow boundless peace, good health, and infinite happiness upon our beloved daughter and son.”
                </p>
              </div>
            </div>
          </div>

          {/* Social Profiles Direct Connect */}
          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-gold)' }}>
            <span
              style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--gold-primary)',
                display: 'block',
                marginBottom: '12px',
                fontWeight: 600,
              }}
            >
              Follow the Couple's Journey on Instagram
            </span>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href="https://www.instagram.com/vinay412/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold"
                style={{ flex: '1 1 140px', fontSize: '0.86rem', padding: '10px 16px' }}
              >
                <InstagramIcon size={16} color="#E1306C" />
                <span>Vinay (@vinay412)</span>
              </a>
              <a
                href="https://www.instagram.com/_silly.lilly_/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold"
                style={{ flex: '1 1 140px', fontSize: '0.86rem', padding: '10px 16px' }}
              >
                <InstagramIcon size={16} color="#E1306C" />
                <span>Priya (@_silly.lilly_)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

