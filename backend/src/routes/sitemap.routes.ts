import { Router, Request, Response } from 'express';
import Listing from '../models/Listing';
import Category from '../models/Category';

const router = Router();

const ZAMBIA_CITIES = [
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

const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/how-it-works', priority: '0.8', changefreq: 'monthly' },
  { url: '/safety', priority: '0.7', changefreq: 'monthly' },
  { url: '/terms', priority: '0.5', changefreq: 'yearly' },
  { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
  { url: '/contact', priority: '0.6', changefreq: 'monthly' },
];

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// GET /api/sitemap.xml
router.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const baseUrl = 'https://zedflip.com';
    const today = formatDate(new Date());

    // Fetch active listings (last 1000)
    const listings = await Listing.find({ status: 'active' })
      .sort({ updatedAt: -1 })
      .limit(1000)
      .select('_id title updatedAt')
      .lean();

    // Fetch categories
    const categories = await Category.find({ isActive: true })
      .select('slug name')
      .lean();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Static pages
    for (const page of STATIC_PAGES) {
      xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // City pages
    for (const city of ZAMBIA_CITIES) {
      const citySlug = generateSlug(city);
      xml += `  <url>
    <loc>${baseUrl}/city/${citySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;
    }

    // Category pages
    for (const category of categories) {
      xml += `  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;
    }

    // Listing pages
    for (const listing of listings) {
      const slug = generateSlug(listing.title);
      const lastmod = formatDate(new Date(listing.updatedAt));
      xml += `  <url>
    <loc>${baseUrl}/listing/${slug}-${listing._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// GET /api/sitemap-index.xml (for large sites)
router.get('/sitemap-index.xml', async (req: Request, res: Response) => {
  const baseUrl = 'https://zedflip.com';
  const today = formatDate(new Date());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/api/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

export default router;
