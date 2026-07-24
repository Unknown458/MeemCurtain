// ─── Shared gallery data + types ──────────────────────────────────────────
// Single source of truth for gallery items, filters, and recent-work lookups
// so that the Gallery page, Home page, and ImageModal all stay in sync.

export type Cat = 'lounge' | 'bedroom' | 'dining' | 'kitchen' | 'studio'

export type GalleryItem = {
  id: number
  cat: Cat
  title: string
  img: string
  description: string
  fabric: string
  room: string
  light: string
  care: string
}

const base = import.meta.env.BASE_URL + 'images/'

export const allItems: GalleryItem[] = [
  // Lounge
  {
    id: 1,
    cat: 'lounge',
    title: 'Classic Lounge Drape',
    img: base + 'lounge.png',
    description:
      'A timeless floor-to-ceiling drape in warm neutral tones, tailored to frame your living room with understated elegance. Soft fall, generous fullness, and a polished heading that suits both modern and classic interiors.',
    fabric: 'Polyester blend with linen texture',
    room: 'Lounge / Living Room',
    light: 'Light filtering · Soft glow',
    care: 'Gentle machine wash, cool iron',
  },
  {
    id: 2,
    cat: 'lounge',
    title: 'Emerald Velvet Drape',
    img: base + 'lounge_2.png',
    description:
      'Plush emerald velvet that adds depth and a touch of luxury to your lounge. The heavyweight weave drapes beautifully and gently dampens sound for a cosier space.',
    fabric: 'Premium crushed velvet',
    room: 'Lounge / Living Room',
    light: 'Dim-out · Reduced glare',
    care: 'Dry clean only',
  },
  {
    id: 3,
    cat: 'lounge',
    title: 'Ivory & Terracotta Panel',
    img: base + 'lounge_3.png',
    description:
      'A two-tone panel pairing soft ivory with warm terracotta for a sunlit, Mediterranean feel. Perfect for bright, airy living spaces that still need a little evening privacy.',
    fabric: 'Cotton-linen mix',
    room: 'Lounge / Living Room',
    light: 'Light filtering',
    care: 'Machine wash 30°, hang dry',
  },
  // Bedroom
  {
    id: 4,
    cat: 'bedroom',
    title: 'Golden Bedroom Sheer',
    img: base + 'bedroom.png',
    description:
      'A delicate golden sheer that bathes your bedroom in warm, diffused light. Layer it under a heavier drape for day-to-night versatility and a hotel-style finish.',
    fabric: 'Voile sheer',
    room: 'Bedroom',
    light: 'Sheer · Daytime privacy',
    care: 'Gentle machine wash',
  },
  {
    id: 5,
    cat: 'bedroom',
    title: 'Royal Blue Blackout',
    img: base + 'bedroom_2.png',
    description:
      'Deep royal blue blackout curtains engineered for total darkness and better sleep. The triple-weave fabric also insulates against heat and cold, keeping your bedroom comfortable year-round.',
    fabric: 'Triple-weave blackout',
    room: 'Bedroom',
    light: '100% blackout',
    care: 'Machine wash cold, tumble dry low',
  },
  {
    id: 6,
    cat: 'bedroom',
    title: 'Sage Green Linen Panel',
    img: base + 'bedroom_3.png',
    description:
      'A calming sage green panel in natural linen — the perfect backdrop for a restful bedroom. Breathable, textured, and effortlessly stylish.',
    fabric: 'Pure linen',
    room: 'Bedroom',
    light: 'Light filtering',
    care: 'Dry clean recommended',
  },
  // Dining
  {
    id: 7,
    cat: 'dining',
    title: 'Elegant Dining Room',
    img: base + 'dining.png',
    description:
      'Graceful dining room drapes that frame your table setting with sophistication. The flowing fabric softens acoustics for intimate dinners and special occasions alike.',
    fabric: 'Suede-look microfibre',
    room: 'Dining Room',
    light: 'Dim-out · Soft light',
    care: 'Machine wash gentle cycle',
  },
  {
    id: 8,
    cat: 'dining',
    title: 'Burgundy Velvet Drape',
    img: base + 'dining_2.png',
    description:
      'Rich burgundy velvet brings warmth and drama to your dining room. The dense pile catches candlelight beautifully and adds an inviting, layered feel.',
    fabric: 'Heavyweight velvet',
    room: 'Dining Room',
    light: 'Dim-out',
    care: 'Dry clean only',
  },
  {
    id: 9,
    cat: 'dining',
    title: 'Sheer Scandinavian Panel',
    img: base + 'dining_3.png',
    description:
      'A crisp white sheer inspired by Scandinavian minimalism — clean, bright, and airy. Lets maximum daylight in while keeping the space feeling open and uncluttered.',
    fabric: 'Textured voile',
    room: 'Dining Room',
    light: 'Sheer',
    care: 'Machine wash 30°',
  },
  // Kitchen
  {
    id: 10,
    cat: 'kitchen',
    title: 'Café Kitchen Curtain',
    img: base + 'kitchen.png',
    description:
      'A charming café-style curtain that covers the lower half of your kitchen window for privacy while leaving the top open for natural light. Moisture-friendly and easy to keep fresh.',
    fabric: 'Easy-care cotton poly',
    room: 'Kitchen',
    light: 'Half-light · Privacy tier',
    care: 'Machine wash warm',
  },
  // Studio
  {
    id: 11,
    cat: 'studio',
    title: 'Studio Blackout Panel',
    img: base + 'studio.png',
    description:
      'A complete-light-blocking panel built for home studios, media rooms, and shift workers. Heavy, sound-dampening, and thermally insulating for total control over your environment.',
    fabric: 'Triple-weave blackout',
    room: 'Studio / Media Room',
    light: '100% blackout',
    care: 'Machine wash cold',
  },
]

export const filters: { slug: 'all' | Cat; label: string }[] = [
  { slug: 'all', label: 'All Collections' },
  { slug: 'lounge', label: 'Lounge Curtain' },
  { slug: 'bedroom', label: 'Bed Room Curtain' },
  { slug: 'dining', label: 'Dining Room' },
  { slug: 'kitchen', label: 'Kitchen' },
  { slug: 'studio', label: 'Studio' },
]

// Maps a recent-work card (from Home) to its full gallery record by image URL.
export function findItemByImg(img: string): GalleryItem | undefined {
  return allItems.find((i) => i.img === img)
}
