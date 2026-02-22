import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, Flag, TrendingUp, Menu } from 'lucide-react';
import { useRequireAdmin } from '../../hooks/useAuth';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../lib/api';

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useRequireAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (isLoading || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-zed-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-0">
        <header className="bg-white shadow-sm p-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
                <div><p className="text-2xl font-bold">{stats?.overview?.totalUsers || 0}</p><p className="text-sm text-zed-text-muted">Total Users</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Package className="w-6 h-6 text-green-600" /></div>
                <div><p className="text-2xl font-bold">{stats?.overview?.activeListings || 0}</p><p className="text-sm text-zed-text-muted">Active Listings</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-6 h-6 text-orange-600" /></div>
                <div><p className="text-2xl font-bold">{stats?.recent?.soldListings || 0}</p><p className="text-sm text-zed-text-muted">Sold (30 days)</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><Flag className="w-6 h-6 text-red-600" /></div>
                <div><p className="text-2xl font-bold">{stats?.overview?.pendingReports || 0}</p><p className="text-sm text-zed-text-muted">Pending Reports</p></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h2 className="font-semibold mb-4">Listings by City</h2>
              <div className="space-y-3">
                {stats?.listingsByCity?.slice(0, 5).map((item: any) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span>{item._id}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h2 className="font-semibold mb-4">Listings by Category</h2>
              <div className="space-y-3">
                {stats?.listingsByCategory?.slice(0, 5).map((item: any) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
