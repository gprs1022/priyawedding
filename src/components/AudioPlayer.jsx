import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function AudioPlayer({ autoStart = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const droneNodesRef = useRef([]);

  // Create an authentic Indian Tanpura/Shehnai harmonic drone using Web Audio API
  const startDrone = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Root Sa (D# / ~155.56 Hz) and Pa (~233.08 Hz)
      const baseFreq = 155.56;
      const notes = [
        { freq: baseFreq, gain: 0.12, type: 'sawtooth' },
        { freq: baseFreq * 1.5, gain: 0.08, type: 'sine' }, // Pa
        { freq: baseFreq * 2, gain: 0.05, type: 'triangle' }, // High Sa
        { freq: baseFreq * 2.5, gain: 0.03, type: 'sine' }, // Shuddha Ga
        { freq: baseFreq * 3, gain: 0.02, type: 'sine' }, // High Pa
      ];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 3);

      // Lowpass warm filter for royal acoustic warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      masterGain.connect(filter);
      filter.connect(ctx.destination);

      const createdOscs = [];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        osc.type = note.type;
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime);

        // Subtle gentle vibrato
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.2 + Math.random() * 0.3, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(note.freq * 0.012, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(note.gain, ctx.currentTime);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start();

        createdOscs.push(osc, lfo);
      });

      droneNodesRef.current = { masterGain, createdOscs };
      setIsPlaying(true);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  };

  const stopDrone = () => {
    if (droneNodesRef.current && droneNodesRef.current.masterGain && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      droneNodesRef.current.masterGain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + 0.8
      );
      setTimeout(() => {
        if (droneNodesRef.current?.createdOscs) {
          droneNodesRef.current.createdOscs.forEach((o) => {
            try {
              o.stop();
            } catch (e) {}
          });
        }
        droneNodesRef.current = null;
        setIsPlaying(false);
      }, 800);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopDrone();
    } else {
      startDrone();
    }
  };

  useEffect(() => {
    if (autoStart) {
      startDrone();
    }
    return () => {
      stopDrone();
    };
  }, [autoStart]);

  return (
    <div className="fixed-audio-control" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 100,
    }}>
      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Mute Royal Wedding Shehnai Music' : 'Play Royal Wedding Shehnai Music'}
        className="btn-gold"
        style={{
          padding: '10px 18px',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: isPlaying ? '0 0 20px rgba(212, 175, 55, 0.6)' : '0 4px 14px rgba(0,0,0,0.5)',
          background: isPlaying ? 'var(--gold-gradient)' : 'rgba(12, 28, 23, 0.85)',
          color: isPlaying ? '#0a090b' : 'var(--gold-light)',
          border: '1px solid var(--border-gold-bright)',
        }}
      >
        {isPlaying ? (
          <>
            <Volume2 size={16} />
            <span>Music: Playing</span>
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#0a090b',
              animation: 'pulse 1.5s infinite',
            }} />
          </>
        ) : (
          <>
            <VolumeX size={16} />
            <span>Music: Muted</span>
          </>
        )}
      </button>
    </div>
  );
}
