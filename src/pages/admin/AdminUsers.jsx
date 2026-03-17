import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus } from '../../services/adminService';
import { 
  Search, Filter, Mail, Phone, Calendar,
  Shield, UserCheck, UserX, Loader2, ChevronDown, ChevronUp, Package, ShoppingBag
} from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers('customer');
      setUsers(data);
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      toast.success(`User set to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const filteredUsers = users.filter(u =>
    u.displayName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Database</h1>
          <p className="text-slate-500 font-medium mt-1">{users.length} registered customers</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="text-xs font-black text-slate-900">{users.filter(u => u.status !== 'blocked').length} Active</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input type="text" placeholder="Search by name or email..." className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-32 gap-6 text-slate-300">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-32 text-center">
            <h3 className="text-2xl font-black text-slate-900 mb-2">No users found</h3>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredUsers.map((user) => (
              <div key={user.id}>
                {/* User Row */}
                <div className="flex items-center gap-4 px-8 py-5 hover:bg-slate-50/40 transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-lg font-black overflow-hidden shrink-0">
                    {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : (user.displayName?.charAt(0) || 'U')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm">{user.displayName || 'Anonymous User'}</p>
                    <p className="text-xs text-slate-400 font-medium truncate">{user.email}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">
                      <Shield size={10} className="text-emerald-400" /> {user.role || 'customer'}
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${user.status === 'blocked' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {user.status || 'Active'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => handleStatusToggle(user.id, user.status)}
                      className={`p-2.5 rounded-xl transition-all ${user.status === 'blocked' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                      title={user.status === 'blocked' ? 'Unblock' : 'Block'}
                    >
                      {user.status === 'blocked' ? <UserCheck size={16} /> : <UserX size={16} />}
                    </button>
                    <button
                      onClick={() => toggleExpand(user.id)}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                      title="View Details"
                    >
                      {expandedId === user.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {expandedId === user.id && (
                  <div className="bg-slate-50 border-t border-slate-100 px-8 py-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-1"><Mail size={12} /> Email</div>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email || '—'}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-1"><Phone size={12} /> Phone</div>
                        <p className="text-sm font-bold text-slate-900">{user.phoneNumber || 'Not provided'}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-1"><Calendar size={12} /> Joined</div>
                        <p className="text-sm font-bold text-slate-900">{user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Unknown'}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-1"><Shield size={12} /> UID</div>
                        <p className="text-sm font-bold text-slate-900 font-mono text-xs">{user.id.slice(0, 16)}...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
