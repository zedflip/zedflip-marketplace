import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MapPin,
  Clock,
  Eye,
  Phone,
  MessageCircle,
  Star,
  Shield,
  Flag,
} from 'lucide-react';
import type { Listing } from '../../types';
import { formatPrice, formatDate, formatRelativeTime, getConditionColor, generateWhatsAppLink, cn } from '../../lib/utils';

interface ListingDetailProps {
  listing: Listing;
  onContact: () => void;
}

const ListingDetail = ({ listing, onContact }: ListingDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Images */}
      <div className="lg:col-span-2">
        {/* Main Image */}
        <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
          <img
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            className="w-full h-full object-contain"
          />

          {listing.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {listing.images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {listing.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {listing.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                  currentImageIndex === index
                    ? 'border-zed-orange'
                    : 'border-transparent'
                )}
              >
                <img
                  src={image}
                  alt={`${listing.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-xl p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          <p className="text-zed-text whitespace-pre-line">{listing.description}</p>

          {listing.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-zed-text-muted px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Details & Seller */}
      <div className="space-y-6">
        {/* Price & Actions */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-bold text-zed-orange">
                {formatPrice(listing.price)}
              </span>
              {listing.isNegotiable && (
                <span className="block text-sm text-zed-text-muted">Negotiable</span>
              )}
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-zed-border rounded-lg hover:bg-gray-50">
                <Heart className="w-5 h-5 text-zed-text-muted" />
              </button>
              <button className="p-2 border border-zed-border rounded-lg hover:bg-gray-50">
                <Share2 className="w-5 h-5 text-zed-text-muted" />
              </button>
            </div>
          </div>

          <h1 className="text-xl font-semibold text-zed-text mb-4">
            {listing.title}
          </h1>

          {/* Meta Info */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-zed-text-muted">
              <MapPin className="w-4 h-4" />
              <span>{listing.city}{listing.location && `, ${listing.location}`}</span>
            </div>
            <div className="flex items-center gap-2 text-zed-text-muted">
              <Clock className="w-4 h-4" />
              <span>Posted {formatRelativeTime(listing.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-zed-text-muted">
              <Eye className="w-4 h-4" />
              <span>{listing.views} views</span>
            </div>
          </div>

          {/* Condition */}
          <div className="mb-6">
            <span className="text-sm text-zed-text-muted">Condition</span>
            <span className={cn(
              'block mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium',
              getConditionColor(listing.condition)
            )}>
              {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1).replace('-', ' ')}
            </span>
          </div>

          {/* Contact Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowPhone(!showPhone)}
              className="btn btn-outline w-full"
            >
              <Phone className="w-5 h-5" />
              {showPhone ? listing.contactPhone : 'Show Phone Number'}
            </button>

            {listing.contactWhatsApp && (
              <a
                href={generateWhatsAppLink(
                  listing.contactWhatsApp,
                  `Hi, I'm interested in your listing: ${listing.title}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary w-full"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            )}

            <button onClick={onContact} className="btn btn-primary w-full">
              <MessageCircle className="w-5 h-5" />
              Send Message
            </button>
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-semibold mb-4">Seller Information</h3>
          
          <Link
            to={`/user/${listing.seller.id}`}
            className="flex items-center gap-3 mb-4"
          >
            {listing.seller.avatar ? (
              <img
                src={listing.seller.avatar}
                alt={listing.seller.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zed-orange flex items-center justify-center">
                <span className="text-white font-medium">
                  {listing.seller.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-zed-text">
                  {listing.seller.name}
                </span>
                {listing.seller.isVerified && (
                  <Shield className="w-4 h-4 text-zed-green" />
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-zed-text-muted">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{listing.seller.rating.toFixed(1)}</span>
                <span>({listing.seller.totalReviews} reviews)</span>
              </div>
            </div>
          </Link>

          <div className="text-sm text-zed-text-muted">
            <p>Member since {formatDate(listing.seller.createdAt)}</p>
            <p>{listing.seller.totalListings} listings</p>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Safety Tips</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Meet in a public place</li>
            <li>• Check the item before paying</li>
            <li>• Pay only after collecting the item</li>
            <li>• Never send money in advance</li>
          </ul>
        </div>

        {/* Report */}
        <button className="flex items-center gap-2 text-zed-text-muted hover:text-zed-red transition-colors">
          <Flag className="w-4 h-4" />
          <span className="text-sm">Report this listing</span>
        </button>
      </div>
    </div>
  );
};

export default ListingDetail;
