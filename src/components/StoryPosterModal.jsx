import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  X,
  Palette,
  Image as ImageIcon,
  Check,
  Loader2,
  ExternalLink,
  Copy,
  Calendar,
  MapPin,
  Heart,
} from 'lucide-react';
import { weddingConfig, calculateCountdownInfo } from '../config/weddingConfig';

const WhatsAppIcon = ({ size = 20, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 6.83C9.34 6.84 9.09 6.9 8.87 7.14C8.65 7.38 8.04 7.95 8.04 9.12C8.04 10.28 8.89 11.41 9.01 11.57C9.13 11.73 10.66 14.22 13.08 15.16C15.1 15.94 15.51 15.78 15.95 15.74C16.39 15.7 17.37 15.16 17.57 14.59C17.77 14.03 17.77 13.55 17.71 13.45C17.65 13.35 17.49 13.3 17.24 13.17C17 13.05 15.77 12.44 15.54 12.36C15.31 12.28 15.15 12.24 14.99 12.48C14.83 12.72 14.37 13.3 14.23 13.46C14.09 13.62 13.95 13.64 13.7 13.52C13.46 13.4 12.67 13.14 11.74 12.31C11.01 11.66 10.52 10.86 10.38 10.62C10.24 10.38 10.36 10.25 10.49 10.13C10.6 10.02 10.74 9.84 10.86 9.7C10.99 9.56 11.03 9.46 11.11 9.3C11.19 9.14 11.15 9 11.09 8.88C11.03 8.76 10.57 7.63 10.38 7.17C10.19 6.72 10 6.78 9.85 6.77C9.71 6.77 9.54 6.83 9.53 6.83Z" />
  </svg>
);

export default function StoryPosterModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [selectedThemeId, setSelectedThemeId] = useState(weddingConfig.posterThemes[0].id);
  const [selectedPhotoId, setSelectedPhotoId] = useState(weddingConfig.storyPhotos[0].id);
  const [isGenerating, setIsGenerating] = useState(true);
  const [posterDataUrl, setPosterDataUrl] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const countdown = calculateCountdownInfo();
  const currentTheme =
    weddingConfig.posterThemes.find((t) => t.id === selectedThemeId) ||
    weddingConfig.posterThemes[0];
  const currentPhoto =
    weddingConfig.storyPhotos.find((p) => p.id === selectedPhotoId) ||
    weddingConfig.storyPhotos[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Render Canvas when Modal opens or Theme / Photo changes
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;
    setIsGenerating(true);

    const renderPoster = async () => {
      try {
        // 1. Ensure fonts are loaded
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        // 2. Load the couple's real photograph
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = currentPhoto.src;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => {
            // fallback if specific image fails
            img.src = '/assets/WhatsApp Image 2026-10-25 at 9.14.08 AM.jpeg';
            img.onload = resolve;
            img.onerror = reject;
          };
        });

        if (!isSubscribed) return;

        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');

        // Draw Complete High-Res 9:16 Royal Wedding Story Poster
        drawRoyalPoster(ctx, canvas.width, canvas.height, img, currentTheme, countdown);

        const dataUrl = canvas.toDataURL('image/png', 0.98);
        if (isSubscribed) {
          setPosterDataUrl(dataUrl);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('Poster generation failed:', err);
        if (isSubscribed) {
          setIsGenerating(false);
          showToast('Could not load image. Please try another layout.');
        }
      }
    };

    renderPoster();

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, selectedThemeId, selectedPhotoId]);

  // Master Canvas Drawing Procedure
  const drawRoyalPoster = (ctx, W, H, img, theme, cd) => {
    ctx.save();

    // 1. Deep Royal Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, theme.bgGradient[0]);
    bgGrad.addColorStop(0.45, theme.bgGradient[1]);
    bgGrad.addColorStop(1, theme.bgGradient[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Subtle Radiant Radial Glow behind photo
    const radGlow = ctx.createRadialGradient(W / 2, 850, 80, W / 2, 850, 680);
    radGlow.addColorStop(0, 'rgba(212, 175, 55, 0.16)');
    radGlow.addColorStop(0.6, 'rgba(212, 175, 55, 0.04)');
    radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, W, H);

    // 3. Dual Ornate Filigree Border
    const padOuter = 46;
    const padInner = 60;
    const radius = 28;

    // Outer Border
    ctx.strokeStyle = theme.goldMuted;
    ctx.lineWidth = 2.5;
    drawRoundedRect(ctx, padOuter, padOuter, W - padOuter * 2, H - padOuter * 2, radius);
    ctx.stroke();

    // Inner Hairline Border
    ctx.strokeStyle = theme.frameBorder;
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, padInner, padInner, W - padInner * 2, H - padInner * 2, radius - 8);
    ctx.stroke();

    // Corner Mandala Accents
    drawCornerMotifs(ctx, padInner, padInner, W - padInner, H - padInner, theme.goldPrimary);

    // 4. TOP SECTION: Sacred Invocation
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sanskrit Invocation
    ctx.font = '700 44px "Rozha One", "Yatra One", serif';
    const goldTextGrad = ctx.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
    goldTextGrad.addColorStop(0, '#fff4cf');
    goldTextGrad.addColorStop(0.5, theme.goldPrimary);
    goldTextGrad.addColorStop(1, '#e2b740');
    ctx.fillStyle = goldTextGrad;
    ctx.fillText(weddingConfig.sacredInvocation, W / 2, 140);

    // Auspicious Subtitle
    ctx.font = '600 24px "Cormorant Garamond", Garamond, serif';
    ctx.fillStyle = theme.goldLight;
    ctx.letterSpacing = '5px';
    ctx.fillText(weddingConfig.subheading, W / 2, 195);
    ctx.letterSpacing = '0px';

    // Decorative Floral Divider
    drawFloralDivider(ctx, W / 2, 235, 360, theme.goldPrimary);

    // 5. COUPLE NAMES
    ctx.font = '700 68px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.45)';
    ctx.shadowBlur = 18;
    ctx.fillText('Vinay Singh', W / 2, 305);

    ctx.font = 'italic 400 46px "Cormorant Garamond", Garamond, serif';
    ctx.fillStyle = theme.goldPrimary;
    ctx.shadowBlur = 0;
    ctx.fillText('&', W / 2, 365);

    ctx.font = '700 68px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.45)';
    ctx.shadowBlur = 18;
    ctx.fillText('Priya Singh', W / 2, 430);
    ctx.shadowBlur = 0;

    // 6. CENTERPIECE PHOTOGRAPH IN ROYAL JHAROKHA ARCH
    const frameW = 780;
    const frameH = 820;
    const frameX = (W - frameW) / 2;
    const frameY = 500;

    // Draw Royal Arch Shadow & Glow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 15;
    ctx.fillStyle = '#000000';
    drawRoyalArch(ctx, frameX, frameY, frameW, frameH, 36);
    ctx.fill();
    ctx.restore();

    // Clip to Royal Arch & Draw Image
    ctx.save();
    drawRoyalArch(ctx, frameX, frameY, frameW, frameH, 36);
    ctx.clip();

    // Calculate Aspect Ratio Cover Math
    drawImageCover(ctx, img, frameX, frameY, frameW, frameH);

    // Gentle Vignette Gradient on Bottom of Photo
    const photoVignette = ctx.createLinearGradient(0, frameY + frameH - 180, 0, frameY + frameH);
    photoVignette.addColorStop(0, 'rgba(0,0,0,0)');
    photoVignette.addColorStop(1, 'rgba(5, 7, 18, 0.7)');
    ctx.fillStyle = photoVignette;
    ctx.fillRect(frameX, frameY, frameW, frameH);

    ctx.restore();

    // Golden Ornamental Arch Border
    ctx.save();
    ctx.strokeStyle = theme.goldPrimary;
    ctx.lineWidth = 4;
    drawRoyalArch(ctx, frameX, frameY, frameW, frameH, 36);
    ctx.stroke();

    // Second Inner Filigree Arch
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    drawRoyalArch(ctx, frameX + 8, frameY + 8, frameW - 16, frameH - 16, 32);
    ctx.stroke();

    // Top Arch Finial / Crown
    drawArchCrownFinial(ctx, W / 2, frameY, theme.goldPrimary);
    ctx.restore();

    // 7. DYNAMIC COUNTDOWN BADGE
    const badgeW = 860;
    const badgeH = 175;
    const badgeX = (W - badgeW) / 2;
    const badgeY = 1365;

    ctx.save();
    // Glass Badge Background
    ctx.fillStyle = theme.badgeBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 8;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 24);
    ctx.fill();

    // Gold Border
    ctx.strokeStyle = theme.frameBorder;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 24);
    ctx.stroke();
    ctx.restore();

    // Dynamic Countdown Headline (Prompt guidelines)
    ctx.font = '700 46px "Playfair Display", Georgia, serif';
    const cdGrad = ctx.createLinearGradient(badgeX, 0, badgeX + badgeW, 0);
    cdGrad.addColorStop(0, '#fff4cf');
    cdGrad.addColorStop(0.5, theme.goldPrimary);
    cdGrad.addColorStop(1, '#ffdf7a');
    ctx.fillStyle = cdGrad;
    ctx.fillText(cd.headline, W / 2, badgeY + 62);

    // Countdown Subtitle & Date
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.textMuted;
    ctx.fillText(
      `${weddingConfig.weddingDateShort} • ${weddingConfig.venue}`,
      W / 2,
      badgeY + 122
    );

    // 8. ROMANTIC QUOTE & BLESSINGS
    ctx.font = 'italic 400 27px "Cormorant Garamond", Garamond, serif';
    ctx.fillStyle = theme.goldLight;
    ctx.fillText(weddingConfig.romanticQuote, W / 2, 1600);

    // 9. SACRED SANSKRIT SHLOKA
    ctx.font = '500 23px "Rozha One", "Yatra One", serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.88)';
    ctx.fillText('॥ परस्परं भावयन्तः श्रेयः परमवाप्स्यथ ॥', W / 2, 1665);

    // 10. BOTTOM BRANDING & HASHTAG
    drawFloralDivider(ctx, W / 2, 1720, 280, theme.goldPrimary);

    ctx.font = '600 23px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.goldPrimary;
    ctx.letterSpacing = '3px';
    ctx.fillText(weddingConfig.hashtag.toUpperCase(), W / 2, 1765);
    ctx.letterSpacing = '0px';

    ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('priyaandvinay.netlify.app', W / 2, 1805);

    ctx.restore();
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

  // Helper: Draw Traditional Indian Royal Arch (Jharokha with pointed apex)
  const drawRoyalArch = (ctx, x, y, w, h, r) => {
    const cx = x + w / 2;
    const archH = 140; // peak height
    ctx.beginPath();
    // Start at bottom left
    ctx.moveTo(x, y + h - r);
    // Left vertical line
    ctx.lineTo(x, y + archH);
    // Left arch shoulder curve to peak
    ctx.bezierCurveTo(x, y + 40, cx - 120, y, cx, y);
    // Right arch peak to right shoulder
    ctx.bezierCurveTo(cx + 120, y, x + w, y + 40, x + w, y + archH);
    // Right vertical line
    ctx.lineTo(x + w, y + h - r);
    // Bottom right rounded corner
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    // Bottom horizontal line
    ctx.lineTo(x + r, y + h);
    // Bottom left rounded corner
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.closePath();
  };

  // Helper: Draw Royal Arch Crown Finial
  const drawArchCrownFinial = (ctx, cx, cy, goldColor) => {
    ctx.save();
    ctx.fillStyle = goldColor;
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2;

    // Diamond Finial
    ctx.beginPath();
    ctx.moveTo(cx, cy - 24);
    ctx.lineTo(cx + 12, cy - 12);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx - 12, cy - 12);
    ctx.closePath();
    ctx.fill();

    // Center jewel bead
    ctx.beginPath();
    ctx.arc(cx, cy - 32, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Helper: Draw Corner Floral / Paisley Motifs
  const drawCornerMotifs = (ctx, x1, y1, x2, y2, color) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;

    const size = 32;

    // Top-Left
    drawSingleCorner(ctx, x1, y1, 1, 1, size);
    // Top-Right
    drawSingleCorner(ctx, x2, y1, -1, 1, size);
    // Bottom-Left
    drawSingleCorner(ctx, x1, y2, 1, -1, size);
    // Bottom-Right
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
    ctx.arc(size / 2, size / 2, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Helper: Draw Floral Divider
  const drawFloralDivider = (ctx, cx, cy, width, color) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;

    // Left line
    ctx.beginPath();
    ctx.moveTo(cx - width / 2, cy);
    ctx.lineTo(cx - 24, cy);
    ctx.stroke();

    // Right line
    ctx.beginPath();
    ctx.moveTo(cx + 24, cy);
    ctx.lineTo(cx + width / 2, cy);
    ctx.stroke();

    // Center Diamond
    ctx.beginPath();
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx + 8, cy);
    ctx.lineTo(cx, cy + 8);
    ctx.lineTo(cx - 8, cy);
    ctx.closePath();
    ctx.fill();

    // Dots
    ctx.beginPath();
    ctx.arc(cx - 16, cy, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 16, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Helper: Draw image with cover aspect ratio
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
      srcY = 0; // Focus on faces/top
    }

    ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, w, h);
  };

  // Action: Download High-Res Poster
  const handleDownload = () => {
    if (!posterDataUrl) return;
    try {
      const link = document.createElement('a');
      link.download = `Vinay-Priya-Wedding-Countdown.png`;
      link.href = posterDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('✨ Royal Story Poster downloaded in high resolution!');
    } catch (err) {
      console.error(err);
      showToast('Download failed. Please long-press or right-click the poster to save.');
    }
  };

  // Action: Share on WhatsApp
  const handleShareWhatsApp = async () => {
    const caption = `💍 *Vinay Singh & Priya Singh — Royal Wedding Celebration* 💐\n\n✨ *${countdown.headline}*\n🗓️ *Date:* 26th November 2026\n📍 *Venue:* Satna, Madhya Pradesh\n\nJoin us in celebrating our holy matrimony:\n🌐 ${weddingConfig.websiteUrl}\n\n#PriyaWedsVinay`;

    // 1. Try Native Web Share with actual Image File
    if (posterDataUrl && navigator.canShare) {
      try {
        const blob = await (await fetch(posterDataUrl)).blob();
        const file = new File([blob], 'Vinay-Priya-Wedding-Countdown.png', {
          type: 'image/png',
        });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Vinay & Priya Wedding Story',
            text: caption,
          });
          showToast('Shared successfully!');
          return;
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Native file share failed, using fallback:', err);
        } else {
          return; // user cancelled share
        }
      }
    }

    // 2. Fallback: Automatically download image & launch WhatsApp with pre-filled text
    handleDownload();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(caption)}`;
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 600);
    showToast('Poster saved to your gallery! Opening WhatsApp to share with family.');
  };

  // Action: Share More (Web Share API / Copy Link)
  const handleShareMore = async () => {
    const shareData = {
      title: 'Vinay Singh & Priya Singh — Wedding Invitation',
      text: `Join us in celebrating the wedding of Vinay & Priya! ${countdown.headline} 💐`,
      url: weddingConfig.websiteUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyWebsiteLink();
        }
      }
    } else {
      copyWebsiteLink();
    }
  };

  const copyWebsiteLink = () => {
    navigator.clipboard
      .writeText(weddingConfig.websiteUrl)
      .then(() => {
        setIsCopied(true);
        showToast('Wedding invitation link copied to clipboard!');
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch(() => {
        showToast('Link: ' + weddingConfig.websiteUrl);
      });
  };

  if (!isOpen) return null;

  return (
    <div
      className="poster-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(3, 5, 14, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="royal-glass poster-modal-container"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '960px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          border: '2px solid var(--gold-primary)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(212, 175, 55, 0.25)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(8, 12, 28, 0.97) 0%, rgba(14, 20, 48, 0.97) 100%)',
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
            background: 'rgba(5, 8, 20, 0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="var(--gold-primary)" />
            <div>
              <h2
                className="font-serif gold-gradient-text"
                style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}
              >
                Our Wedding Story Poster ✨
              </h2>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Personalized 9:16 Story for WhatsApp Status &amp; Instagram
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Poster Modal"
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
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Split into Preview & Customizer Controls */}
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
          {/* Left Column: Live Poster Preview */}
          <div
            style={{
              flex: '1 1 50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '340px',
                aspectRatio: '9 / 16',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.2)',
                border: '2px solid var(--gold-primary)',
                background: '#040714',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Hidden High-Res Canvas */}
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
                width={1080}
                height={1920}
              />

              {/* Live Preview Image */}
              {posterDataUrl && !isGenerating && (
                <img
                  src={posterDataUrl}
                  alt="Vinay & Priya Wedding Story Poster"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              )}

              {/* Generating Loader */}
              {isGenerating && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <Loader2
                    size={42}
                    color="var(--gold-primary)"
                    style={{ animation: 'spin 1.2s linear infinite' }}
                  />
                  <span
                    className="font-serif gold-shimmer-text"
                    style={{ fontSize: '1rem', fontWeight: 600 }}
                  >
                    Crafting Royal Story Poster...
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Loading high-resolution portraits &amp; auspicious motifs
                  </span>
                </div>
              )}
            </div>

            <span
              style={{
                marginTop: '10px',
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
              }}
            >
              High Definition 1080 × 1920 px (9:16 Portrait)
            </span>
          </div>

          {/* Right Column: Interactive Options & One-Click Actions */}
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

            {/* Customizer Option 1: Select Portrait Theme */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--gold-light)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <Palette size={15} color="var(--gold-primary)" />
                <span>Choose Royal Palette</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {weddingConfig.posterThemes.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setSelectedThemeId(th.id)}
                    style={{
                      background:
                        selectedThemeId === th.id
                          ? 'rgba(212, 175, 55, 0.22)'
                          : 'rgba(10, 16, 38, 0.8)',
                      border:
                        selectedThemeId === th.id
                          ? '2px solid var(--gold-primary)'
                          : '1px solid var(--border-gold)',
                      borderRadius: '10px',
                      padding: '10px 6px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${th.bgGradient[1]}, ${th.goldPrimary})`,
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selectedThemeId === th.id && <Check size={13} color="#ffffff" />}
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: selectedThemeId === th.id ? '#ffffff' : 'var(--text-muted)',
                        textAlign: 'center',
                        lineHeight: 1.2,
                      }}
                    >
                      {th.previewBadge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customizer Option 2: Select Real Photo */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--gold-light)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <ImageIcon size={15} color="var(--gold-primary)" />
                <span>Select Couple Photograph</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {weddingConfig.storyPhotos.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setSelectedPhotoId(photo.id)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border:
                        selectedPhotoId === photo.id
                          ? '2px solid var(--gold-primary)'
                          : '1px solid var(--border-gold)',
                      cursor: 'pointer',
                      padding: 0,
                      background: '#000',
                    }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: selectedPhotoId === photo.id ? 'brightness(1.05)' : 'brightness(0.8)',
                      }}
                    />
                    {selectedPhotoId === photo.id && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'var(--gold-primary)',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={11} color="#050711" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Three Core Actions (WhatsApp, Download, Share More) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {/* Action 1: Share on WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: '50px',
                  background: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
                  transition: 'transform 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating) e.currentTarget.style.background = '#22bf5b';
                }}
                onMouseLeave={(e) => {
                  if (!isGenerating) e.currentTarget.style.background = '#25D366';
                }}
              >
                <WhatsAppIcon size={20} color="#ffffff" />
                <span>Share on WhatsApp Status</span>
              </button>

              {/* Action 2 & 3: Download & Share More */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="btn-gold"
                  style={{
                    padding: '12px 16px',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Download size={16} />
                  <span>Download PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareMore}
                  disabled={isGenerating}
                  style={{
                    padding: '12px 16px',
                    fontSize: '0.86rem',
                    background: 'rgba(10, 16, 38, 0.9)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '50px',
                    color: 'var(--gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold-primary)';
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-gold)';
                    e.currentTarget.style.background = 'rgba(10, 16, 38, 0.9)';
                  }}
                >
                  {isCopied ? <Check size={16} color="var(--gold-primary)" /> : <Share2 size={16} />}
                  <span>{isCopied ? 'Link Copied!' : 'Share More'}</span>
                </button>
              </div>
            </div>

            {/* Feedback / Toast Notice */}
            {toastMessage && (
              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.18)',
                  border: '1px solid var(--gold-primary)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.78rem',
                  color: 'var(--gold-light)',
                  textAlign: 'center',
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                {toastMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
