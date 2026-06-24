import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers, FiDollarSign, FiShoppingBag, FiAlertOctagon,
  FiUserCheck, FiUserMinus, FiPackage, FiFileText,
  FiGrid, FiSearch, FiRefreshCw,
  FiChevronDown, FiEye, FiPrinter, FiCheck,
  FiClock, FiTruck, FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import Invoice from '../components/Invoice';

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Placed:     { color: 'bg-blue-50 text-blue-700 border-blue-200',      icon: FiClock,       next: 'Processing' },
  Processing: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: FiPackage,     next: 'Shipped' },
  Shipped:    { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: FiTruck,       next: 'Delivered' },
  Delivered:  { color: 'bg-green-50 text-green-700 border-green-200',    icon: FiCheck,       next: null },
  Cancelled:  { color: 'bg-red-50 text-red-700 border-red-200',          icon: FiAlertCircle, next: null }
};

const ALL_STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// ─── SIDEBAR NAV ─────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard',   icon: FiGrid },
  { key: 'orders',    label: 'Orders',      icon: FiShoppingBag },
  { key: 'customers', label: 'Customers',   icon: FiUsers },
  { key: 'invoices',  label: 'Invoices',    icon: FiFileText }
];

// ─── MINI SPARKLINE ──────────────────────────────────────────────────────────

