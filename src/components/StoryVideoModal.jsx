import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Sparkles,
  Download,
  Share2,
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Loader2,
  Calendar,
  MapPin,
  Heart,
  Palette,
  Check,
} from 'lucide-react';
import { weddingConfig, calculateCountdownInfo } from '../config/weddingConfig';

const WhatsAppIcon = ({ size = 20, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 6.83C9.34 6.84 9.09 6.9 8.87 7.14C8.65 7.38 8.04 7.95 8.04 9.12C8.04 10.28 8.89 11.41 9.01 11.57C9.13 11.73 10.66 14.22 13.08 15.16C15.1 15.94 15.51 15.78 15.95 15.74C16.39 15.7 17.37 15.16 17.57 14.59C17.77 14.03 17.77 13.55 17.71 13.45C17.65 13.35 17.49 13.3 17.24 13.17C17 13.05 15.77 12.44 15.54 12.36C15.31 12.28 15.15 12.24 14.99 12.48C14.83 12.72 14.37 13.3 14.23 13.46C14.09 13.62 13.95 13.64 13.7 13.52C13.46 13.4 12.67 13.14 11.74 12.31C11.01 11.66 10.52 10.86 10.38 10.62C10.24 10.38 10.36 10.25 10.49 10.13C10.6 10.02 10.74 9.84 10.86 9.7C10.99 9.56 11.03 9.46 11.11 9.3C11.19 9.14 11.15 9 11.09 8.88C11.03 8.76 10.57 7.63 10.38 7.17C10.19 6.72 10 6.78 9.85 6.77C9.71 6.77 9.54 6.83 9.53 6.83Z" />
  </svg>
);

export default function StoryVideoModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const previewVideoRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recorderRef = useRef(null);
  const audioCtxRef = useRef(null);

  const [selectedThemeId, setSelectedThemeId] = useState(weddingConfig.posterThemes[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [currentSceneStage, setCurrentSceneStage] = useState('Initializing pipeline...');
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoFormat, setVideoFormat] = useState({ extension: 'mp4', mime: 'video/mp4', label: 'MP4' });
  const [videoDuration, setVideoDuration] = useState('17s');
  const [videoSizeFormatted, setVideoSizeFormatted] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const countdown = calculateCountdownInfo();
  const currentTheme =
    weddingConfig.posterThemes.find((t) => t.id === selectedThemeId) ||
    weddingConfig.posterThemes[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Automatically generate video when modal is opened if none exists
      if (!videoBlobUrl && !isGenerating) {
        generateWeddingVideo();
      }
    } else {
      document.body.style.overflow = 'unset';
      stopActiveRecording();
    }
    return () => {
      document.body.style.overflow = 'unset';
      stopActiveRecording();
    };
  }, [isOpen]);

  const stopActiveRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      try {
        recorderRef.current.stop();
      } catch (e) {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  // Preload Image Helper with fallback
  const loadImage = (src, fallbackSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        if (fallbackSrc && fallbackSrc !== src) {
          const fallbackImg = new Image();
          fallbackImg.crossOrigin = 'anonymous';
          fallbackImg.onload = () => resolve(fallbackImg);
          fallbackImg.onerror = () => resolve(null);
          fallbackImg.src = fallbackSrc;
        } else {
          resolve(null);
        }
      };
      img.src = src;
    });
  };

  // Generate the Cinematic Wedding Video
  const generateWeddingVideo = async () => {
    stopActiveRecording();
    setIsGenerating(true);
    setRenderProgress(0);
    setCurrentSceneStage('Preparing high-res assets & audio...');
    setVideoBlobUrl(null);
    setVideoFile(null);

    try {
      // 1. Wait for Google fonts
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // 2. Preload images for the cinematic scenes
      const coupleImg = await loadImage(
        '/assets/WhatsApp Image 2026-10-25 at 9.14.08 AM.jpeg',
        weddingConfig.storyPhotos[0].src
      );
      const haldiImg = await loadImage(
        '/assets/haldi_ceremony.jpg',
        weddingConfig.storyPhotos[1].src
      );
      const brideImg = await loadImage(
        '/assets/priya_royal_lehenga.jpg',
        weddingConfig.storyPhotos[2].src
      );

      // 3. Setup Canvas (9:16 Portrait Standard: 720x1280)
      const width = 720;
      const height = 1280;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 4. Setup Web Audio API & Auspicious Indian Wedding Soundtrack
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext({ sampleRate: 44100 });
      audioCtxRef.current = audioCtx;
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const audioDest = audioCtx.createMediaStreamDestination();

      // Master audio gain with soft fade-in & fade-out
      const masterAudioGain = audioCtx.createGain();
      masterAudioGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterAudioGain.gain.exponentialRampToValueAtTime(0.22, audioCtx.currentTime + 1.5);
      masterAudioGain.gain.setValueAtTime(0.22, audioCtx.currentTime + 15.5);
      masterAudioGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 17.0);

      // Warm acoustic lowpass filter
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
      masterAudioGain.connect(filter);
      filter.connect(audioDest);

      // Royal Tanpura Harmonic Drone (D# root ~155.56 Hz & Pa ~233.08 Hz)
      const droneNotes = [
        { freq: 155.56, type: 'sawtooth', gain: 0.08 },
        { freq: 233.08, type: 'sine', gain: 0.09 },
        { freq: 311.12, type: 'triangle', gain: 0.04 },
        { freq: 466.16, type: 'sine', gain: 0.02 },
      ];

      droneNotes.forEach((n) => {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = n.type;
        osc.frequency.setValueAtTime(n.freq, audioCtx.currentTime);
        g.gain.setValueAtTime(n.gain, audioCtx.currentTime);
        osc.connect(g);
        g.connect(masterAudioGain);
        osc.start();
        osc.stop(audioCtx.currentTime + 17.2);
      });

      // Schedule Auspicious Temple Chime & Sitar Harmonic Bells on scene transitions
      const playAuspiciousChime = (timeOffset, freq, duration = 1.2) => {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + timeOffset);
        g.gain.setValueAtTime(0.001, audioCtx.currentTime + timeOffset);
        g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + timeOffset + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + timeOffset + duration);
        osc.connect(g);
        g.connect(masterAudioGain);
        osc.start(audioCtx.currentTime + timeOffset);
        osc.stop(audioCtx.currentTime + timeOffset + duration + 0.1);
      };

      // Chimes timed to 5 distinct scene entrances
      playAuspiciousChime(0.1, 523.25, 2.0); // C5 (Opening)
      playAuspiciousChime(0.4, 659.25, 1.8); // E5
      playAuspiciousChime(3.4, 783.99, 1.5); // G5 (Their Story)
      playAuspiciousChime(6.8, 659.25, 1.6); // E5 (Countdown)
      playAuspiciousChime(7.1, 880.0, 1.6);  // A5
      playAuspiciousChime(10.2, 987.77, 1.5); // B5 (Celebration)
      playAuspiciousChime(10.5, 1046.5, 1.8); // C6
      playAuspiciousChime(13.6, 783.99, 2.2); // G5 (Grand Closing)
      playAuspiciousChime(13.9, 1046.5, 2.5); // C6

      // 5. Setup MediaRecorder with Honest Format Detection
      const canvasStream = canvas.captureStream(30); // 30 FPS target
      const audioTrack = audioDest.stream.getAudioTracks()[0];
      const combinedTracks = [...canvasStream.getVideoTracks()];
      if (audioTrack) {
        combinedTracks.push(audioTrack);
      }
      const recordingStream = new MediaStream(combinedTracks);

      const mimeCandidates = [
        { mime: 'video/mp4;codecs=avc1,mp4a.40.2', ext: 'mp4', label: 'MP4 (H.264 / AAC)' },
        { mime: 'video/mp4;codecs=avc1', ext: 'mp4', label: 'MP4 (H.264)' },
        { mime: 'video/mp4', ext: 'mp4', label: 'MP4 (Universal)' },
        { mime: 'video/webm;codecs=vp9,opus', ext: 'webm', label: 'WebM (VP9 / Opus)' },
        { mime: 'video/webm;codecs=vp8,opus', ext: 'webm', label: 'WebM (VP8 / Opus)' },
        { mime: 'video/webm', ext: 'webm', label: 'WebM (HD Video)' },
      ];

      let selectedMime = '';
      let formatInfo = { extension: 'webm', mime: 'video/webm', label: 'WebM' };

      for (const item of mimeCandidates) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(item.mime)) {
          selectedMime = item.mime;
          formatInfo = item;
          break;
        }
      }

      setVideoFormat(formatInfo);

      const recorderOptions = selectedMime ? { mimeType: selectedMime, videoBitsPerSecond: 3000000 } : {};
      const recorder = new MediaRecorder(recordingStream, recorderOptions);
      recorderRef.current = recorder;

      const recordedChunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      const totalFrames = 510; // 17 seconds @ 30 FPS
      const fps = 30;
      let currentFrame = 0;

      recorder.start(100);

      // Pre-create dynamic particles and petals for smooth physics
      const particles = Array.from({ length: 35 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 2.8,
        speedY: 0.3 + Math.random() * 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: 0.2 + Math.random() * 0.7,
        pulseSpeed: 0.02 + Math.random() * 0.04,
      }));

      const petals = Array.from({ length: 22 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 8 + Math.random() * 10,
        speedY: 1.2 + Math.random() * 1.5,
        swingSpeed: 0.03 + Math.random() * 0.04,
        swingAmplitude: 15 + Math.random() * 20,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: 0.02 + Math.random() * 0.03,
        color: Math.random() > 0.4 ? 'rgba(235, 77, 75, 0.75)' : 'rgba(243, 156, 18, 0.75)', // Rose & Marigold
      }));

      // Render Loop
      const renderNextFrame = () => {
        if (!isOpen) {
          stopActiveRecording();
          return;
        }

        const sceneTime = currentFrame / fps;
        const progressPercent = Math.min(100, Math.round((currentFrame / totalFrames) * 100));
        setRenderProgress(progressPercent);

        // Update Scene Status Label
        if (currentFrame < 100) {
          setCurrentSceneStage('Scene 1 of 5: Sacred Invocation & Royal Names...');
        } else if (currentFrame < 200) {
          setCurrentSceneStage('Scene 2 of 5: Their Wedding Story & Ken Burns Portrait...');
        } else if (currentFrame < 300) {
          setCurrentSceneStage('Scene 3 of 5: Dynamic Wedding Countdown...');
        } else if (currentFrame < 400) {
          setCurrentSceneStage('Scene 4 of 5: The Celebration & Floating Rose Petals...');
        } else {
          setCurrentSceneStage('Scene 5 of 5: Grand Closing & Invitation Frame...');
        }

        // Draw the frame onto Canvas
        drawCinematicFrame({
          ctx,
          width,
          height,
          frame: currentFrame,
          totalFrames,
          time: sceneTime,
          theme: currentTheme,
          countdown,
          coupleImg,
          haldiImg,
          brideImg,
          particles,
          petals,
        });

        currentFrame++;

        if (currentFrame < totalFrames) {
          animationFrameRef.current = requestAnimationFrame(renderNextFrame);
        } else {
          // Finished rendering all frames
          setTimeout(() => {
            if (recorder.state === 'recording') {
              recorder.stop();
            }
          }, 200);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(recordedChunks, { type: selectedMime || 'video/webm' });
        const url = URL.createObjectURL(finalBlob);
        const fileName = `Vinay-Priya-Wedding-Story.${formatInfo.extension}`;
        const finalFile = new File([finalBlob], fileName, { type: finalBlob.type });

        const sizeMB = (finalBlob.size / (1024 * 1024)).toFixed(1);
        setVideoSizeFormatted(`${sizeMB} MB`);
        setVideoBlobUrl(url);
        setVideoFile(finalFile);
        setIsGenerating(false);
        setRenderProgress(100);
        setCurrentSceneStage('Cinematic Wedding Video Ready! 🎬');
        showToast('✨ Royal Wedding Video rendered successfully!');

        if (previewVideoRef.current) {
          previewVideoRef.current.load();
        }
      };

      // Launch animation
      animationFrameRef.current = requestAnimationFrame(renderNextFrame);
    } catch (err) {
      console.error('Video generation error:', err);
      setIsGenerating(false);
      showToast('Video generation was interrupted. Please click Regenerate.');
    }
  };

  // Master Canvas Frame Compositor
  const drawCinematicFrame = ({
    ctx,
    width: W,
    height: H,
    frame,
    totalFrames,
    time,
    theme,
    countdown: cd,
    coupleImg,
    haldiImg,
    brideImg,
    particles,
    petals,
  }) => {
    ctx.save();
    ctx.clearRect(0, 0, W, H);

    // 1. Royal Deep Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, theme.bgGradient[0]);
    bgGrad.addColorStop(0.5, theme.bgGradient[1]);
    bgGrad.addColorStop(1, theme.bgGradient[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Animated Ambient Golden Dust Particles
    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += Math.sin(frame * p.pulseSpeed) * p.speedX;
      if (p.y < 0) p.y = H;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;

      const alphaPulse = p.alpha * (0.6 + 0.4 * Math.sin(frame * 0.05));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(229, 192, 88, ${alphaPulse})`;
      ctx.fill();
    });

    // 3. Dual Ornate Filigree Border
    const padOuter = 30;
    const padInner = 40;
    const radius = 20;

    ctx.strokeStyle = theme.goldMuted;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, padOuter, padOuter, W - padOuter * 2, H - padOuter * 2, radius);
    ctx.stroke();

    ctx.strokeStyle = theme.frameBorder;
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, padInner, padInner, W - padInner * 2, H - padInner * 2, radius - 6);
    ctx.stroke();

    // Corner Ornaments
    drawCornerMotifs(ctx, padInner, padInner, W - padInner, H - padInner, theme.goldPrimary);

    // 4. Scene Determination & Cross-Fades
    // Total: 510 frames
    // Scene 1: Frames 0 - 100 (0s - 3.33s)
    // Scene 2: Frames 101 - 200 (3.33s - 6.66s)
    // Scene 3: Frames 201 - 300 (6.66s - 10.0s)
    // Scene 4: Frames 301 - 400 (10.0s - 13.33s)
    // Scene 5: Frames 401 - 510 (13.33s - 17.0s)

    if (frame < 100) {
      // ===== SCENE 1: SACRED OPENING =====
      const sceneProg = frame / 100;
      const alpha = Math.min(1, sceneProg * 2.2);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Radial Golden Aura behind sacred text
      const glow = ctx.createRadialGradient(W / 2, 420, 20, W / 2, 420, 320);
      glow.addColorStop(0, 'rgba(212, 175, 55, 0.28)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Sacred Sanskrit Invocation
      ctx.font = '700 36px "Rozha One", "Yatra One", serif';
      ctx.fillStyle = theme.goldLight;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.shadowBlur = 16;
      ctx.fillText(weddingConfig.sacredInvocation, W / 2, 340);
      ctx.shadowBlur = 0;

      // Subheading
      ctx.font = '600 17px "Cormorant Garamond", serif';
      ctx.fillStyle = theme.goldPrimary;
      ctx.letterSpacing = '4px';
      ctx.fillText('THE ROYAL WEDDING CELEBRATION', W / 2, 400);
      ctx.letterSpacing = '0px';

      // Floral Divider
      drawFloralDivider(ctx, W / 2, 445, 260, theme.goldPrimary);

      // Couple Names with shimmering reveal
      const nameScale = 1.0 + Math.sin(sceneProg * Math.PI) * 0.04;
      ctx.save();
      ctx.translate(W / 2, 530);
      ctx.scale(nameScale, nameScale);
      ctx.font = '700 52px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
      ctx.shadowBlur = 20;
      ctx.fillText('Vinay Singh', 0, 0);

      ctx.font = 'italic 400 36px "Cormorant Garamond", serif';
      ctx.fillStyle = theme.goldPrimary;
      ctx.shadowBlur = 0;
      ctx.fillText('&', 0, 55);

      ctx.font = '700 52px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
      ctx.shadowBlur = 20;
      ctx.fillText('Priya Singh', 0, 110);
      ctx.restore();

      // Opening blessing
      ctx.font = 'italic 400 20px "Cormorant Garamond", serif';
      ctx.fillStyle = theme.goldLight;
      ctx.fillText('“A match made in heaven, sealed with sacred rituals.”', W / 2, 790);

      ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('26th November 2026 • Satna, Madhya Pradesh', W / 2, 835);

      ctx.restore();
    } else if (frame < 200) {
      // ===== SCENE 2: THEIR WEDDING STORY =====
      const sceneProg = (frame - 100) / 100;
      const alpha = Math.min(1, Math.min(sceneProg * 3, (1 - sceneProg) * 3));

      ctx.save();
      ctx.globalAlpha = Math.max(0.05, alpha);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Scene Title
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = theme.goldPrimary;
      ctx.letterSpacing = '3px';
      ctx.fillText('CHAPTER I : SACRED UNION', W / 2, 120);
      ctx.letterSpacing = '0px';

      // Centerpiece Arch with Ken Burns Zoom & Pan
      const archW = 540;
      const archH = 640;
      const archX = (W - archW) / 2;
      const archY = 170;

      // Ken Burns scale from 1.00 to 1.14
      const zoom = 1.0 + sceneProg * 0.14;
      const driftY = sceneProg * 12;

      ctx.save();
      // Arch Drop Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = '#000000';
      drawRoyalArch(ctx, archX, archY, archW, archH, 26);
      ctx.fill();
      ctx.restore();

      // Clip to arch
      ctx.save();
      drawRoyalArch(ctx, archX, archY, archW, archH, 26);
      ctx.clip();

      if (coupleImg) {
        drawImageKenBurns(ctx, coupleImg, archX, archY, archW, archH, zoom, driftY);
      } else {
        ctx.fillStyle = '#1e1425';
        ctx.fillRect(archX, archY, archW, archH);
      }

      // Arch bottom gradient vignette
      const vig = ctx.createLinearGradient(0, archY + archH - 140, 0, archY + archH);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(6, 9, 24, 0.7)');
      ctx.fillStyle = vig;
      ctx.fillRect(archX, archY, archW, archH);
      ctx.restore();

      // Arch Borders
      ctx.strokeStyle = theme.goldPrimary;
      ctx.lineWidth = 3;
      drawRoyalArch(ctx, archX, archY, archW, archH, 26);
      ctx.stroke();

      drawArchCrownFinial(ctx, W / 2, archY, theme.goldPrimary);

      // Romantic Wedding Quote Below Photo
      ctx.font = 'italic 400 22px "Cormorant Garamond", serif';
      ctx.fillStyle = theme.goldLight;
      ctx.fillText('“Two souls, two families, united by destiny,', W / 2, 875);
      ctx.fillText('blessed by tradition, bound forever.”', W / 2, 910);

      // Names Banner
      drawFloralDivider(ctx, W / 2, 960, 220, theme.goldPrimary);
      ctx.font = '700 28px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Vinay & Priya', W / 2, 1005);

      ctx.restore();
    } else if (frame < 300) {
      // ===== SCENE 3: WEDDING COUNTDOWN =====
      const sceneProg = (frame - 200) / 100;
      const alpha = Math.min(1, Math.min(sceneProg * 3, (1 - sceneProg) * 3));

      ctx.save();
      ctx.globalAlpha = Math.max(0.05, alpha);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Header
      ctx.font = '700 32px "Rozha One", serif';
      ctx.fillStyle = theme.goldPrimary;
      ctx.fillText('॥ मङ्गलम् भगवान विष्णुः ॥', W / 2, 180);

      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = theme.goldLight;
      ctx.letterSpacing = '3px';
      ctx.fillText('AUSPICIOUS WEDDING COUNTDOWN', W / 2, 235);
      ctx.letterSpacing = '0px';

      drawFloralDivider(ctx, W / 2, 275, 260, theme.goldPrimary);

      // Giant Dynamic Countdown Headline (Prompt guidelines)
      ctx.font = '700 38px "Playfair Display", Georgia, serif';
      const cdGrad = ctx.createLinearGradient(W / 2 - 250, 0, W / 2 + 250, 0);
      cdGrad.addColorStop(0, '#fff4cf');
      cdGrad.addColorStop(0.5, theme.goldPrimary);
      cdGrad.addColorStop(1, '#ffdf7a');
      ctx.fillStyle = cdGrad;
      ctx.fillText(cd.headline, W / 2, 350);

      ctx.font = '500 19px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText(cd.subtext, W / 2, 400);

      // Glowing Countdown Units (Dials)
      const dialUnits = [
        { label: 'DAYS', val: String(cd.days).padStart(2, '0') },
        { label: 'HOURS', val: String(cd.hours).padStart(2, '0') },
        { label: 'MINUTES', val: String(cd.minutes).padStart(2, '0') },
      ];

      const dialW = 150;
      const dialH = 150;
      const gap = 24;
      const totalDialW = dialUnits.length * dialW + (dialUnits.length - 1) * gap;
      const startX = (W - totalDialW) / 2;
      const dialY = 470;

      dialUnits.forEach((unit, idx) => {
        const x = startX + idx * (dialW + gap);
        // Dial container
        ctx.fillStyle = 'rgba(8, 14, 36, 0.9)';
        ctx.strokeStyle = theme.frameBorder;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.35)';
        ctx.shadowBlur = 18;
        drawRoundedRect(ctx, x, dialY, dialW, dialH, 16);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Dial Value
        ctx.font = '700 52px "Playfair Display", Georgia, serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(unit.val, x + dialW / 2, dialY + 62);

        // Dial Label
        ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = theme.goldPrimary;
        ctx.letterSpacing = '2px';
        ctx.fillText(unit.label, x + dialW / 2, dialY + 115);
        ctx.letterSpacing = '0px';
      });

      // Date & Venue Details Card
      const cardW = 560;
      const cardH = 150;
      const cardX = (W - cardW) / 2;
      const cardY = 670;

      ctx.fillStyle = 'rgba(12, 18, 44, 0.85)';
      ctx.strokeStyle = theme.goldMuted;
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 22px "Playfair Display", serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(weddingConfig.weddingDateFormatted, W / 2, cardY + 50);

      ctx.font = '500 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = theme.goldLight;
      ctx.fillText(`📍 ${weddingConfig.venueDetail}`, W / 2, cardY + 95);

      // Sanskrit Shloka
      ctx.font = '500 18px "Rozha One", serif';
      ctx.fillStyle = 'rgba(212, 175, 55, 0.88)';
      ctx.fillText('॥ परस्परं भावयन्तः श्रेयः परमवाप्स्यथ ॥', W / 2, 885);

      ctx.restore();
    } else if (frame < 400) {
      // ===== SCENE 4: THE CELEBRATION =====
      const sceneProg = (frame - 300) / 100;
      const alpha = Math.min(1, Math.min(sceneProg * 3, (1 - sceneProg) * 3));

      ctx.save();
      ctx.globalAlpha = Math.max(0.05, alpha);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Celebration Header
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = theme.goldPrimary;
      ctx.letterSpacing = '3px';
      ctx.fillText('CELEBRATION OF SACRED LOVE', W / 2, 120);
      ctx.letterSpacing = '0px';

      // Haldi / Sangeet Photo in Royal Arch
      const archW = 540;
      const archH = 640;
      const archX = (W - archW) / 2;
      const archY = 160;

      // Gentle Ken Burns pan
      const zoom = 1.02 + sceneProg * 0.12;
      const driftY = -sceneProg * 10;

      ctx.save();
      drawRoyalArch(ctx, archX, archY, archW, archH, 26);
      ctx.clip();

      if (haldiImg) {
        drawImageKenBurns(ctx, haldiImg, archX, archY, archW, archH, zoom, driftY);
      } else if (coupleImg) {
        drawImageKenBurns(ctx, coupleImg, archX, archY, archW, archH, zoom, driftY);
      }

      // Warm amber celebration lighting
      const amberGlow = ctx.createRadialGradient(W / 2, archY + 100, 20, W / 2, archY + 100, 400);
      amberGlow.addColorStop(0, 'rgba(243, 156, 18, 0.22)');
      amberGlow.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = amberGlow;
      ctx.fillRect(archX, archY, archW, archH);
      ctx.restore();

      // Arch Border
      ctx.strokeStyle = theme.goldPrimary;
      ctx.lineWidth = 3;
      drawRoyalArch(ctx, archX, archY, archW, archH, 26);
      ctx.stroke();

      drawArchCrownFinial(ctx, W / 2, archY, theme.goldPrimary);

      // Floating Rose & Marigold Petals (Celebration scene physics)
      petals.forEach((petal) => {
        petal.y += petal.speedY;
        petal.rotation += petal.rotSpeed;
        const swingX = Math.sin(frame * petal.swingSpeed) * petal.swingAmplitude;

        if (petal.y > H + 20) {
          petal.y = -20;
          petal.x = Math.random() * W;
        }

        ctx.save();
        ctx.translate(petal.x + swingX, petal.y);
        ctx.rotate(petal.rotation);
        ctx.fillStyle = petal.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Celebration Rites Text
      ctx.font = '700 28px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Haldi • Sangeet • Saat Phere', W / 2, 860);

      ctx.font = 'italic 400 20px "Cormorant Garamond", serif';
      ctx.fillStyle = theme.goldLight;
      ctx.fillText('“Encircled by family, laughter, and lifelong blessings.”', W / 2, 905);

      drawFloralDivider(ctx, W / 2, 955, 240, theme.goldPrimary);

      ctx.font = '600 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = theme.goldPrimary;
      ctx.letterSpacing = '2px';
      ctx.fillText('#PriyaWedsVinay', W / 2, 995);
      ctx.letterSpacing = '0px';

      ctx.restore();
    } else {
      // ===== SCENE 5: GRAND CLOSING FRAME (Still frame for sharing) =====
      const sceneProg = (frame - 400) / 110;
      const alpha = Math.min(1, sceneProg * 2.5);

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Sacred Invocation Badge
      ctx.font = '700 32px "Rozha One", serif';
      ctx.fillStyle = theme.goldPrimary;
      ctx.fillText('॥ श्री गणेशाय नमः ॥', W / 2, 140);

      // Closing Invitation
      ctx.font = 'italic 400 24px "Cormorant Garamond", serif';
      ctx.fillStyle = theme.goldLight;
      ctx.fillText('Join Us in Celebrating Our Love', W / 2, 195);

      drawFloralDivider(ctx, W / 2, 235, 280, theme.goldPrimary);

      // Couple Names Headline
      ctx.font = '700 46px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
      ctx.shadowBlur = 18;
      ctx.fillText('Vinay Singh', W / 2, 300);

      ctx.font = 'italic 400 32px "Cormorant Garamond", serif';
      ctx.fillStyle = theme.goldPrimary;
      ctx.shadowBlur = 0;
      ctx.fillText('&', W / 2, 345);

      ctx.font = '700 46px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
      ctx.shadowBlur = 18;
      ctx.fillText('Priya Singh', W / 2, 395);
      ctx.shadowBlur = 0;

      // Circular Centerpiece Cameo with Gold Ring
      const cameoR = 145;
      const cameoX = W / 2;
      const cameoY = 575;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.beginPath();
      ctx.arc(cameoX, cameoY, cameoR, 0, Math.PI * 2);
      ctx.fillStyle = '#050714';
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cameoX, cameoY, cameoR - 4, 0, Math.PI * 2);
      ctx.clip();

      if (coupleImg) {
        drawImageCover(ctx, coupleImg, cameoX - cameoR, cameoY - cameoR, cameoR * 2, cameoR * 2);
      }
      ctx.restore();

      // Cameo Gold Border
      ctx.strokeStyle = theme.goldPrimary;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cameoX, cameoY, cameoR, 0, Math.PI * 2);
      ctx.stroke();

      // Date & Venue Details Card
      const endCardW = 560;
      const endCardH = 160;
      const endCardX = (W - endCardW) / 2;
      const endCardY = 770;

      ctx.fillStyle = 'rgba(8, 14, 38, 0.9)';
      ctx.strokeStyle = theme.frameBorder;
      ctx.lineWidth = 1.8;
      drawRoundedRect(ctx, endCardX, endCardY, endCardW, endCardH, 18);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 24px "Playfair Display", serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(weddingConfig.weddingDateFormatted, W / 2, endCardY + 45);

      ctx.font = '500 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = theme.goldLight;
      ctx.fillText(weddingConfig.venueDetail, W / 2, endCardY + 85);

      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = theme.goldPrimary;
      ctx.letterSpacing = '2px';
      ctx.fillText('SATNA, MADHYA PRADESH', W / 2, endCardY + 122);
      ctx.letterSpacing = '0px';

      // Blessings & Hashtag
      drawFloralDivider(ctx, W / 2, 980, 260, theme.goldPrimary);

      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = theme.goldPrimary;
      ctx.letterSpacing = '3px';
      ctx.fillText(weddingConfig.hashtag.toUpperCase(), W / 2, 1025);
      ctx.letterSpacing = '0px';

      ctx.font = '500 16px "Rozha One", serif';
      ctx.fillStyle = theme.goldLight;
      ctx.fillText('॥ सदा सर्वदा शुभम् ॥', W / 2, 1070);

      ctx.font = '400 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillText('priyaandvinay.netlify.app', W / 2, 1110);

      ctx.restore();
    }

    ctx.restore();
  };

  // Helper: Ken Burns Pan & Zoom math
  const drawImageKenBurns = (ctx, img, x, y, w, h, zoom, offsetY) => {
    const imgRatio = img.width / img.height;
    const targetRatio = w / h;

    let srcW, srcH, srcX, srcY;
    if (imgRatio > targetRatio) {
      srcH = img.height / zoom;
      srcW = (img.height * targetRatio) / zoom;
      srcX = (img.width - srcW) / 2;
      srcY = Math.max(0, offsetY);
    } else {
      srcW = img.width / zoom;
      srcH = (img.width / targetRatio) / zoom;
      srcX = 0;
      srcY = Math.max(0, offsetY);
    }

    ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, w, h);
  };

  // Helper: Cover aspect ratio math
  const drawImageCover = (ctx, img, x, y, w, h) => {
    const imgRatio = img.width / img.height;
    const targetRatio = w / h;

    let srcW, srcH, srcX, srcY;
    if (imgRatio > targetRatio) {
      srcH = img.height;
      srcW = img.height * targetRatio;
      srcX = (img.width - srcW) / 2;
      srcY = 0;
    } else {
      srcW = img.width;
      srcH = img.width / targetRatio;
      srcX = 0;
      srcY = 0;
    }

    ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, w, h);
  };

  // Helper: Draw Rounded Rectangle
  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Helper: Traditional Royal Arch
  const drawRoyalArch = (ctx, x, y, w, h, r) => {
    const cx = x + w / 2;
    const archH = 110;
    ctx.beginPath();
    ctx.moveTo(x, y + h - r);
    ctx.lineTo(x, y + archH);
    ctx.bezierCurveTo(x, y + 30, cx - 90, y, cx, y);
    ctx.bezierCurveTo(cx + 90, y, x + w, y + 30, x + w, y + archH);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.closePath();
  };

  // Helper: Crown Finial
  const drawArchCrownFinial = (ctx, cx, cy, goldColor) => {
    ctx.save();
    ctx.fillStyle = goldColor;
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx + 10, cy - 10);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx - 10, cy - 10);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy - 26, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Helper: Corner Motifs
  const drawCornerMotifs = (ctx, x1, y1, x2, y2, color) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.2;

    const size = 26;
    drawSingleCorner(ctx, x1, y1, 1, 1, size);
    drawSingleCorner(ctx, x2, y1, -1, 1, size);
    drawSingleCorner(ctx, x1, y2, 1, -1, size);
    drawSingleCorner(ctx, x2, y2, -1, -1, size);

    ctx.restore();
  };

  const drawSingleCorner = (ctx, x, y, sx, sy, size) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sx, sy);

    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(0, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Helper: Floral Divider
  const drawFloralDivider = (ctx, cx, cy, width, color) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.moveTo(cx - width / 2, cy);
    ctx.lineTo(cx - 20, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 20, cy);
    ctx.lineTo(cx + width / 2, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy - 7);
    ctx.lineTo(cx + 7, cy);
    ctx.lineTo(cx, cy + 7);
    ctx.lineTo(cx - 7, cy);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx - 14, cy, 2, 0, Math.PI * 2);
    ctx.arc(cx + 14, cy, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Action: Download Video
  const handleDownloadVideo = () => {
    if (!videoBlobUrl || !videoFile) return;
    try {
      const a = document.createElement('a');
      a.href = videoBlobUrl;
      a.download = videoFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`🎬 Video downloaded as ${videoFile.name}!`);
    } catch (err) {
      console.error(err);
      showToast('Download failed. Please check browser permissions.');
    }
  };

  // Action: WhatsApp Sharing (Native file share where supported + automated fallback)
  const handleWhatsAppShare = async () => {
    if (!videoBlobUrl) return;

    const caption = `💍 *Vinay Singh & Priya Singh — Wedding Story Video* 🎬💐\n\n✨ *${countdown.headline}*\n🗓️ *Date:* 26th November 2026\n📍 *Venue:* Satna, Madhya Pradesh\n\nJoin us in celebrating our holy matrimony:\n🌐 ${weddingConfig.websiteUrl}\n\n#PriyaWedsVinay`;

    // 1. Try Native Web Share with actual Video File
    if (videoFile && navigator.canShare) {
      try {
        if (navigator.canShare({ files: [videoFile] })) {
          await navigator.share({
            files: [videoFile],
            title: 'Vinay & Priya Wedding Story Video',
            text: caption,
          });
          showToast('Shared successfully!');
          return;
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Native video share failed, using fallback:', err);
        } else {
          return; // user cancelled share
        }
      }
    }

    // 2. Fallback: Automatically download video & open WhatsApp with prefilled text
    handleDownloadVideo();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(caption)}`;
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 800);
    showToast('Video saved to gallery! Opening WhatsApp to attach & share with loved ones.');
  };

  // Action: Share More (Native Web Share / Link)
  const handleShareMore = async () => {
    const shareData = {
      title: 'Vinay & Priya Wedding Video',
      text: `Watch the cinematic countdown film for Vinay & Priya! ${countdown.headline} 🎬`,
      url: weddingConfig.websiteUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyLink();
        }
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(weddingConfig.websiteUrl)
      .then(() => {
        showToast('Wedding link copied to clipboard!');
      })
      .catch(() => {
        showToast('Link: ' + weddingConfig.websiteUrl);
      });
  };

  const togglePreviewPlay = () => {
    if (previewVideoRef.current) {
      if (previewVideoRef.current.paused) {
        previewVideoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        previewVideoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="poster-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(3, 5, 14, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isGenerating) onClose();
      }}
    >
      <div
        className="royal-glass poster-modal-container"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '980px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          border: '2px solid var(--gold-primary)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 45px rgba(212, 175, 55, 0.3)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(8, 12, 28, 0.98) 0%, rgba(14, 20, 50, 0.98) 100%)',
        }}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-gold)',
            background: 'rgba(5, 8, 20, 0.85)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid var(--border-gold-bright)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Film size={18} color="var(--gold-primary)" />
            </div>
            <div>
              <h2
                className="font-serif gold-gradient-text"
                style={{ fontSize: '1.28rem', fontWeight: 700, margin: 0 }}
              >
                Wedding Story Video Generator 🎬
              </h2>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Cinematic 9:16 Countdown Film for WhatsApp Status &amp; Reels
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Video Modal"
            disabled={isGenerating}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-gold)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: 'var(--gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              opacity: isGenerating ? 0.4 : 1,
              transition: 'background 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Split into Video Player & Control Actions */}
        <div
          className="poster-modal-body"
          style={{
            display: 'flex',
            flexDirection: 'row',
            overflowY: 'auto',
            padding: '24px',
            gap: '28px',
          }}
        >
          {/* Left Column: Video Preview Player */}
          <div
            style={{
              flex: '1 1 50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
            }}
          >
            {/* Hidden Off-Screen Canvas used for rendering frames */}
            <canvas ref={canvasRef} style={{ display: 'none' }} width={720} height={1280} />

            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '340px',
                aspectRatio: '9 / 16',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(212, 175, 55, 0.25)',
                border: '2px solid var(--gold-primary)',
                background: '#040714',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Ready Video Player */}
              {videoBlobUrl && !isGenerating && (
                <video
                  ref={previewVideoRef}
                  src={videoBlobUrl}
                  controls
                  playsInline
                  loop
                  autoPlay
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    background: '#000000',
                    display: 'block',
                  }}
                />
              )}

              {/* Rendering & Progress State */}
              {isGenerating && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '24px',
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <Loader2
                      size={54}
                      color="var(--gold-primary)"
                      style={{ animation: 'spin 1.2s linear infinite' }}
                    />
                    <Sparkles
                      size={20}
                      color="var(--gold-light)"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </div>

                  <span
                    className="font-serif gold-shimmer-text"
                    style={{ fontSize: '1.15rem', fontWeight: 700 }}
                  >
                    Rendering Wedding Film...
                  </span>

                  {/* Progress Bar Container */}
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '240px',
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-gold)',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${renderProgress}%`,
                        background: 'linear-gradient(90deg, #d4af37, #f7df94)',
                        transition: 'width 0.2s ease-out',
                        boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: 'var(--gold-light)',
                      }}
                    >
                      {renderProgress}%
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      • 30 FPS High Definition
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '0.76rem',
                      color: 'var(--gold-light)',
                      fontStyle: 'italic',
                      lineHeight: 1.4,
                    }}
                  >
                    {currentSceneStage}
                  </p>
                </div>
              )}
            </div>

            {/* Video Format & Specs Badge */}
            {videoBlobUrl && !isGenerating && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--gold-light)',
                    fontWeight: 600,
                  }}
                >
                  {videoFormat.label}
                </span>
                <span>• 720 × 1280 (9:16)</span>
                <span>• {videoDuration}</span>
                {videoSizeFormatted && <span>• {videoSizeFormatted}</span>}
              </div>
            )}
          </div>

          {/* Right Column: Customization Controls & Sharing Actions */}
          <div
            style={{
              flex: '1 1 50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            {/* Countdown Highlights Banner */}
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '14px 18px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}
              >
                <Heart size={16} color="var(--gold-primary)" fill="var(--gold-primary)" />
                <span
                  className="font-serif gold-gradient-text"
                  style={{ fontSize: '1.05rem', fontWeight: 700 }}
                >
                  {countdown.headline}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {countdown.subtext} • 26th November 2026, Satna
              </p>
            </div>

            {/* Scene Sequence Preview Breakdown */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--gold-light)',
                  letterSpacing: '0.04em',
                }}
              >
                <Film size={15} color="var(--gold-primary)" />
                <span>Cinematic 5-Scene Sequence</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '6px',
                  fontSize: '0.76rem',
                }}
              >
                {[
                  { num: '1', title: 'Sacred Opening', desc: '॥ श्री गणेशाय नमः ॥ & Animated Couple Names' },
                  { num: '2', title: 'Their Story', desc: 'Ken Burns Zoom on Vinay & Priya Royal Portrait' },
                  { num: '3', title: 'Countdown', desc: `${countdown.headline} & Auspicious Dials` },
                  { num: '4', title: 'Celebration', desc: 'Haldi Ceremony & Drifting Rose/Marigold Petals' },
                  { num: '5', title: 'Grand Closing', desc: '26 Nov 2026, Satna Venue & #PriyaWedsVinay' },
                ].map((s) => (
                  <div
                    key={s.num}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                    }}
                  >
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'rgba(212, 175, 55, 0.2)',
                        color: 'var(--gold-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    >
                      {s.num}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 600, color: 'var(--gold-light)', marginRight: '6px' }}>
                        {s.title}:
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Theme Selector for Visual Tone */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--gold-light)',
                  letterSpacing: '0.04em',
                }}
              >
                <Palette size={15} color="var(--gold-primary)" />
                <span>Select Color Atmosphere</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {weddingConfig.posterThemes.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => {
                        setSelectedThemeId(theme.id);
                        setTimeout(() => generateWeddingVideo(), 50);
                      }}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        background: isSelected
                          ? 'rgba(212, 175, 55, 0.2)'
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected
                          ? '2px solid var(--gold-primary)'
                          : '1px solid rgba(212, 175, 55, 0.25)',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${theme.bgGradient[1]}, ${theme.goldPrimary})`,
                          border: '2px solid #ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && <Check size={14} color="#0c090b" strokeWidth={3} />}
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: isSelected ? '#ffffff' : 'var(--text-muted)',
                        }}
                      >
                        {theme.previewBadge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
              {/* WhatsApp Share Button (Emerald Green Hero) */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                disabled={isGenerating || !videoBlobUrl}
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  padding: '13px 20px',
                  borderRadius: '50px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: isGenerating || !videoBlobUrl ? 'not-allowed' : 'pointer',
                  opacity: isGenerating || !videoBlobUrl ? 0.5 : 1,
                  boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <WhatsAppIcon size={20} color="#ffffff" />
                <span>Share Video on WhatsApp</span>
              </button>

              {/* Download & More Share Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadVideo}
                  disabled={isGenerating || !videoBlobUrl}
                  className="btn-story-glow"
                  style={{
                    padding: '11px 16px',
                    fontSize: '0.88rem',
                    justifyContent: 'center',
                    cursor: isGenerating || !videoBlobUrl ? 'not-allowed' : 'pointer',
                    opacity: isGenerating || !videoBlobUrl ? 0.5 : 1,
                  }}
                >
                  <Download size={16} color="#0c090b" />
                  <span>Download Video</span>
                </button>

                {/* Regenerate Button */}
                <button
                  type="button"
                  onClick={generateWeddingVideo}
                  disabled={isGenerating}
                  style={{
                    padding: '11px 16px',
                    fontSize: '0.88rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--gold-light)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  <RotateCcw size={15} color="var(--gold-primary)" />
                  <span>Regenerate</span>
                </button>
              </div>

              {/* Share More / Copy Link Button */}
              <button
                type="button"
                onClick={handleShareMore}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <Share2 size={13} color="var(--gold-primary)" />
                <span>Share invitation link via other apps</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(8, 12, 28, 0.96)',
              border: '1px solid var(--gold-primary)',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: '30px',
              fontSize: '0.86rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.4)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            <Sparkles size={16} color="var(--gold-primary)" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
