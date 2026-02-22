import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  city?: string;
  noindex?: boolean;
}

const defaultMeta = {
  siteName: 'ZedFlip',
  titleTemplate: '%s | ZedFlip - Buy & Sell in Zambia',
  defaultDescription: "ZedFlip is Zambia's #1 marketplace. Buy and sell second-hand items in Lusaka, Kitwe, Ndola, and across Zambia. Safe, fast, and free!",
  defaultKeywords: 'buy sell zambia, second hand lusaka, marketplace zambia, zedflip, used items kitwe, classifieds ndola, buy and sell zambia',
  defaultImage: 'https://zedflip.com/og-image.jpg',
  twitterHandle: '@zedflip',
  siteUrl: 'https://zedflip.com',
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description = defaultMeta.defaultDescription,
  keywords = defaultMeta.defaultKeywords,
  image = defaultMeta.defaultImage,
  url,
  type = 'website',
  price,
  city,
  noindex = false,
}) => {
  const fullTitle = `${title} | ${defaultMeta.siteName} - Buy & Sell in Zambia`;
  const fullUrl = url ? `${defaultMeta.siteUrl}${url}` : defaultMeta.siteUrl;

  // Enhanced description with city if provided
  const enhancedDescription = city
    ? `${description} Located in ${city}, Zambia.`
    : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={enhancedDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Geo Meta Tags for Zambia */}
      <meta name="geo.region" content="ZM" />
      <meta name="geo.placename" content={city || 'Lusaka'} />
      <meta name="geo.position" content="-15.3875;28.3228" />
      <meta name="ICBM" content="-15.3875, 28.3228" />

      {/* Hreflang for Regional Targeting */}
      <link rel="alternate" hrefLang="en-zm" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={enhancedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_ZM" />
      <meta property="og:site_name" content={defaultMeta.siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={defaultMeta.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={enhancedDescription} />
      <meta name="twitter:image" content={image} />

      {/* Product specific meta (for listings) */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content="ZMW" />
        </>
      )}
    </Helmet>
  );
};

export default SEO;