function Sparkline({ data, color = '#b8860b' }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 120, h = 40;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, trend, sparkData, color = 'text-gold', bg = 'bg-gold/10' }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white p-6 border border-gold/10 rounded-lg shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 ${bg} ${color} rounded-full flex items-center justify-center`}>
          <Icon size={22} />
        </div>
        {sparkData && <Sparkline data={sparkData} />}
      </div>
      <div className="font-sans text-xs text-luxury-gray uppercase tracking-wider mb-1">{label}</div>
      <div className="font-display text-2xl font-bold text-luxury-black">{value}</div>
      {sub && <div className="font-sans text-xs text-luxury-gray mt-1">{sub}</div>}
      {trend !== undefined && (
        <div className={`font-sans text-xs font-semibold mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          <FiTrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
          {trend >= 0 ? '+' : ''}{trend}% vs last week
        </div>
      )}
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [customerSearch, setCustomerSearch] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ─── Fetch Data ──────────────────────────────────────────────────────────

  const fetchAdminData = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    setErrorMessage('');
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const [usersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/orders', { headers })
      ]);
      const [usersData, ordersData] = await Promise.all([usersRes.json(), ordersRes.json()]);
      if (!usersRes.ok) throw new Error(usersData.message || 'Failed to fetch users.');
      if (!ordersRes.ok) throw new Error(ordersData.message || 'Failed to fetch orders.');
      setUsersList(usersData.users || []);
      setOrdersList(ordersData.orders || []);
    } catch (err) {
      setErrorMessage(err.message || 'Error loading dashboard.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchAdminData(); }, [fetchAdminData]);

  // ─── Toggle User ─────────────────────────────────────────────────────────

  const handleToggleUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: data.status } : u));
      } else {
        alert(data.message || 'Failed to toggle user status.');
      }
    } catch { alert('Error communicating with server.'); }
  };

  // ─── Update Order Status ──────────────────────────────────────────────────

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert(data.message || 'Failed to update status.');
      }
    } catch { alert('Error updating order status.'); }
    finally { setUpdatingStatus(null); }
  };

  // ─── Derived Stats ────────────────────────────────────────────────────────

  const totalRevenue = ordersList.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = ordersList.length;
  const totalCustomers = usersList.filter(u => u.role !== 'admin').length;
  const pendingOrders = ordersList.filter(o => ['Placed', 'Processing'].includes(o.status)).length;

  // Last 7 days revenue
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    return ordersList.filter(o => o.createdAt?.startsWith(key)).reduce((s, o) => s + (o.total || 0), 0);
  });

  // Revenue by payment method
  const razorpayRevenue = ordersList.filter(o => o.paymentMethod === 'Razorpay').reduce((s, o) => s + o.total, 0);
  const codRevenue = ordersList.filter(o => o.paymentMethod === 'COD').reduce((s, o) => s + o.total, 0);

  // ─── Filtered lists ───────────────────────────────────────────────────────

  const filteredOrders = ordersList.filter(o => {
    const matchSearch = !orderSearch || [o.id, o.userName, o.userEmail, o.invoiceNumber]
      .some(v => v?.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredCustomers = usersList.filter(u =>
    !customerSearch || [u.name, u.email, u.phone, u.id]
      .some(v => v?.toLowerCase().includes(customerSearch.toLowerCase()))
  );

  // ─── Access Guard ─────────────────────────────────────────────────────────

  if (!user || user.role !== 'admin') {
    return (
      <div className="py-32 bg-cream min-h-screen text-center">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FiAlertOctagon size={64} className="mx-auto text-red-500/40 mb-6" />
            <h1 className="font-display text-3xl mb-4 text-red-600">Access Denied</h1>
            <p className="font-sans text-base text-luxury-gray max-w-md mx-auto mb-8">
              This page requires Administrator privileges.
            </p>
            <Link to="/login" className="btn-gold">Go to Login</Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} transition-all duration-300 bg-gray-900 flex-shrink-0 flex flex-col`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <span className="text-gold font-display text-xl tracking-widest">VJS</span>
          {sidebarOpen && <span className="text-white/50 text-xs font-sans tracking-wider uppercase">Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                activeTab === key
                  ? 'bg-gold/20 text-gold border-r-2 border-gold'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}>
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="font-sans text-sm font-medium">{label}</span>}
            </button>
          ))}
        </nav>

        {/* Admin info */}
        {sidebarOpen && (
          <div className="px-4 py-4 border-t border-white/10">
            <div className="text-xs text-white/40 font-sans">Logged in as</div>
            <div className="text-xs text-white/70 font-semibold truncate">{user.name}</div>
          </div>
        )}

        {/* Toggle btn */}
        <button onClick={() => setSidebarOpen(o => !o)}
          className="p-4 text-white/30 hover:text-white transition-colors border-t border-white/10 text-xs font-sans">
          {sidebarOpen ? '← Collapse' : '→'}
        </button>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-auto">

        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-display text-xl text-luxury-black">
              {NAV_ITEMS.find(n => n.key === activeTab)?.label}
            </h1>
            <p className="font-sans text-xs text-luxury-gray">VJS Jewellery Admin Panel</p>
          </div>
          <button onClick={fetchAdminData}
            className="flex items-center gap-2 text-luxury-gray hover:text-gold transition-colors font-sans text-sm">
            <FiRefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-sans mb-6 border border-red-200 flex items-center gap-2">
              <FiAlertCircle size={16} /> {errorMessage}
            </div>
          )}

          <AnimatePresence mode="wait">

            {/* ════════════════════ DASHBOARD ════════════════════ */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                  <StatCard icon={FiDollarSign} label="Total Revenue" value={formatPrice(totalRevenue)}
                    sub={`${totalOrders} orders`} sparkData={last7Days} />
                  <StatCard icon={FiShoppingBag} label="Total Orders" value={totalOrders}
                    sub={`${pendingOrders} pending`} color="text-blue-600" bg="bg-blue-50"
                    sparkData={last7Days.map(v => v > 0 ? 1 : 0)} />
                  <StatCard icon={FiUsers} label="Customers" value={totalCustomers}
                    sub="Registered accounts" color="text-purple-600" bg="bg-purple-50" />
                  <StatCard icon={FiPackage} label="Pending Orders" value={pendingOrders}
                    sub="Needs attention" color="text-orange-600" bg="bg-orange-50" />
                </div>

                {/* Revenue Breakdown + Recent Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Payment breakdown */}
                  <div className="bg-white rounded-lg border border-gray-100 shadow-card p-6">
                    <h2 className="font-display text-base mb-5 text-luxury-black">Revenue by Payment</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm font-sans mb-1.5">
                          <span className="text-luxury-gray">Online (Razorpay)</span>
                          <span className="font-semibold text-luxury-black">{formatPrice(razorpayRevenue)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-gold rounded-full transition-all"
                            style={{ width: `${totalRevenue > 0 ? (razorpayRevenue / totalRevenue) * 100 : 0}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-sans mb-1.5">
                          <span className="text-luxury-gray">Cash on Delivery</span>
                          <span className="font-semibold text-luxury-black">{formatPrice(codRevenue)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-amber-400 rounded-full transition-all"
                            style={{ width: `${totalRevenue > 0 ? (codRevenue / totalRevenue) * 100 : 0}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h3 className="font-display text-sm mb-3 text-luxury-black">Orders by Status</h3>
                      <div className="space-y-2">
                        {ALL_STATUSES.map(status => {
                          const count = ordersList.filter(o => o.status === status).length;
                          const { color } = STATUS_CONFIG[status];
                          return (
                            <div key={status} className="flex items-center justify-between text-xs font-sans">
                              <span className={`px-2 py-0.5 rounded-full border font-semibold ${color}`}>{status}</span>
                              <span className="font-bold text-luxury-black">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="lg:col-span-2 bg-white rounded-lg border border-gray-100 shadow-card p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-display text-base text-luxury-black">Recent Orders</h2>
                      <button onClick={() => setActiveTab('orders')}
                        className="font-sans text-xs text-gold hover:underline">View All →</button>
                    </div>
                    <div className="space-y-3">
                      {ordersList.slice(0, 6).map(order => {
                        const { color, icon: StatusIcon } = STATUS_CONFIG[order.status] || STATUS_CONFIG.Placed;
                        return (
                          <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                            <div>
                              <div className="font-sans text-sm font-medium text-luxury-black">{order.userName}</div>
                              <div className="font-sans text-xs text-luxury-gray">{order.id}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
                                <StatusIcon size={10} />{order.status}
                              </span>
                              <span className="font-sans font-bold text-sm text-gold">{formatPrice(order.total)}</span>
                              <button onClick={() => setInvoiceOrder(order)}
                                className="text-luxury-gray hover:text-gold transition-colors">
                                <FiEye size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {ordersList.length === 0 && (
                        <div className="text-center py-10 text-luxury-gray font-sans text-sm">No orders yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════════════════════ ORDERS ════════════════════ */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="relative flex-1 min-w-[200px]">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gray" size={15} />
                    <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                      placeholder="Search by Order ID, Customer, Invoice..."
                      className="input-field pl-9 text-sm h-10" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['All', ...ALL_STATUSES].map(s => (
                      <button key={s} onClick={() => setOrderStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          orderStatusFilter === s
                            ? 'bg-gold text-white border-gold'
                            : 'bg-white text-luxury-gray border-gray-200 hover:border-gold/50'
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold border-t-transparent" />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-100 shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-luxury-gray text-xs uppercase tracking-wider border-b border-gray-100">
                            <th className="py-3 px-4 font-semibold">Order / Invoice</th>
                            <th className="py-3 px-4 font-semibold">Customer</th>
                            <th className="py-3 px-4 font-semibold">Items</th>
                            <th className="py-3 px-4 font-semibold">Date</th>
                            <th className="py-3 px-4 font-semibold">Payment</th>
                            <th className="py-3 px-4 font-semibold">Total</th>
                            <th className="py-3 px-4 font-semibold text-center">Status</th>
                            <th className="py-3 px-4 font-semibold text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredOrders.length === 0 ? (
                            <tr><td colSpan={8} className="text-center py-12 text-luxury-gray">No orders found.</td></tr>
                          ) : filteredOrders.map(order => {
                            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Placed;
                            const StatusIcon = cfg.icon;
                            return (
                              <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                                <td className="py-4 px-4">
                                  <div className="font-medium text-luxury-black text-xs">{order.id}</div>
                                  {order.invoiceNumber && (
                                    <div className="text-[10px] text-luxury-gray mt-0.5">{order.invoiceNumber}</div>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <div className="font-medium text-luxury-black">{order.userName}</div>
                                  <div className="text-xs text-luxury-gray">{order.userEmail}</div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="text-luxury-gray text-xs">
                                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                                  </div>
                                  <div className="text-[10px] text-luxury-gray/70 truncate max-w-[120px]">
                                    {order.items?.map(i => i.name).join(', ')}
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-xs text-luxury-gray whitespace-nowrap">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    order.paymentMethod === 'Razorpay'
                                      ? 'bg-green-50 text-green-700 border border-green-200'
                                      : 'bg-orange-50 text-orange-700 border border-orange-200'
                                  }`}>
                                    {order.paymentMethod === 'Razorpay' ? '✓' : '💵'} {order.paymentMethod}
                                  </span>
                                </td>
                                <td className="py-4 px-4 font-bold text-gold">{formatPrice(order.total)}</td>
                                <td className="py-4 px-4 text-center">
                                  <div className="relative inline-block">
                                    <select
                                      value={order.status}
                                      disabled={updatingStatus === order.id || ['Delivered', 'Cancelled'].includes(order.status)}
                                      onChange={e => handleStatusUpdate(order.id, e.target.value)}
                                      className={`appearance-none pl-2 pr-6 py-1 rounded-full text-[10px] font-bold border cursor-pointer disabled:cursor-not-allowed ${cfg.color}`}>
                                      {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <FiChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <button onClick={() => setInvoiceOrder(order)}
                                    className="inline-flex items-center gap-1 text-xs text-gold border border-gold/30 hover:bg-gold/10 px-3 py-1.5 rounded transition-colors font-semibold">
                                    <FiFileText size={12} /> Invoice
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ════════════════════ CUSTOMERS ════════════════════ */}
            {activeTab === 'customers' && (
              <motion.div key="customers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="relative mb-6 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gray" size={15} />
                  <input value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
                    placeholder="Search by name, email, phone..."
                    className="input-field pl-9 text-sm h-10" />
                </div>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold border-t-transparent" />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-100 shadow-card overflow-hidden">
                    <table className="w-full text-left font-sans text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-luxury-gray text-xs uppercase tracking-wider border-b border-gray-100">
                          <th className="py-3 px-5 font-semibold">Customer</th>
                          <th className="py-3 px-5 font-semibold">Phone</th>
                          <th className="py-3 px-5 font-semibold">Role</th>
                          <th className="py-3 px-5 font-semibold">Joined</th>
                          <th className="py-3 px-5 font-semibold">Orders</th>
                          <th className="py-3 px-5 font-semibold">Spent</th>
                          <th className="py-3 px-5 font-semibold text-center">Status</th>
                          <th className="py-3 px-5 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredCustomers.length === 0 ? (
                          <tr><td colSpan={8} className="text-center py-12 text-luxury-gray">No customers found.</td></tr>
                        ) : filteredCustomers.map(u => {
                          const userOrders = ordersList.filter(o => o.userId === u.id);
                          const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);
                          return (
                            <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gold/10 text-gold flex items-center justify-center font-display font-bold text-sm flex-shrink-0">
                                    {u.name?.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-medium text-luxury-black">{u.name}</div>
                                    <div className="text-xs text-luxury-gray">{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-xs text-luxury-gray">{u.phone}</td>
                              <td className="py-4 px-5">
                                <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                                  u.role === 'admin' ? 'bg-gold/15 text-gold' : 'bg-gray-100 text-luxury-gray'
                                }`}>{u.role}</span>
                              </td>
                              <td className="py-4 px-5 text-xs text-luxury-gray">
                                {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="py-4 px-5 font-semibold text-luxury-black">{userOrders.length}</td>
                              <td className="py-4 px-5 font-bold text-gold">{formatPrice(totalSpent)}</td>
                              <td className="py-4 px-5 text-center">
                                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                  u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>{u.status}</span>
                              </td>
                              <td className="py-4 px-5 text-right">
                                {u.role !== 'admin' ? (
                                  <button onClick={() => handleToggleUser(u.id)}
                                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded border transition-colors ${
                                      u.status === 'active'
                                        ? 'text-red-600 border-red-200 hover:bg-red-50'
                                        : 'text-green-600 border-green-200 hover:bg-green-50'
                                    }`}>
                                    {u.status === 'active' ? <><FiUserMinus size={12} /> Disable</> : <><FiUserCheck size={12} /> Enable</>}
                                  </button>
                                ) : (
                                  <span className="text-xs text-luxury-gray italic">Protected</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* ════════════════════ INVOICES ════════════════════ */}
            {activeTab === 'invoices' && (
              <motion.div key="invoices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="font-sans text-sm text-luxury-gray mb-6">
                  All orders with generated invoices. Click "Print Invoice" to view and download as PDF.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {ordersList.filter(o => o.invoiceNumber).length === 0 ? (
                    <div className="col-span-full text-center py-16 text-luxury-gray font-sans">
                      No invoices generated yet. Invoices are created automatically when orders are placed.
                    </div>
                  ) : (
                    ordersList.filter(o => o.invoiceNumber).map(order => {
                      const { color, icon: StatusIcon } = STATUS_CONFIG[order.status] || STATUS_CONFIG.Placed;
                      return (
                        <motion.div key={order.id} whileHover={{ y: -2 }}
                          className="bg-white rounded-lg border border-gray-100 shadow-card p-5 hover:border-gold/20 transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                              <FiFileText size={18} />
                            </div>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${color}`}>
                              <StatusIcon size={9} /> {order.status}
                            </span>
                          </div>
                          <div className="mb-3">
                            <div className="font-sans font-bold text-luxury-black text-sm">{order.invoiceNumber}</div>
                            <div className="font-sans text-xs text-luxury-gray mt-0.5">{order.id}</div>
                          </div>
                          <div className="text-xs font-sans text-luxury-gray space-y-0.5 mb-4">
                            <div><span className="font-medium text-luxury-black">{order.userName}</span></div>
                            <div>{order.userEmail}</div>
                            <div>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gold">{formatPrice(order.total)}</span>
                            <button onClick={() => setInvoiceOrder(order)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-gold border border-gold/30 hover:bg-gold hover:text-white px-3 py-1.5 rounded transition-all">
                              <FiPrinter size={12} /> Print Invoice
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── Invoice Modal ── */}
      {invoiceOrder && <Invoice order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
    </div>
  );
}
