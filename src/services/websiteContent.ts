import type { GalleryItem, GalleryMedia } from '../components/galleryData'

export interface ContentMedia {
  mediaId: number
  mediaType: number
  mediaPath: string
  imageDescription?: string
  altText?: string
  isPrimary?: boolean
  displayOrder?: number
}

export interface ContentItem {
  contentId: number
  contentType: string
  category: string
  title: string
  shortDescription?: string
  description?: string
  price?: number
  currency?: string
  warranty?: string
  customFields?: {
    fabric?: string
    room?: string
    care?: string
    light?: string
    [key: string]: string | undefined
  }
  displayOrder?: number
  media?: ContentMedia[]
}

export interface WebsiteData {
  websiteId: number
  websiteCode: string
  websiteName: string
  generatedAt: string
  contents: ContentItem[]
}

/**
 * Origin that hosts the website content and its media.
 * The JSON returns relative mediaPath values (e.g. "/images/xxx.png") that are
 * served from this domain, so we resolve them against it to keep images dynamic
 * and working in every environment (local dev included).
 */
export const CONTENT_BASE_URL = 'https://www.meemcurtain.co.za'

/**
 * Resolves a media path from the API into a fully-qualified, loadable URL.
 * Absolute URLs are returned as-is; relative paths are resolved against the
 * content origin so images load regardless of where the site is hosted.
 */
export function resolveMediaUrl(path?: string): string {
  if (!path) return `${CONTENT_BASE_URL}/images/lounge.png`
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${CONTENT_BASE_URL}${cleanPath}`
}

/**
 * Normalizes a category or room name to a clean URL slug (e.g. 'Lounge / Living Room' -> 'lounge')
 */
export function deriveCategorySlug(category?: string, room?: string): string {
  const source = (room || category || 'other').toLowerCase()
  if (source.includes('lounge') || source.includes('living')) return 'lounge'
  if (source.includes('bed')) return 'bedroom'
  if (source.includes('dining')) return 'dining'
  if (source.includes('kitchen')) return 'kitchen'
  if (source.includes('studio') || source.includes('media')) return 'studio'

  // Fallback to simple slug
  return source.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'all'
}

/**
 * Maps an API ContentItem to the GalleryItem model used by Gallery & ImageModal
 */
export function mapContentToGalleryItem(item: ContentItem): GalleryItem {
  const mediaList: GalleryMedia[] = (item.media || []).map((m) => ({
    mediaId: m.mediaId,
    mediaType: m.mediaType,
    mediaPath: resolveMediaUrl(m.mediaPath),
    imageDescription: m.imageDescription,
    altText: m.altText,
    isPrimary: m.isPrimary,
    displayOrder: m.displayOrder,
  }))

  // Primary image
  const primary = mediaList.find((m) => m.isPrimary) || mediaList[0]
  const imgUrl = primary ? primary.mediaPath : '/images/lounge.png'

  const catSlug = deriveCategorySlug(item.category, item.customFields?.room)

  return {
    id: item.contentId,
    cat: catSlug,
    category: item.category,
    title: item.title,
    img: imgUrl,
    shortDescription: item.shortDescription || '',
    description: item.description || item.shortDescription || 'Handcrafted custom curtain.',
    price: typeof item.price === 'number' ? item.price : undefined,
    currency: item.currency || 'ZAR',
    warranty: item.warranty || '',
    fabric: item.customFields?.fabric || 'Custom Fabric',
    room: item.customFields?.room || item.category || 'All Rooms',
    care: item.customFields?.care || 'Standard Care',
    light: item.customFields?.light || 'Light filtering',
    customFields: item.customFields as Record<string, string> | undefined,
    media: mediaList,
  }
}

// ─── Dynamic Category / Subcategory Tree ───────────────────────────────────

export interface SubCategory {
  slug: string          // URL-safe slug, e.g. "lounge-living-room"
  label: string         // Display label, e.g. "Lounge / Living Room"
  count: number         // number of items in this subcategory
}

export interface Category {
  slug: string          // URL-safe slug, e.g. "curtains"
  label: string         // Display label, e.g. "Curtains"
  count: number         // total items in this category
  subCategories: SubCategory[]
}

export interface CategoryTree {
  all: { label: string; count: number }
  categories: Category[]
}

/**
 * Converts any string to a URL-safe slug
 * e.g. "Lounge / Living Room" → "lounge-living-room"
 */
export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Builds a full Category + SubCategory tree.
 * Accepts either ContentItem[] or GalleryItem[] — both have category / customFields / room.
 */
export function buildCategoryTree(items: Array<{
  category?: string
  room?: string
  customFields?: Record<string, string | undefined>
}>): CategoryTree {
  // Maps: category-slug → { label, subcategory-slug → { label, ids } }
  const catMap = new Map<string, {
    label: string
    subMap: Map<string, { label: string; count: number }>
    count: number
  }>()

  for (const item of items) {
    const catLabel = (item.category || 'Other').trim()
    const catSlug  = toSlug(catLabel)

    // Sub-category: prefer explicit customFields.subCategory, then room, else "Other"
    const subLabel =
      (item.customFields?.subCategory || item.customFields?.room || 'Other').trim()
    const subSlug  = toSlug(subLabel)

    // Upsert category
    if (!catMap.has(catSlug)) {
      catMap.set(catSlug, { label: catLabel, subMap: new Map(), count: 0 })
    }
    const catEntry = catMap.get(catSlug)!
    catEntry.count++

    // Upsert subcategory
    if (!catEntry.subMap.has(subSlug)) {
      catEntry.subMap.set(subSlug, { label: subLabel, count: 0 })
    }
    catEntry.subMap.get(subSlug)!.count++
  }

  const categories: Category[] = Array.from(catMap.entries()).map(([catSlug, entry]) => ({
    slug: catSlug,
    label: entry.label,
    count: entry.count,
    subCategories: Array.from(entry.subMap.entries()).map(([subSlug, sub]) => ({
      slug: subSlug,
      label: sub.label,
      count: sub.count,
    })),
  }))

  return {
    all: { label: 'All Collections', count: items.length },
    categories,
  }
}

/**
 * Fetches website content JSON from /website-content.json with fallback to live domain
 */
export async function fetchWebsiteContent(): Promise<WebsiteData> {
  const endpoint = '/website-content.json'

  try {
    const res = await fetch(endpoint, { cache: 'no-cache' })
    if (res.ok) {
      return (await res.json()) as WebsiteData
    }
  } catch (err) {
    console.warn('Could not fetch from /website-content.json, attempting live domain fallback:', err)
  }

  // Fallback to full URL
  const fallbackRes = await fetch('https://www.meemcurtain.co.za/website-content.json')
  if (!fallbackRes.ok) {
    throw new Error(`Failed to load website content: ${fallbackRes.statusText}`)
  }
  return (await fallbackRes.json()) as WebsiteData
}
