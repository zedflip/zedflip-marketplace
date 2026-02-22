import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock } from 'lucide-react';
import type { Listing } from '../../types';
import { formatPrice, formatRelativeTime, getConditionColor, cn } from '../../lib/utils';

interface ListingCardProps {
  listing: Listing;
  className?: string;
}

const ListingCard = ({ listing, className }: ListingCardProps) => {
  return (
    <Link
      to={`/listing/${listing._id}`}
      className={cn(
        'group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Featured Badge */}
        {listing.isFeatured && (
          <div className="absolute top-2 left-2 bg-zed-orange text-white text-xs font-medium px-2 py-1 rounded">
            Featured
          </div>
        )}

        {/* Status Badge */}
        {listing.status === 'sold' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white text-lg font-bold px-4 py-2 rounded-lg transform -rotate-12">
              SOLD
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add to favorites
          }}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <Heart className="w-5 h-5 text-zed-text-muted hover:text-zed-red" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-zed-orange">
            {formatPrice(listing.price)}
          </span>
          {listing.isNegotiable && (
            <span className="text-xs text-zed-text-muted">Negotiable</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-medium text-zed-text line-clamp-2 mb-2 group-hover:text-zed-orange transition-colors">
          {listing.title}
        </h3>

        {/* Condition */}
        <span className={cn(
          'inline-block text-xs px-2 py-1 rounded-full mb-3',
          getConditionColor(listing.condition)
        )}>
          {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1).replace('-', ' ')}
        </span>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-zed-text-muted">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{listing.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatRelativeTime(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
