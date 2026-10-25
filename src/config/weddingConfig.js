/**
 * Centralized Wedding Configuration
 * Used across the website and Story Poster Generator
 */
export const weddingConfig = {
  groom: {
    firstName: 'Vinay',
    fullName: 'Vinay Singh',
    title: 'Groom',
    city: 'Satna, Madhya Pradesh',
  },
  bride: {
    firstName: 'Priya',
    fullName: 'Priya Singh',
    title: 'Bride',
    city: 'Satna, Madhya Pradesh',
  },
  coupleTitle: 'Vinay Singh & Priya Singh',
  weddingDate: '2026-11-26T11:00:00+05:30', // Asia/Kolkata ISO string
  weddingDateFormatted: 'Thursday, 26th November 2026',
  weddingDateShort: '26 November 2026',
  venue: 'Satna, Madhya Pradesh',
  venueDetail: 'Satna Royal Banquet & Lawns, Madhya Pradesh',
  sacredInvocation: '॥ श्री गणेशाय नमः ॥',
  subheading: 'THE ROYAL WEDDING CELEBRATION',
  romanticQuote: '“Two souls, two families, united by destiny, blessed by tradition, bound forever.”',
  hashtag: '#PriyaWedsVinay',
  websiteUrl: 'https://priyaandvinay.netlify.app',

  // Available photos for the Story Poster Generator
  storyPhotos: [
    {
      id: 'royal-union',
      name: 'Royal Union (Ceremonial)',
      src: '/assets/WhatsApp Image 2026-10-25 at 9.14.08 AM.jpeg',
      description: 'Vinay & Priya in traditional ceremonial attire',
    },
    {
      id: 'haldi-bliss',
      name: 'Haldi Blessings (Marigold)',
      src: '/assets/haldi_ceremony.jpg',
      description: 'Radiant smiles in traditional haldi colors',
    },
    {
      id: 'bride-lehenga',
      name: 'Priya (Royal Crimson)',
      src: '/assets/priya_royal_lehenga.jpg',
      description: 'Imperial crimson bridal portrait',
    },
    {
      id: 'groom-sherwani',
      name: 'Vinay (Royal Sherwani)',
      src: '/assets/vinay_royal_sherwani.jpg',
      description: 'Imperial crimson groom portrait',
    },
  ],

  // Visual Themes for the Story Poster Generator (1080x1920)
  posterThemes: [
    {
      id: 'midnight-sapphire',
      name: 'Midnight Sapphire & Gold',
      bgGradient: ['#040714', '#0d163a', '#050818'],
      goldPrimary: '#e5c058',
      goldLight: '#fff2ce',
      goldMuted: '#9e7d32',
      accentColor: '#d4af37',
      textPrimary: '#ffffff',
      textMuted: '#d8c292',
      frameBorder: 'rgba(212, 175, 55, 0.85)',
      badgeBg: 'rgba(15, 23, 58, 0.85)',
      previewBadge: 'Royal Navy',
    },
    {
      id: 'velvet-crimson',
      name: 'Velvet Crimson & Gold',
      bgGradient: ['#1e040a', '#3b0814', '#150308'],
      goldPrimary: '#f7d774',
      goldLight: '#fff5d6',
      goldMuted: '#b08a34',
      accentColor: '#c21d38',
      textPrimary: '#ffffff',
      textMuted: '#eccca2',
      frameBorder: 'rgba(247, 215, 116, 0.85)',
      badgeBg: 'rgba(45, 10, 20, 0.85)',
      previewBadge: 'Imperial Red',
    },
    {
      id: 'champagne-ivory',
      name: 'Champagne Ivory & Rose Gold',
      bgGradient: ['#121017', '#251c2a', '#14101a'],
      goldPrimary: '#f3c78d',
      goldLight: '#fff0db',
      goldMuted: '#a37549',
      accentColor: '#e07a5f',
      textPrimary: '#ffffff',
      textMuted: '#e8d4c0',
      frameBorder: 'rgba(243, 199, 141, 0.85)',
      badgeBg: 'rgba(32, 24, 38, 0.85)',
      previewBadge: 'Warm Champagne',
    },
  ],
};

/**
 * Calculates dynamic countdown message according to prompt guidelines:
 * - More than 30 days: “Our Forever Begins in X Days”
 * - 8–30 days: “Only X Days to Go!”
 * - 1–7 days: “Just X Days Until Forever!”
 * - Wedding day: “Today, We Begin Our Forever!”
 * - After the wedding: “We Said Yes to Forever!”
 */
export function calculateCountdownInfo(targetIsoDate = weddingConfig.weddingDate) {
  try {
    const target = new Date(targetIsoDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (isNaN(diff)) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        headline: 'Our Forever Begins Soon',
        subtext: 'Celebrating Sacred Love',
      };
    }

    const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let headline = '';
    let subtext = '';

    if (totalDays > 30) {
      headline = `Our Forever Begins in ${totalDays} Days`;
      subtext = `${totalDays} Days to the Sacred Union`;
    } else if (totalDays >= 8) {
      headline = `Only ${totalDays} Days to Go!`;
      subtext = `Counting Down to 26 November 2026`;
    } else if (totalDays >= 1) {
      headline = `Just ${totalDays} Day${totalDays > 1 ? 's' : ''} Until Forever!`;
      subtext = `The Auspicious Moment is Almost Here`;
    } else if (totalDays === 0) {
      headline = `Today, We Begin Our Forever!`;
      subtext = `॥ शुभ विवाह ॥ Auspicious Wedding Day`;
    } else {
      headline = `We Said Yes to Forever!`;
      subtext = `United in Sacred Matrimony`;
    }

    return {
      days: Math.max(0, totalDays),
      hours: Math.max(0, hours),
      minutes: Math.max(0, minutes),
      headline,
      subtext,
    };
  } catch {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      headline: 'Our Forever Begins in 397 Days',
      subtext: 'Celebrating Sacred Love',
    };
  }
}
