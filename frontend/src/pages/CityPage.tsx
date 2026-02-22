import { useParams } from 'react-router-dom';
import { SEO } from '../components/seo/SEO';
import { LocalBusinessSchema, BreadcrumbSchema } from '../components/seo/SchemaOrg';
import { generateCityKeywords, ZAMBIA_CITIES } from '../lib/seo-utils';
import ListingGrid from '../components/listing/ListingGrid';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const cityData: Record<string, { name: string; description: string }> = {
  lusaka: {
    name: 'Lusaka',
    description:
      "Find the best deals in Lusaka, Zambia's capital city. Browse thousands of second-hand items from electronics to furniture.",
  },
  kitwe: {
    name: 'Kitwe',
    description:
      'Discover great deals in Kitwe, the heart of the Copperbelt. Buy and sell electronics, vehicles, and more.',
  },
  ndola: {
    name: 'Ndola',
    description:
      'Shop second-hand items in Ndola. Find furniture, phones, cars, and household items at great prices.',
  },
  kabwe: {
    name: 'Kabwe',
    description:
      'Buy and sell in Kabwe. Browse local listings for electronics, furniture, and more.',
  },
  livingstone: {
    name: 'Livingstone',
    description:
      'Find deals near Victoria Falls in Livingstone. Shop second-hand items from local sellers.',
  },
  chipata: {
    name: 'Chipata',
    description:
      'Discover marketplace deals in Chipata, Eastern Province. Buy and sell locally.',
  },
  mansa: {
    name: 'Mansa',
    description:
      'Shop second-hand items in Mansa, Luapula Province. Find great local deals.',
  },
  mongu: {
    name: 'Mongu',
    description:
      'Buy and sell in Mongu, Western Province. Browse local listings and find great deals.',
  },
  solwezi: {
    name: 'Solwezi',
    description:
      'Discover deals in Solwezi, North-Western Province. Shop electronics, vehicles, and more.',
  },
  kasama: {
    name: 'Kasama',
    description:
      'Find second-hand items in Kasama, Northern Province. Buy and sell locally.',
  },
  mufulira: {
    name: 'Mufulira',
    description:
      'Shop the marketplace in Mufulira. Find electronics, furniture, and household items.',
  },
  luanshya: {
    name: 'Luanshya',
    description:
      'Buy and sell in Luanshya. Browse local listings for great deals on second-hand items.',
  },
};

export default function CityPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const city = cityData[citySlug || ''] || { name: 'Zambia', description: '' };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Cities', url: '/cities' },
    { name: city.name, url: `/city/${citySlug}` },
  ];

  return (
    <>
      <SEO
        title={`Buy & Sell in ${city.name}`}
        description={city.description}
        keywords={generateCityKeywords(city.name)}
        url={`/city/${citySlug}`}
        city={city.name}
      />
      <LocalBusinessSchema city={city.name} citySlug={citySlug || ''} />
      <BreadcrumbSchema items={breadcrumbs} />

      <Navbar />

      <main className="min-h-screen bg-zed-bg">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Buy & Sell in {city.name}
            </h1>
            <p className="text-lg opacity-90 max-w-2xl">{city.description}</p>
          </div>
        </section>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-4">
          <ol className="flex items-center space-x-2 text-sm text-zed-text-muted">
            {breadcrumbs.map((item, index) => (
              <li key={item.url} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-zed-text font-medium">{item.name}</span>
                ) : (
                  <a
                    href={item.url}
                    className="hover:text-zed-orange transition-colors"
                  >
                    {item.name}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Listings Grid */}
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6">
            Latest Listings in {city.name}
          </h2>
          <ListingGrid city={city.name} />
        </section>

        {/* SEO Content Section */}
        <section className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">
            About ZedFlip {city.name}
          </h2>
          <div className="prose max-w-none text-zed-text-muted">
            <p>
              ZedFlip is the leading marketplace for buying and selling
              second-hand items in {city.name}, Zambia. Whether you're looking
              for electronics, furniture, vehicles, or household items, ZedFlip
              connects you with local sellers in {city.name}.
            </p>
            <p>
              Our platform makes it easy to find great deals on used items.
              Simply browse listings, contact sellers directly via WhatsApp or
              phone, and arrange a safe meetup in {city.name}. All transactions
              are done in Zambian Kwacha (ZMW), and we support mobile money
              payments including MTN Mobile Money and Airtel Money.
            </p>
            <h3>Popular Categories in {city.name}</h3>
            <ul>
              <li>Electronics & Phones</li>
              <li>Vehicles & Auto Parts</li>
              <li>Furniture & Home</li>
              <li>Fashion & Clothing</li>
              <li>Jobs & Services</li>
            </ul>
            <p>
              Start selling your items today on ZedFlip {city.name}. It's free
              to list, and you can reach thousands of potential buyers in your
              area.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
