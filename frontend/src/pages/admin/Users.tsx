import { useState, useEffect } from 'react';
import { Search, Ban, CheckCircle, Menu } from 'lucide-react';
import { useRequireAdmin } from '../../hooks/useAuth';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../lib/api';
import { formatDate, cn } from '../../lib/utils';

const AdminUsers = () => {
  const { isAdmin, isLoading } = useRequireAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users', { params: { page, search } });
      setUsers(response.data.data?.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const toggleBan = async (userId: string) => {
    try {
      await api.put(`/admin/users/${userId}/ban`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle ban:', error);
    }
  };

  if (isLoading || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-zed-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1">
        <header className="bg-white shadow-sm p-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold">Users</h1>
        </header>
        <main className="p-6">
          <div className="bg-white rounded-xl p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zed-text-muted" />
              <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-zed-border rounded-lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zed-text-muted">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zed-text-muted">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zed-text-muted">City</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zed-text-muted">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zed-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zed-border">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zed-orange flex items-center justify-center text-white text-sm">{user.name?.charAt(0)}</div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">{user.city}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded text-xs', user.isBanned ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')}>
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleBan(user._id)} className={cn('p-2 rounded', user.isBanned ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50')}>
                        {user.isBanned ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                      </button>
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

export default AdminUsers;
