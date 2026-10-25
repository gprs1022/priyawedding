import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const WhatsAppIcon = ({ size = 16, color = '#25D366' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 6.83C9.34 6.84 9.09 6.9 8.87 7.14C8.65 7.38 8.04 7.95 8.04 9.12C8.04 10.28 8.89 11.41 9.01 11.57C9.13 11.73 10.66 14.22 13.08 15.16C15.1 15.94 15.51 15.78 15.95 15.74C16.39 15.7 17.37 15.16 17.57 14.59C17.77 14.03 17.77 13.55 17.71 13.45C17.65 13.35 17.49 13.3 17.24 13.17C17 13.05 15.77 12.44 15.54 12.36C15.31 12.28 15.15 12.24 14.99 12.48C14.83 12.72 14.37 13.3 14.23 13.46C14.09 13.62 13.95 13.64 13.7 13.52C13.46 13.4 12.67 13.14 11.74 12.31C11.01 11.66 10.52 10.86 10.38 10.62C10.24 10.38 10.36 10.25 10.49 10.13C10.6 10.02 10.74 9.84 10.86 9.7C10.99 9.56 11.03 9.46 11.11 9.3C11.19 9.14 11.15 9 11.09 8.88C11.03 8.76 10.57 7.63 10.38 7.17C10.19 6.72 10 6.78 9.85 6.77C9.71 6.77 9.54 6.83 9.53 6.83Z" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'The Couple', href: '#couple' },
    { label: 'Ceremonies', href: '#ceremonies' },
    { label: 'Moments', href: '#gallery' },
    { label: 'Blessings', href: '#blessings' },
  ];

  const weddingWishText = encodeURIComponent(
    'Congratulations to Vinay Singh & Priya Singh! 💐 Wishing you both a lifetime of love, happiness, and togetherness. May your new journey be filled with beautiful memories and endless blessings. ❤️'
  );
  const whatsappUrl = `https://wa.me/919589062507?text=${weddingWishText}`;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 24px' : '20px 32px',
        background: scrolled
          ? 'rgba(10, 15, 36, 0.95)'
          : 'linear-gradient(to bottom, rgba(10, 15, 36, 0.88), transparent)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-gold)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Monogram Brand */}
        <a
          href="#hero"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            className="font-serif gold-gradient-text"
            style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '0.04em' }}
          >
            Vinay <span style={{ color: 'var(--gold-light)', fontWeight: 400 }}>&amp;</span> Priya
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '26px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                textDecoration: 'none',
                color: 'var(--text-light)',
                fontSize: '0.9rem',
                letterSpacing: '0.06em',
                fontWeight: 500,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-light)')}
            >
              {link.label}
            </a>
          ))}

          {/* Integrated WhatsApp "Send Wishes" Action Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{
              padding: '9px 20px',
              fontSize: '0.86rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <WhatsAppIcon size={17} color="#12080a" />
            <span>Send Wishes</span>
          </a>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="mobile-nav-toggle"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gold-light)',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            marginTop: '16px',
            padding: '24px',
            background: 'rgba(10, 15, 36, 0.98)',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: 'var(--text-light)',
                fontSize: '1.05rem',
                fontWeight: 500,
              }}
            >
              {link.label}
            </a>
          ))}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-gold"
            style={{
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              marginTop: '6px',
            }}
          >
            <WhatsAppIcon size={18} color="#12080a" />
            <span>Send Wishes on WhatsApp</span>
          </a>
        </div>
      )}
    </header>
  );
}
