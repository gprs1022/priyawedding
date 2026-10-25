import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Navigation, CalendarPlus, Sparkles, ArrowRight, ArrowLeft, Heart } from 'lucide-react';

const eventsData = [
  {
    id: 'tilak',
    number: '01',
    name: 'Tilak Ceremony',
    tagline: 'A sacred beginning of our new journey with Vedic blessings and ancestral grace.',
    dateText: 'Tuesday, 24 November 2026',
    timeText: '11:00 AM Onwards',
    venueName: 'Raj Vilas Palace',
    address: 'Goraiya, Satna, Madhya Pradesh',
    image: '/assets/WhatsApp Image 2026-10-25 at 9.14.08 AM.jpeg',
    imageAlt: 'Vinay and Priya formal royal ceremony portrait',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Raj+Vilas+Palace+Goraiya+Satna+Madhya+Pradesh',
    calUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vinay+%26+Priya+-+Tilak+Ceremony&dates=20261124T053000Z/20261124T103000Z&details=Tilak+Ceremony+of+Vinay+Singh+and+Priya+Singh&location=Raj+Vilas+Palace,+Goraiya,+Satna,+MP',
  },
  {
    id: 'mehendi',
    number: '02',
    name: 'Mehendi Ceremony',
    tagline: 'May your hands be filled with the deep hues of love, henna songs, and joyful laughter.',
    dateText: 'Tuesday, 24 November 2026',
    timeText: '04:00 PM Onwards',
    venueName: 'Hardua House',
    address: 'Priyadarshini Nagar, Utaili, Satna, Madhya Pradesh',
    image: '/assets/WhatsApp Image 2026-10-25 at 9.16.12 AM.jpeg',
    imageAlt: 'Priya smiling brightly under festive mehendi celebrations',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hardua+House+Priyadarshini+Nagar+Utaili+Satna',
    calUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vinay+%26+Priya+-+Mehendi+Ceremony&dates=20261124T103000Z/20261124T153000Z&details=Mehendi+Ceremony+of+Vinay+Singh+and+Priya+Singh&location=Hardua+House,+Priyadarshini+Nagar,+Utaili,+Satna',
  },
  {
    id: 'haldi',
    number: '03',
    name: 'Haldi Ceremony',
    tagline: 'May the radiant golden glow of auspicious Haldi bring prosperity, protection, and eternal cheer.',
    dateText: 'Wednesday, 25 November 2026',
    timeText: '10:00 AM Onwards',
    venueName: 'Hardua House',
    address: 'Priyadarshini Nagar, Utaili, Satna, Madhya Pradesh',
    image: '/assets/haldi_ceremony.jpg',
    imageAlt: 'Vinay and Priya in radiant yellow attire with auspicious haldi and marigold jewelry',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hardua+House+Priyadarshini+Nagar+Utaili+Satna',
    calUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vinay+%26+Priya+-+Haldi+Ceremony&dates=20261125T043000Z/20261125T093000Z&details=Haldi+Ceremony+of+Vinay+Singh+and+Priya+Singh&location=Hardua+House,+Priyadarshini+Nagar,+Utaili,+Satna',
  },
  {
    id: 'wedding',
    number: '04',
    name: 'Shubh Vivah (Wedding Ceremony)',
    tagline: 'Two souls, seven sacred rounds around the holy fire, united for seven lifetimes in timeless devotion.',
    dateText: 'Thursday, 26 November 2026',
    timeText: '11:00 AM Onwards',
    venueName: 'Parnayan Garden',
    address: 'Maihar Road, Satna, Madhya Pradesh',
    image: '/assets/priya_royal_lehenga.jpg',
    imageAlt: 'Imperial royal wedding ceremony celebration',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Parnayan+Garden+Maihar+Road+Satna+Madhya+Pradesh',
    calUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vinay+%26+Priya+-+Shubh+Vivah+(Wedding)&dates=20261126T053000Z/20261126T170000Z&details=Wedding+Ceremony+of+Vinay+Singh+and+Priya+Singh&location=Parnayan+Garden,+Maihar+Road,+Satna,+MP',
  },
];

