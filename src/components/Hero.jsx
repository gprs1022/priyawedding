import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronDown, Calendar, MapPin, Sparkles } from 'lucide-react';

export default function Hero({ onExplore, unmuted = false }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(!unmuted);

  // Live countdown to 26 November 2026, 11:00 AM IST (Asia/Kolkata: UTC+5:30)
  const targetDate = new Date('2026-11-26T11:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  // Attempt to unmute video when unmuted prop flips to true
  useEffect(() => {
    if (unmuted && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play().then(() => {
        setIsMuted(false);
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Autoplay audio policy prevented instant unmute:', err);
      });
    }
  }, [unmuted]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true,
        });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      if (!newMutedState) {
        videoRef.current.volume = 1.0;
        videoRef.current.play();
      }
      setIsMuted(newMutedState);
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 20px 60px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Top Header: Sacred Invocation & Couple Names */}
      <div style={{ textAlign: 'center', marginBottom: '28px', zIndex: 5 }}>
        {/* Sacred Invocation Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 20px',
            borderRadius: '50px',
            background: 'rgba(16, 22, 42, 0.8)',
            border: '1px solid var(--border-gold)',
            marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <Sparkles size={14} color="var(--gold-primary)" />
          <span className="font-sanskrit gold-shimmer-text" style={{ fontSize: '1.25rem', letterSpacing: '0.04em' }}>
            ॥ श्री गणेशाय नमः ॥
          </span>
          <Sparkles size={14} color="var(--gold-primary)" />
        </div>

        <p
          className="font-editorial"
          style={{
            fontSize: '1.15rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-light)',
            marginBottom: '10px',
          }}
        >
          The Royal Wedding Celebration
        </p>

        {/* Couple Names Headline */}
        <h1
          className="font-serif gold-gradient-text"
          style={{
            fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '0.02em',
            marginBottom: '14px',
          }}
        >
          Vinay Singh <span style={{ fontStyle: 'italic', fontWeight: 400, fontSize: '0.75em', color: 'var(--gold-light)' }}>&amp;</span> Priya Singh
        </h1>

        <p
          className="font-editorial"
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            fontStyle: 'italic',
            color: 'var(--ivory-warm)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          “Two souls, two families, united by destiny, blessed by tradition, bound forever.”
        </p>
      </div>

      {/* Cinematic Centerpiece Video Theatre */}
      <div
        className="royal-glass"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1000px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '2px solid var(--gold-primary)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.25)',
          marginBottom: '36px',
          zIndex: 5,
        }}
      >
        <div className="ornament-corner-tl" />
        <div className="ornament-corner-br" />

        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000000' }}>
          <video
            ref={videoRef}
            src="/assets/VN20261025_135657.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.95) contrast(1.05)',
            }}
          />

          {/* Subtle Bottom Shade for Controls Only */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '90px',
              background: 'linear-gradient(to top, rgba(12, 9, 11, 0.95), transparent)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '16px 24px',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-light)',
                  fontWeight: 600,
                }}
              >
                Cinematic Wedding Film
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={toggleVideoMute}
                aria-label={isMuted ? 'Unmute Wedding Video Song' : 'Mute Wedding Video Song'}
                className="btn-gold"
                style={{
                  padding: '7px 16px',
                  fontSize: '0.8rem',
                  background: !isMuted ? 'var(--gold-gradient)' : 'rgba(10, 16, 38, 0.88)',
                  color: !isMuted ? '#12080a' : 'var(--gold-light)',
                  border: '1px solid var(--border-gold-bright)',
                }}
              >
                {!isMuted ? (
                  <>
                    <Volume2 size={15} />
                    <span>Music: ON</span>
                    <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px', height: '11px' }}>
                      <span style={{ width: '2px', height: '9px', background: '#12080a', animation: 'bounce 0.8s infinite' }} />
                      <span style={{ width: '2px', height: '13px', background: '#12080a', animation: 'bounce 0.6s infinite 0.2s' }} />
                      <span style={{ width: '2px', height: '7px', background: '#12080a', animation: 'bounce 0.7s infinite 0.4s' }} />
                    </span>
                  </>
                ) : (
                  <>
                    <VolumeX size={15} />
                    <span>Tap for Music</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleVideoPlay}
                aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                style={{
                  background: 'rgba(10, 16, 38, 0.88)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--gold-light)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date, Location & Live Countdown Dials (Positioned below the video to prevent any face obstruction) */}
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        {/* Date & Location Pill */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '28px',
            fontSize: '1rem',
            color: 'var(--gold-light)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--gold-primary)" />
            <span style={{ fontWeight: 600 }}>26 November 2026</span>
          </div>
          <span style={{ color: 'var(--gold-primary)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--gold-primary)" />
            <span>Satna, Madhya Pradesh</span>
          </div>
        </div>

        {/* Countdown Timer Dials */}
        <div
          className="royal-glass"
          style={{
            padding: '22px 32px',
            borderRadius: '18px',
            border: '1px solid var(--border-gold-bright)',
            marginBottom: '32px',
            width: '100%',
            maxWidth: '680px',
            textAlign: 'center',
          }}
        >
          <p
            className="font-editorial"
            style={{
              fontSize: '1rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--gold-light)',
              marginBottom: '14px',
            }}
          >
            {timeLeft.isCompleted ? 'The Sacred Matrimony Has Begun' : 'Auspicious Wedding Countdown'}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(10px, 3vw, 20px)',
            }}
          >
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 'clamp(54px, 15vw, 84px)',
                }}
              >
                <div
                  style={{
                    background: 'rgba(10, 16, 38, 0.9)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '12px',
                    width: '100%',
                    padding: '10px 4px',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
                  }}
                >
                  <span
                    className="font-serif gold-gradient-text"
                    style={{
                      fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {String(unit.value).padStart(2, '0')}
                  </span>
                </div>
                <span
                  style={{
                    marginTop: '8px',
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--text-muted)',
                  }}
                >
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={onExplore}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gold-light)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'opacity 0.2s ease',
          }}
        >
          <span style={{ fontSize: '0.82rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Discover Our Story &amp; Events
          </span>
          <ChevronDown size={20} style={{ animation: 'bounce 2s infinite' }} />
        </button>
      </div>
    </section>
  );
}
