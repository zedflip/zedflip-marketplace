import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, Car, Shirt, Home as HomeIcon, Sofa, Dumbbell, Search, MapPin } from 'lucide-react';
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchFeatured();
    fetchListings({}, 1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedCity) params.append('city', selectedCity);
    navigate(`/search?${params.toString()}`);
  };

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
    <div className="min-h-screen">
      <SEO
        title="Home"
        description="Buy and sell anything in Zambia. ZedFlip is the leading online marketplace connecting buyers and sellers across Lusaka, Kitwe, Ndola, and all major Zambian cities. Electronics, vehicles, property, fashion and more."
        keywords="zambia marketplace, buy sell zambia, online shopping zambia, lusaka classifieds, kitwe marketplace, ndola buy sell, zambian online store"
        url="https://zedflip.com"
        schema={homeSchema}
      />
      
      {/* Hero Section with Search - Yango Style */}
      <section className="bg-gradient-to-br from-zed-orange via-zed-orange-dark to-red-600 text-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Buy & Sell in Zambia
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Zambia's trusted marketplace for second-hand items. Find great deals or sell your stuff today!
            </p>
          </div>

          {/* Search Bar - Yango Style */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-2 bg-gray-50 rounded-xl">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="flex items-center px-4 py-2 bg-gray-50 rounded-xl md:w-48">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 cursor-pointer"
                >
                  <option value="">All Cities</option>
                  {ZAMBIA_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link 
              to="/search" 
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-white/20"
            >
              Browse All Listings
            </Link>
            <Link 
              to="/create" 
              className="inline-flex items-center justify-center bg-white text-zed-orange hover:bg-gray-100 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Categories - Yango Style with Horizontal Scroll */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-zed-text mb-6">Browse Categories</h2>
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex md:grid md:grid-cols-6 gap-4 min-w-max md:min-w-0">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.slug}
                    to={`/search?category=${category.slug}`}
                    className="flex flex-col items-center p-6 rounded-2xl hover:shadow-lg transition-all duration-200 bg-white border border-gray-100 min-w-[120px] md:min-w-0"
                  >
                    <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-3 transition-transform hover:scale-110`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-semibold text-zed-text text-center">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings - Yango Style Cards */}
      {featuredListings.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-zed-text">Featured Listings</h2>
              <Link
                to="/search?featured=true"
                className="flex items-center gap-1 text-zed-orange hover:text-zed-orange-dark font-medium transition-colors"
              >
                View All <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <ListingGrid listings={featuredListings} />
          </div>
        </section>
      )}

      {/* Browse by City - Yango Style Pills */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-zed-text mb-6">Browse by City</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ZAMBIA_CITIES.map((city) => (
              <Link
                key={city}
                to={`/search?city=${city}`}
                className="px-5 py-3 bg-gray-50 rounded-xl text-center hover:bg-gradient-to-r hover:from-zed-orange hover:to-zed-orange-dark hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-zed-text">Recent Listings</h2>
            <Link
              to="/search"
              className="flex items-center gap-1 text-zed-orange hover:text-zed-orange-dark font-medium transition-colors"
            >
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <ListingGrid listings={listings.slice(0, 12)} isLoading={isLoading} />
        </div>
      </section>

      {/* CTA Section - Yango Style */}
      <section className="py-20 bg-gradient-to-br from-zed-green via-zed-green-dark to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to sell your items?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Join thousands of Zambians buying and selling on ZedFlip. It's free and easy to get started!
          </p>
          <Link
            to="/create"
            className="inline-flex items-center justify-center bg-white text-zed-green hover:bg-gray-100 px-10 py-4 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-xl transition-all duration-200"
          >
            Post Your First Ad
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
