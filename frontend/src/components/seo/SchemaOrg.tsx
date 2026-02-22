import { Helmet } from 'react-helmet-async';

// Website Schema for HomePage
export const WebsiteSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://zedflip.com/#website',
        url: 'https://zedflip.com',
        name: 'ZedFlip',
        description: "Zambia's #1 Marketplace for Buying and Selling",
        publisher: {
          '@id': 'https://zedflip.com/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://zedflip.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://zedflip.com/#organization',
        name: 'ZedFlip',
        url: 'https://zedflip.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://zedflip.com/logo.png',
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://facebook.com/zedflip',
          'https://twitter.com/zedflip',
          'https://instagram.com/zedflip',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+260-XXX-XXXXXX',
          contactType: 'customer support',
          areaServed: 'ZM',
          availableLanguage: 'English',
        },
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// Product Schema for Listing Detail
interface ProductSchemaProps {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  condition: 'new' | 'used';
  city: string;
  sellerName: string;
  sellerRating?: number;
  reviewCount?: number;
  inStock?: boolean;
  category: string;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  id,
  title,
  description,
  images,
  price,
  condition,
  city,
  sellerName,
  sellerRating = 4.5,
  reviewCount = 0,
  inStock = true,
  category,
}) => {
  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 1);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    image: images,
    description: description,
    brand: {
      '@type': 'Brand',
      name: category,
    },
    offers: {
      '@type': 'Offer',
      url: `https://zedflip.com/listing/${id}`,
      price: price,
      priceCurrency: 'ZMW',
      priceValidUntil: validUntil.toISOString().split('T')[0],
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition:
        condition === 'new'
          ? 'https://schema.org/NewCondition'
          : 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'Person',
        name: sellerName,
      },
      areaServed: {
        '@type': 'City',
        name: city,
        addressCountry: 'ZM',
      },
    },
    aggregateRating:
      reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: sellerRating,
            reviewCount: reviewCount,
          }
        : undefined,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://zedflip.com${item.url}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// ItemList Schema for Category/Search Pages
interface ListingItem {
  id: string;
  title: string;
  url: string;
}

interface ItemListSchemaProps {
  items: ListingItem[];
}

export const ItemListSchema: React.FC<ItemListSchemaProps> = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://zedflip.com${item.url}`,
      name: item.title,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// LocalBusiness Schema for City Pages
interface LocalBusinessSchemaProps {
  city: string;
  citySlug: string;
}

export const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({
  city,
  citySlug,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `ZedFlip ${city}`,
    description: `Buy and sell second-hand items in ${city}, Zambia`,
    url: `https://zedflip.com/city/${citySlug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressCountry: 'ZM',
    },
    areaServed: {
      '@type': 'City',
      name: city,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default {
  WebsiteSchema,
  ProductSchema,
  BreadcrumbSchema,
  ItemListSchema,
  LocalBusinessSchema,
};
