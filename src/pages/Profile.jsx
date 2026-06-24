import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiShoppingBag, FiMail, FiPhone, FiLock, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="py-12 bg-cream min-h-screen">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header Dashboard Banner */}
          <div className="bg-white border border-gold/10 p-6 md:p-8 rounded-sm shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                <FiUser size={32} />
              </div>
              <div>
                <h1 className="font-display text-2xl text-luxury-black">{user.name}</h1>
                <p className="font-sans text-xs text-gold font-bold tracking-widest uppercase mt-0.5">
                  ID: {user.id} {user.role === 'admin' && '• ADMIN'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-outline flex items-center gap-2 !px-4 !py-2 !text-xs hover:border-red-500 hover:text-red-500 transition-colors"
            >
              <FiLogOut size={14} />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Details Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 border border-gold/10 rounded-sm shadow-card">
                <h2 className="font-display text-lg mb-6 border-b border-gray-100 pb-3">
                  Account Information
                </h2>
                <div className="space-y-4 font-sans text-sm">
                  <div>
                    <span className="text-luxury-gray text-xs block uppercase tracking-wider mb-1">
                      Email Address
                    </span>
                    <span className="text-luxury-black flex items-center gap-2 font-medium">
                      <FiMail className="text-gold" />
                      {user.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-luxury-gray text-xs block uppercase tracking-wider mb-1">
                      Phone Number
                    </span>
                    <span className="text-luxury-black flex items-center gap-2 font-medium">
                      <FiPhone className="text-gold" />
                      {user.phone || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-luxury-gray text-xs block uppercase tracking-wider mb-1">
                      Membership Status
                    </span>
                    <span className="inline-block bg-gold/10 text-gold px-2 py-0.5 text-xs font-semibold rounded-sm uppercase tracking-wider">
                      {user.role === 'admin' ? 'Administrator' : 'Premium Member'}
                    </span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <Link to="/admin" className="btn-gold w-full text-center block !py-2.5 !text-xs">
                      Access Admin Control
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Order History Column */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 border border-gold/10 rounded-sm shadow-card min-h-[400px]">
                <h2 className="font-display text-lg mb-6 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <FiPackage className="text-gold" />
                  Order History
                </h2>

                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <FiShoppingBag size={48} className="mx-auto text-gold/30 mb-4" />
                    <p className="font-display text-lg text-luxury-black">No Orders Placed Yet</p>
                    <p className="font-sans text-sm text-luxury-gray mt-1 mb-6">
                      Explore our collections to make your first purchase.
                    </p>
                    <Link to="/shop" className="btn-gold !py-2.5 !text-xs">
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gold/5 rounded-sm p-4 hover:border-gold/20 transition-all shadow-sm"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-3 mb-3 gap-2">
                          <div>
                            <span className="font-sans text-xs text-luxury-gray block">
                              Order Placed: {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="font-sans text-xs font-bold text-luxury-black">
                              ID: {order.id}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-sans text-xs text-luxury-gray block">Total</span>
                            <span className="font-sans font-bold text-gold">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                          <div>
                            <span className="inline-block bg-green-50 text-green-700 border border-green-200 px-2 py-1 text-[10px] font-bold uppercase rounded-sm tracking-wider">
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="divide-y divide-gray-50">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-sm border border-gray-100"
                              />
                              <div className="flex-1 flex justify-between items-center min-w-0">
                                <div>
                                  <h4 className="font-display text-sm text-luxury-black truncate max-w-[200px] sm:max-w-md">
                                    {item.name}
                                  </h4>
                                  <span className="font-sans text-xs text-luxury-gray">
                                    Qty: {item.quantity} @ {formatPrice(item.price)}
                                  </span>
                                </div>
                                <span className="font-sans text-sm font-semibold text-luxury-black">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
