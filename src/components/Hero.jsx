import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  Calendar,
  MapPin,
  Sparkles,
  Settings,
  Zap,
  Loader2,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';


const VIDEO_QUALITIES = {
  low: {
    key: 'low',
    label: 'Data Saver (360p)',
    badge: '360p Saver',
    size: '3.6 MB',
    bitrate: '~380 kbps',
    src: '/assets/wedding_teaser_low.mp4',
    desc: 'Instant play for 2G / 3G & low network',
  },
  balanced: {
    key: 'balanced',
    label: 'Smooth HD (480p)',
    badge: '480p Smooth',
    size: '6.7 MB',
    bitrate: '~700 kbps',
    src: '/assets/wedding_teaser_optimized.mp4',
    desc: 'Recommended: High clarity without buffering',
  },
  hd: {
    key: 'hd',
    label: 'Full HD (Original)',
    badge: '1080p HD',
    size: '24.2 MB',
    bitrate: '~2.5 Mbps',
    src: '/assets/VN20261025_135657.mp4',
    desc: 'Original high-bitrate (requires fast Wi-Fi)',
  },
};

const getNetworkQuality = () => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
        return { quality: 'low', isSlow: true, type: conn.effectiveType || '2G' };
      }
      if (conn.effectiveType === '3g') {
        return { quality: 'low', isSlow: true, type: '3G' };
      }
      return { quality: 'balanced', isSlow: false, type: conn.effectiveType || '4G' };
    }
  }
  return { quality: 'balanced', isSlow: false, type: 'Standard' };
};

