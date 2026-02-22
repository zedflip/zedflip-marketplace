import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, MapPin, Star, Calendar, Package, ShoppingBag, Loader2 } from 'lucide-react';
import { useRequireAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../lib/api';
import { formatDate, cn } from '../lib/utils';
import ListingGrid from '../components/listing/ListingGrid';
import type { Listing } from '../types';

const Profile = () => {
  const { isLoading: authLoading } = useRequireAuth();
  const { user } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');
  const [isLoading, setIsLoading] = useState(true);

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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-zed-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-zed-orange flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{user?.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-zed-text">{user?.name}</h1>
              {user?.isVerified && <span className="bg-zed-green text-white text-xs px-2 py-1 rounded">Verified</span>}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-zed-text-muted">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{user?.city}</span></div>
              <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>Member</span></div>
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /><span>4.8</span></div>
            </div>
          </div>
          <Link to="/profile/edit" className="btn btn-outline"><Edit2 className="w-4 h-4" />Edit Profile</Link>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('active')} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg font-medium', activeTab === 'active' ? 'bg-zed-orange text-white' : 'bg-white text-zed-text')}>
          <Package className="w-5 h-5" />Active
        </button>
        <button onClick={() => setActiveTab('sold')} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg font-medium', activeTab === 'sold' ? 'bg-zed-orange text-white' : 'bg-white text-zed-text')}>
          <ShoppingBag className="w-5 h-5" />Sold
        </button>
      </div>
      <ListingGrid listings={listings} isLoading={isLoading} emptyMessage={activeTab === 'active' ? 'No active listings' : 'No sold items'} />
    </div>
  );
};

export default Profile;
