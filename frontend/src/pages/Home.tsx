import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Car, Shirt, Home as HomeIcon, Sofa, Dumbbell } from 'lucide-react';
import { useListingStore } from '../store/listingStore';
import ListingGrid from '../components/listing/ListingGrid';
import { ZAMBIA_CITIES } from '../types';
import SEO from '../components/SEO';

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  { name: 'Vehicles', slug: 'vehicles', icon: Car, color: 'bg-green-100 text-green-600' },
  { name: 'Fashion', slug: 'fashion', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { name: 'Property', slug: 'property', icon: HomeIcon, color: 'bg-purple-100 text-purple-600' },
  { name: 'Furniture', slug: 'furniture', icon: Sofa, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Sports', slug: 'sports', icon: Dumbbell, color: 'bg-red-100 text-red-600' },
];

const Home = () => {
  const { featuredListings, listings, isLoading, fetchFeatured, fetchListings } = useListingStore();

  useEffect(() => {
    fetchFeatured();
    fetchListings({}, 1);
  }, []);

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ZedFlip",
    "url": "https://zedflip.com",
    "description": "Zambia's leading online marketplace for buying and selling. Find electronics, vehicles, property, fashion and more across Lusaka, Kitwe, Ndola and all major cities.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://zedflip.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div>
      <SEO
        title="Home"
        description="Buy and sell anything in Zambia. ZedFlip is the leading online marketplace connecting buyers and sellers across Lusaka, Kitwe, Ndola, and all major Zambian cities. Electronics, vehicles, property, fashion and more."
        keywords="zambia marketplace, buy sell zambia, online shopping zambia, lusaka classifieds, kitwe marketplace, ndola buy sell, zambian online store"
        url="https://zedflip.com"
        schema={homeSchema}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Buy & Sell in Zambia
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Zambia's trusted marketplace for second-hand items. Find great deals or sell your stuff today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search" className="btn bg-white text-zed-orange hover:bg-gray-100 px-8 py-3">
                Browse Listings
              </Link>
              <Link to="/create" className="btn bg-zed-green text-white hover:bg-zed-green-dark px-8 py-3">
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zed-text mb-6">Browse Categories</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.slug}
                  to={`/search?category=${category.slug}`}
                  className="flex flex-col items-center p-4 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className={`w-14 h-14 rounded-full ${category.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-medium text-zed-text text-center">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-zed-text">Featured Listings</h2>
              <Link
                to="/search?featured=true"
                className="flex items-center gap-1 text-zed-orange hover:underline"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ListingGrid listings={featuredListings} />
          </div>
        </section>
      )}

      {/* Browse by City */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zed-text mb-6">Browse by City</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ZAMBIA_CITIES.map((city) => (
              <Link
                key={city}
                to={`/search?city=${city}`}
                className="px-4 py-3 bg-gray-50 rounded-lg text-center hover:bg-zed-orange hover:text-white transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zed-text">Recent Listings</h2>
            <Link
              to="/search"
              className="flex items-center gap-1 text-zed-orange hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ListingGrid listings={listings.slice(0, 10)} isLoading={isLoading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-zed-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to sell your items?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Join thousands of Zambians buying and selling on ZedFlip. It's free and easy to get started!
          </p>
          <Link
            to="/create"
            className="btn bg-white text-zed-green hover:bg-gray-100 px-8 py-3 text-lg"
          >
            Post Your First Ad
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
