import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const photos = [
  {
    id: 1,
    src: '/assets/WhatsApp Image 2026-10-25 at 9.14.08 AM.jpeg',
    title: 'Royal Union',
    subtitle: 'Vinay & Priya in traditional ceremonial attire',
    aspect: 'tall',
  },
  {
    id: 'haldi',
    src: '/assets/haldi_ceremony.jpg',
    title: 'Haldi Blessings',
    subtitle: 'Vinay & Priya radiant in yellow marigold celebrations',
    aspect: 'tall',
  },
  {
    id: 2,
    src: '/assets/WhatsApp Image 2026-10-24 at 11.08.48 PM.jpeg',
    title: 'Joyous Smiles',
    subtitle: 'Candid laughter and shared moments',
    aspect: 'wide',
  },
  {
    id: 3,
    src: '/assets/WhatsApp Image 2026-10-25 at 9.13.55 AM.jpeg',
    title: 'Playful Togetherness',
    subtitle: 'Celebrating spontaneous smiles',
    aspect: 'wide',
  },
  {
    id: 4,
    src: '/assets/WhatsApp Image 2026-10-25 at 9.16.15 AM.jpeg',
    title: 'Grace & Elegance',
    subtitle: 'Priya in vibrant traditional crimson suit',
    aspect: 'tall',
  },
  {
    id: 5,
    src: '/assets/WhatsApp Image 2026-10-25 at 9.18.49 AM.jpeg',
    title: 'Dignified Journey',
    subtitle: 'Vinay at the Postal Training Centre, Vadodara',
    aspect: 'tall',
  },
  {
    id: 6,
    src: '/assets/WhatsApp Image 2026-10-25 at 9.16.12 AM.jpeg',
    title: 'Radiant Glow',
    subtitle: 'Priya smiling brightly under festive city lights',
    aspect: 'wide',
  },
  {
    id: 7,
    src: '/assets/WhatsApp Image 2026-10-25 at 9.18.50 AM.jpeg',
    title: 'Wanderlust Days',
    subtitle: 'Vinay embracing open road memories',
    aspect: 'wide',
  },
  {
    id: 8,
    src: '/assets/WhatsApp Image 2026-10-25 at 9.16.14 AM.jpeg',
    title: 'Timeless Beauty',
    subtitle: 'Warm smiles and festive spirit',
    aspect: 'tall',
  },
];

export default function MomentsGallery() {
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
      }
    };

    if (activePhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePhotoIndex]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="gallery" className="section-wrapper">
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
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
          <span>Chapter V • Cherished Memories</span>
          <Sparkles size={14} />
        </div>
        <h2
          className="font-serif gold-gradient-text"
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 700,
            marginBottom: '16px',
          }}
        >
          Our Cherished Moments
        </h2>
        <p
          className="font-editorial"
          style={{
            fontSize: '1.2rem',
            fontStyle: 'italic',
            color: 'var(--text-light)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          A glimpse into the memories, smiles, and stories that led to our forever.
        </p>
      </div>

      {/* Gallery Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {photos.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setActivePhotoIndex(index)}
            style={{
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1.5px solid var(--border-gold)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              height: '320px',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'var(--gold-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-gold)';
            }}
          >
            <img
              src={item.src}
              alt={item.title}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.6s ease',
              }}
            />

            {/* Hover/Tap Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(5, 7, 17, 0.95) 0%, rgba(12, 18, 40, 0.4) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '18px',
                transition: 'opacity 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4
                    className="font-serif"
                    style={{
                      color: 'var(--gold-light)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      marginBottom: '2px',
                    }}
                  >
                    {item.title}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-light)',
                      opacity: 0.85,
                    }}
                  >
                    {item.subtitle}
                  </span>
                </div>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.25)',
                    border: '1px solid var(--border-gold-bright)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-light)',
                  }}
                >
                  <Eye size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div
          onClick={() => setActivePhotoIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(5, 7, 17, 0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            aria-label="Close Lightbox"
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(12, 18, 40, 0.88)',
              border: '1px solid var(--border-gold)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-light)',
              cursor: 'pointer',
              zIndex: 10002,
            }}
          >
            <X size={22} />
          </button>

          {/* Previous Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Photo"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(12, 18, 40, 0.88)',
              border: '1px solid var(--border-gold)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-light)',
              cursor: 'pointer',
              zIndex: 10002,
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            aria-label="Next Photo"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(12, 18, 40, 0.88)',
              border: '1px solid var(--border-gold)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-light)',
              cursor: 'pointer',
              zIndex: 10002,
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Image & Caption Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid var(--gold-primary)',
                boxShadow: '0 0 50px rgba(212, 175, 55, 0.3)',
                maxHeight: '75vh',
              }}
            >
              <img
                src={photos[activePhotoIndex].src}
                alt={photos[activePhotoIndex].title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <h3
                className="font-serif gold-gradient-text"
                style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '4px' }}
              >
                {photos[activePhotoIndex].title}
              </h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.92rem' }}>
                {photos[activePhotoIndex].subtitle}
              </p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Photo {activePhotoIndex + 1} of {photos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
