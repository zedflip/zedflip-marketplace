// SEO Utility Functions

/**
 * Generate SEO-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50);
}

/**
 * Format price for display and SEO
 */
export function formatPriceForSEO(price: number): string {
  return `K ${price.toLocaleString('en-ZM')}`;
}

/**
 * Generate listing URL with slug
 */
export function generateListingUrl(id: string, title: string): string {
  const slug = generateSlug(title);
  return `/listing/${slug}-${id}`;
}

/**
 * Generate category URL
 */
export function generateCategoryUrl(categorySlug: string): string {
  return `/category/${categorySlug}`;
}

/**
 * Generate city URL
 */
export function generateCityUrl(city: string): string {
  return `/city/${generateSlug(city)}`;
}

/**
 * Generate optimized image alt text
 */
export function generateImageAlt(
  title: string,
  city: string,
  price: number
): string {
  return `${title} for sale in ${city} - ${formatPriceForSEO(price)}`;
}

/**
 * Zambia cities for SEO
 */
export const ZAMBIA_CITIES = [
  'Lusaka',
  'Kitwe',
  'Ndola',
  'Kabwe',
  'Livingstone',
  'Chipata',
  'Mansa',
  'Mongu',
  'Solwezi',
  'Kasama',
  'Mufulira',
  'Luanshya',
];

/**
 * Generate city-specific keywords
 */
export function generateCityKeywords(city: string): string {
  return `buy sell ${city.toLowerCase()}, second hand ${city.toLowerCase()}, marketplace ${city.toLowerCase()}, used items ${city.toLowerCase()}, classifieds ${city.toLowerCase()} zambia`;
}

/**
 * Generate category-specific keywords
 */
export function generateCategoryKeywords(
  category: string,
  city?: string
): string {
  const baseKeywords = `${category.toLowerCase()} for sale zambia, buy ${category.toLowerCase()} zambia, second hand ${category.toLowerCase()}`;
  if (city) {
    return `${baseKeywords}, ${category.toLowerCase()} ${city.toLowerCase()}`;
  }
  return baseKeywords;
}

/**
 * Generate listing-specific keywords
 */
export function generateListingKeywords(
  title: string,
  category: string,
  city: string
): string {
  const words = title.toLowerCase().split(' ').slice(0, 3).join(' ');
  return `${words} ${city.toLowerCase()}, ${category.toLowerCase()} ${city.toLowerCase()}, buy ${words} zambia`;
}

/**
 * Cloudinary image optimization URL
 */
export function optimizeCloudinaryImage(
  imageUrl: string,
  width: number = 400,
  quality: string = 'auto'
): string {
  if (!imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  // Insert transformation parameters
  return imageUrl.replace(
    '/upload/',
    `/upload/q_${quality},f_auto,w_${width}/`
  );
}
