import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, MapPin, Star, Calendar, Package, ShoppingBag, Loader2, Trash2 } from 'lucide-react';
import { useRequireAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../lib/api';
import { cn } from '../lib/utils';
import DeleteListingModal from '../components/DeleteListingModal';
import type { Listing } from '../types';

const Profile = () => {
  const { isLoading: authLoading } = useRequireAuth();
  const { user } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; listingId: string; title: string }>({ 
    show: false, 
    listingId: '', 
    title: '' 
  });

  useEffect(() => {
    if (user?.id) {
      fetchListings();
    }
  }, [user?.id, activeTab]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getUserListings(user!.id, { status: activeTab });
      setListings(response.data.data?.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (listing: Listing) => {
    setDeleteModal({ show: true, listingId: listing._id, title: listing.title });
  };

  const handleDeleteSuccess = () => {
    fetchListings();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-zed-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* User Info Card */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zed-orange to-zed-orange-dark flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-zed-text">{user?.name}</h1>
              {user?.isEmailVerified && (
                <span className="bg-zed-green text-white text-xs px-2 py-1 rounded-full">Verified</span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{user?.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Member since 2026</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>4.8</span>
              </div>
            </div>
          </div>
          <Link 
            to="/profile/edit" 
            className="flex items-center gap-2 px-6 py-3 border-2 border-zed-orange text-zed-orange rounded-xl font-semibold hover:bg-zed-orange hover:text-white transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('active')} 
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all',
            activeTab === 'active' 
              ? 'bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white shadow-lg' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          )}
        >
          <Package className="w-5 h-5" />
          Active Listings
        </button>
        <button 
          onClick={() => setActiveTab('sold')} 
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all',
            activeTab === 'sold' 
              ? 'bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white shadow-lg' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          )}
        >
          <ShoppingBag className="w-5 h-5" />
          Sold Items
        </button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-zed-orange animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-2">
              <Package className="w-16 h-16 mx-auto mb-4" />
            </div>
            <p className="text-gray-600 text-lg">
              {activeTab === 'active' ? 'No active listings' : 'No sold items'}
            </p>
            {activeTab === 'active' && (
              <Link 
                to="/create" 
                className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Create Your First Listing
              </Link>
            )}
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all relative group">
              <Link to={`/listing/${listing._id}`} className="block">
                <div className="relative">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title} 
                    className="w-full h-48 object-cover" 
                  />
                  {listing.condition && (
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                      {listing.condition}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
                    {listing.title}
                  </h3>
                  <p className="text-zed-orange font-bold text-xl mb-2">
                    ZMW {listing.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.city}</span>
                  </div>
                </div>
              </Link>
              
              {/* Delete Button - Only show for own listings */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteClick(listing);
                }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                title="Delete listing"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.show && (
        <DeleteListingModal
          listingId={deleteModal.listingId}
          listingTitle={deleteModal.title}
          onClose={() => setDeleteModal({ show: false, listingId: '', title: '' })}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Profile;
