import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  User,
  Star,
  Package,
  DollarSign,
  Tag as TagIcon,
} from 'lucide-react';
import { Listing } from '../../types';
import { formatPrice, formatDate, generateWhatsAppLink } from '../../lib/utils';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ListingDetailProps {
  listing: Listing;
  onContact: () => void;
  isContactLoading?: boolean;
  isAuthenticated?: boolean;
}

const ListingDetail = ({ listing, onContact, isContactLoading, isAuthenticated = false }: ListingDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out this listing: ${listing.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const whatsappLink = generateWhatsAppLink(
    listing.contactWhatsApp || listing.seller?.phone || '',
    `Hi! I'm interested in your listing: ${listing.title}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery - Yango Style */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {listing.images.length > 0 ? (
              <div className="relative aspect-[4/3] bg-gray-100">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows */}
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>

                {/* Favorite & Share Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleFavorite}
                    className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Thumbnail Strip */}
            {listing.images.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-zed-orange shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Listing Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-zed-text mb-2">{listing.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.city}</span>
                    {listing.location && <span className="text-gray-400">• {listing.location}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(listing.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{listing.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price - Big Display */}
            <div className="bg-gradient-to-r from-zed-orange/10 to-zed-orange-dark/10 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-zed-orange">
                      {formatPrice(listing.price)}
                    </span>
                    {listing.isNegotiable && (
                      <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                        Negotiable
                      </span>
                    )}
                  </div>
                </div>
                <DollarSign className="w-12 h-12 text-zed-orange/30" />
              </div>
            </div>

            {/* Condition & Category */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Condition</p>
                <p className="font-semibold text-zed-text capitalize">{listing.condition}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="font-semibold text-zed-text capitalize">
                  {listing.category?.name || 'Uncategorized'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-zed-text mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  <TagIcon className="w-4 h-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Seller Info & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Seller Info Card - Yango Style */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-bold text-zed-text mb-4">Seller Information</h3>
            
            <Link
              to={`/profile/${listing.seller?._id}`}
              className="flex items-center gap-3 mb-6 hover:bg-gray-50 p-3 rounded-xl transition-colors"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-zed-orange to-zed-orange-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                {listing.seller?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-zed-text">{listing.seller?.fullName || 'Unknown'}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.5 (12 reviews)</span>
                </div>
              </div>
            </Link>

            {/* Contact Buttons - Yango Style */}
            <div className="space-y-3">
              {!isAuthenticated ? (
                /* Guest View - Login Required */
                <div className="space-y-3">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-4xl mb-2">🔒</div>
                    <h4 className="font-semibold text-gray-900 mb-1">Login to Contact Seller</h4>
                    <p className="text-sm text-gray-600 mb-3">Sign in to view contact details and send messages</p>
                  </div>
                  <Link
                    to={`/login?redirect=/listing/${listing._id}`}
                    className="w-full bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    Login to Contact
                  </Link>
                  <Link
                    to="/login"
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Don't have an account? Sign Up
                  </Link>
                </div>
              ) : (
                /* Authenticated View - Show Contact Buttons */
                <>
                  {/* Message Button */}
                  <button
                    onClick={onContact}
                    disabled={isContactLoading}
                    className="w-full bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {isContactLoading ? 'Starting chat...' : 'Send Message'}
                  </button>

                  {/* WhatsApp Button */}
                  {(listing.contactWhatsApp || listing.seller?.phone) && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      WhatsApp Seller
                    </a>
                  )}

                  {/* Call Button */}
                  {listing.contactPhone && (
                    <a
                      href={`tel:${listing.contactPhone}`}
                      className="w-full bg-white border-2 border-zed-orange text-zed-orange py-3 px-4 rounded-xl font-semibold hover:bg-zed-orange hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Call Seller
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Safety Tips */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h4 className="font-semibold text-sm text-yellow-800 mb-2">Safety Tips</h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Meet in a public place</li>
                <li>• Check the item before payment</li>
                <li>• Pay only after collecting item</li>
                <li>• Report suspicious listings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