export default function Ceremonies() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentEvent = eventsData[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === eventsData.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const blessingsElem = document.getElementById('blessings');
      if (blessingsElem) {
        blessingsElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section id="ceremonies" className="section-wrapper">
      {/* Chapter 04 Header */}
      <div style={{ textAlign: 'center', marginBottom: '45px' }}>
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
          <span>Chapter IV • Sacred Celebrations</span>
          <Sparkles size={14} />
        </div>
        <h2
          className="font-serif gold-gradient-text"
          style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.6rem)',
            fontWeight: 700,
            marginBottom: '16px',
          }}
        >
          Wedding Ceremonies
        </h2>
        <p
          className="font-editorial"
          style={{
            fontSize: '1.2rem',
            fontStyle: 'italic',
            color: 'var(--text-light)',
            maxWidth: '680px',
            margin: '0 auto 24px auto',
            lineHeight: 1.6,
          }}
        >
          Turn the pages of our wedding itinerary to discover each sacred rite of passage one by one.
        </p>

        {/* Step Progress Indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          {eventsData.map((ev, idx) => (
            <button
              key={ev.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to ${ev.name}`}
              style={{
                width: currentIndex === idx ? '34px' : '12px',
                height: '10px',
                borderRadius: '8px',
                background: currentIndex === idx ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Single Event Showcase Card (Reveal One Event at a Time) */}
      <div
        className="royal-glass"
        key={currentEvent.id}
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: 'clamp(28px, 4vw, 44px)',
          border: '1.5px solid var(--border-gold-bright)',
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        <div className="ornament-corner-tl" />
        <div className="ornament-corner-br" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(24px, 4vw, 40px)',
            alignItems: 'center',
          }}
        >
          {/* Event Image */}
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              height: '380px',
              border: '2px solid var(--gold-primary)',
              boxShadow: '0 14px 34px rgba(0,0,0,0.7)',
            }}
          >
            <img
              src={currentEvent.image}
              alt={currentEvent.imageAlt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(10, 16, 38, 0.9)',
                border: '1px solid var(--border-gold)',
                borderRadius: '8px',
                padding: '6px 14px',
                color: 'var(--gold-light)',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
              }}
            >
              Event {currentEvent.number} of 04
            </div>
          </div>

          {/* Event Details */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--gold-primary)',
                fontSize: '0.82rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '6px',
                fontWeight: 600,
              }}
            >
              <span>Satna, Madhya Pradesh</span>
            </div>

            <h3
              className="font-serif gold-gradient-text"
              style={{
                fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '10px',
              }}
            >
              {currentEvent.name}
            </h3>

            <p
              className="font-editorial"
              style={{
                fontSize: '1.05rem',
                fontStyle: 'italic',
                color: 'var(--text-light)',
                lineHeight: 1.55,
                marginBottom: '24px',
                opacity: 0.95,
              }}
            >
              “{currentEvent.tagline}”
            </p>

            {/* Time & Venue Info Box */}
            <div
              style={{
                background: 'rgba(10, 14, 28, 0.75)',
                borderRadius: '12px',
                border: '1px solid var(--border-gold)',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '26px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Calendar size={18} color="var(--gold-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</span>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--ivory-warm)', display: 'block' }}>
                    {currentEvent.dateText}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Clock size={18} color="var(--gold-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timing</span>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--ivory-warm)', display: 'block' }}>
                    {currentEvent.timeText}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--gold-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Venue &amp; Location</span>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--ivory-warm)', display: 'block' }}>
                    {currentEvent.venueName}
                  </strong>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-light)', opacity: 0.88 }}>
                    {currentEvent.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Actions: Map Directions & Calendar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
              <a
                href={currentEvent.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{ fontSize: '0.85rem', padding: '10px 20px' }}
              >
                <Navigation size={15} />
                <span>Get Directions</span>
              </a>

              <a
                href={currentEvent.calUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold"
                style={{ fontSize: '0.85rem', padding: '9px 18px' }}
              >
                <CalendarPlus size={15} />
                <span>Add to Calendar</span>
              </a>
            </div>
          </div>
        </div>

        {/* User-Controlled Navigation Bar */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="btn-outline-gold"
                style={{ padding: '10px 22px', fontSize: '0.88rem' }}
              >
                <ArrowLeft size={16} />
                <span>Previous Event</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Page {currentEvent.number} of 04
            </span>
          </div>

          <div>
            <button
              onClick={handleNext}
              className="btn-gold"
              style={{ padding: '12px 28px', fontSize: '0.92rem' }}
            >
              {!isLast ? (
                <>
                  <span>Explore Next Event</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Celebrate With Us</span>
                  <Heart size={16} fill="#12080a" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