export default function Hero({ onExplore, unmuted = false }) {
  const videoRef = useRef(null);
  const theatreRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(!unmuted);
  const [quality, setQuality] = useState(() => getNetworkQuality().quality);
  const [networkInfo, setNetworkInfo] = useState(() => getNetworkQuality());
  const [isBuffering, setIsBuffering] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Listen for dynamic network changes
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn && conn.addEventListener) {
        const handleConnChange = () => {
          const info = getNetworkQuality();
          setNetworkInfo(info);
          if (info.isSlow && quality === 'hd') {
            switchQuality('low');
          }
        };
        conn.addEventListener('change', handleConnChange);
        return () => conn.removeEventListener('change', handleConnChange);
      }
    }
  }, [quality]);

  // Video stream state management (detect buffering / stalled packets and handle graceful recovery)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setIsBuffering(false);
      if (quality !== 'low') {
        switchQuality('low');
      }
    };

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [quality]);

  // Viewport Intersection Observer: Pause video when scrolled far off-screen to preserve bandwidth on slow networks
  useEffect(() => {
    const theatre = theatreRef.current;
    if (!theatre) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current) {
            if (!videoRef.current.paused) {
              videoRef.current.pause();
            }
          } else if (entry.isIntersecting && videoRef.current) {
            if (isPlaying && videoRef.current.paused) {
              videoRef.current.play().catch(() => {});
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(theatre);
    return () => observer.disconnect();
  }, [isPlaying]);

  const switchQuality = (newKey) => {
    if (newKey === quality || !videoRef.current) {
      setShowQualityMenu(false);
      return;
    }
    const video = videoRef.current;
    const currentPos = video.currentTime || 0;
    const wasPaused = video.paused;

    setQuality(newKey);
    setShowQualityMenu(false);
    setIsBuffering(true);

    video.src = VIDEO_QUALITIES[newKey].src;
    video.currentTime = currentPos;
    video.load();

    if (!wasPaused) {
      video.play().catch(() => {});
    }
  };

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

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const container = theatreRef.current;
    const video = videoRef.current;
    if (!container) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {
          if (video && video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen();
          }
        });
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (video && video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
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
        ref={theatreRef}
        className="royal-glass video-theatre-root"
        style={{
          position: 'relative',
          width: isFullscreen ? '100vw' : '100%',
          height: isFullscreen ? '100vh' : 'auto',
          maxWidth: isFullscreen ? '100vw' : '1000px',
          borderRadius: isFullscreen ? '0' : '20px',
          overflow: 'hidden',
          border: isFullscreen ? 'none' : '2px solid var(--gold-primary)',
          boxShadow: isFullscreen ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.25)',
          marginBottom: isFullscreen ? '0' : '36px',
          zIndex: isFullscreen ? 9999 : 5,
          background: '#000000',
        }}
      >
        <div className="ornament-corner-tl" />
        <div className="ornament-corner-br" />

        {/* Top Floating Bandwidth & Status Pill */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '16px',
            zIndex: 15,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            background: 'rgba(8, 12, 28, 0.88)',
            border: '1px solid var(--border-gold)',
            backdropFilter: 'blur(8px)',
            fontSize: '0.74rem',
            color: 'var(--gold-light)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <Zap size={13} color="var(--gold-primary)" />
          <span>
            {quality === 'low'
              ? 'Data Saver Active (3.6 MB)'
              : quality === 'balanced'
              ? 'Fast Stream (6.7 MB)'
              : 'Full HD Master'}
          </span>
          {networkInfo.isSlow && (
            <span
              style={{
                marginLeft: '4px',
                padding: '1px 6px',
                borderRadius: '8px',
                background: 'rgba(212, 175, 55, 0.2)',
                color: 'var(--gold-primary)',
                fontSize: '0.68rem',
                fontWeight: 600,
              }}
            >
              {networkInfo.type} Slow Network
            </span>
          )}
        </div>

        <div
          className="video-inner-frame"
          style={{
            position: 'relative',
            width: '100%',
            height: isFullscreen ? '100vh' : 'auto',
            paddingTop: isFullscreen ? 0 : '56.25%',
            background: '#000000',
          }}
        >
          <video
            ref={videoRef}
            src={VIDEO_QUALITIES[quality].src}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            poster="/assets/WhatsApp Image 2026-10-25 at 9.14.08 AM.jpeg"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: isFullscreen ? 'contain' : 'cover',
              filter: 'brightness(0.95) contrast(1.05)',
            }}
          />


          {/* Buffering & Stalling Indicator */}
          {isBuffering && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(5, 7, 17, 0.65)',
                backdropFilter: 'blur(3px)',
                zIndex: 8,
                pointerEvents: 'none',
              }}
            >
              <Loader2
                size={38}
                color="var(--gold-primary)"
                style={{ animation: 'spin 1s linear infinite', marginBottom: '10px' }}
              />
              <span
                className="font-editorial"
                style={{
                  color: 'var(--gold-light)',
                  fontSize: '0.95rem',
                  letterSpacing: '0.08em',
                  fontStyle: 'italic',
                }}
              >
                Buffering smooth stream...
              </span>
            </div>
          )}

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
              padding: '16px 20px',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.82rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-light)',
                  fontWeight: 600,
                }}
              >
                Cinematic Wedding Film
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Quality Selector Dropdown Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowQualityMenu((prev) => !prev)}
                  aria-label="Select streaming quality"
                  className="btn-gold"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    background: 'rgba(10, 16, 38, 0.92)',
                    color: 'var(--gold-light)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Settings size={13} color="var(--gold-primary)" />
                  <span>{VIDEO_QUALITIES[quality].badge}</span>
                </button>

                {showQualityMenu && (
                  <div
                    className="royal-glass"
                    style={{
                      position: 'absolute',
                      bottom: '44px',
                      right: 0,
                      width: '260px',
                      padding: '10px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-gold-bright)',
                      background: 'rgba(8, 12, 28, 0.97)',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.85)',
                      zIndex: 50,
                    }}
                  >
                    <div
                      style={{
                        padding: '4px 6px 8px 6px',
                        borderBottom: '1px solid rgba(212,175,55,0.2)',
                        marginBottom: '8px',
                        fontSize: '0.72rem',
                        color: 'var(--gold-primary)',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Stream Quality</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Bandwidth Saving
                      </span>
                    </div>

                    {Object.values(VIDEO_QUALITIES).map((q) => (
                      <button
                        key={q.key}
                        type="button"
                        onClick={() => switchQuality(q.key)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background:
                            quality === q.key ? 'rgba(212, 175, 55, 0.22)' : 'transparent',
                          color: quality === q.key ? '#fff' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          textAlign: 'left',
                          marginBottom: '4px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (quality !== q.key)
                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        }}
                        onMouseLeave={(e) => {
                          if (quality !== q.key)
                            e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: 'var(--gold-light)',
                            }}
                          >
                            {q.label}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {q.size} • {q.desc}
                          </div>
                        </div>
                        {quality === q.key && (
                          <Check size={14} color="var(--gold-primary)" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Music On/Off Toggle */}
              <button
                onClick={toggleVideoMute}
                aria-label={isMuted ? 'Unmute Wedding Video Song' : 'Mute Wedding Video Song'}
                className="btn-gold"
                style={{
                  padding: '7px 14px',
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
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'flex-end',
                        gap: '2px',
                        height: '11px',
                      }}
                    >
                      <span
                        style={{
                          width: '2px',
                          height: '9px',
                          background: '#12080a',
                          animation: 'bounce 0.8s infinite',
                        }}
                      />
                      <span
                        style={{
                          width: '2px',
                          height: '13px',
                          background: '#12080a',
                          animation: 'bounce 0.6s infinite 0.2s',
                        }}
                      />
                      <span
                        style={{
                          width: '2px',
                          height: '7px',
                          background: '#12080a',
                          animation: 'bounce 0.7s infinite 0.4s',
                        }}
                      />
                    </span>
                  </>
                ) : (
                  <>
                    <VolumeX size={15} />
                    <span>Music: OFF</span>
                  </>
                )}
              </button>

              {/* Play / Pause Toggle */}
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

              {/* Fullscreen Mode Toggle */}
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
                title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
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
                  transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-primary)';
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-gold)';
                  e.currentTarget.style.background = 'rgba(10, 16, 38, 0.88)';
                  e.currentTarget.style.transform = 'scale(1.0)';
                }}
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
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
