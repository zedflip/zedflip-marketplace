import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Trash2, Eye, Menu } from 'lucide-react';
import { useRequireAdmin } from '../../hooks/useAuth';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../lib/api';
import { formatPrice, formatDate, cn } from '../../lib/utils';

const AdminListings = () => {
  const { isAdmin, isLoading } = useRequireAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    fetchListings();
  }, [search, status]);

  const fetchListings = async () => {
    try {
      const response = await api.get('/admin/listings', { params: { search, status } });
      setListings(response.data.data?.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      await api.put(`/admin/listings/${id}/featured`);
      fetchListings();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  if (isLoading || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-zed-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1">
        <header className="bg-white shadow-sm p-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold">Listings</h1>
        </header>
        <main className="p-6">
          <div className="bg-white rounded-xl p-4 mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zed-text-muted" />
              <input type="text" placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-zed-border rounded-lg" />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-zed-border rounded-lg px-4">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="bg-white rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zed-text-muted">Listing</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zed-text-muted">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zed-text-muted">Seller</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zed-text-muted">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zed-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zed-border">
                {listings.map((listing) => (
                  <tr key={listing._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={listing.images?.[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium truncate max-w-xs">{listing.title}</p>
                          <p className="text-sm text-zed-text-muted">{listing.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-zed-orange">{formatPrice(listing.price)}</td>
                    <td className="px-4 py-3 text-sm">{listing.seller?.name}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded text-xs', listing.status === 'active' ? 'bg-green-100 text-green-600' : listing.status === 'sold' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600')}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/listing/${listing._id}`} className="p-2 hover:bg-gray-100 rounded"><Eye className="w-5 h-5" /></Link>
                        <button onClick={() => toggleFeatured(listing._id)} className={cn('p-2 rounded', listing.isFeatured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500')}><Star className="w-5 h-5" fill={listing.isFeatured ? 'currentColor' : 'none'} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminListings;
