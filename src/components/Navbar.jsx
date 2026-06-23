import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiUser,
} from 'react-icons/fi';
import { useShop } from '../context/ShopContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Gold', path: '/gold' },
  { name: 'Diamond', path: '/diamond' },
  { name: 'Bridal', path: '/bridal' },
  { name: 'New Arrivals', path: '/new-arrivals' },
  { name: 'Collections', path: '/collections' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, wishlist } = useShop();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-gold/10">
        <div className="page-container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display text-2xl lg:text-3xl font-semibold tracking-wider text-luxury-black group-hover:text-gold transition-colors">
                VJS
              </span>
              <span className="hidden sm:block font-body text-sm text-luxury-gray tracking-[0.3em] uppercase">
                Jewellery
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `font-sans text-xs uppercase tracking-widest transition-colors duration-300 ${
                      isActive
                        ? 'text-gold font-semibold'
                        : 'text-luxury-black hover:text-gold'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-luxury-black hover:text-gold transition-colors"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              <Link
                to="/wishlist"
                className="relative p-2 text-luxury-black hover:text-gold transition-colors"
                aria-label="Wishlist"
              >
                <FiHeart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-luxury-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2 text-luxury-black hover:text-gold transition-colors"
                aria-label="Cart"
              >
                <FiShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-luxury-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/login"
                className="hidden md:inline-flex btn-gold !px-4 !py-2 !text-xs"
              >
                <FiUser size={14} />
                Login
              </Link>

              <button
                onClick={() => setMobileOpen(true)}
                className="xl:hidden p-2 text-luxury-black hover:text-gold transition-colors"
                aria-label="Open menu"
              >
                <FiMenu size={24} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="overflow-hidden pb-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for jewellery..."
                    className="input-field pr-12"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gold hover:text-luxury-black transition-colors"
                  >
                    <FiSearch size={18} />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 xl:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-cream z-50 shadow-2xl xl:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gold/20">
                <span className="font-display text-xl font-semibold">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:text-gold transition-colors"
                  aria-label="Close menu"
                >
                  <FiX size={24} />
                </button>
              </div>
              <nav className="p-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `py-3 px-4 font-sans text-sm uppercase tracking-widest rounded-sm transition-colors ${
                        isActive
                          ? 'bg-gold/10 text-gold font-semibold'
                          : 'text-luxury-black hover:bg-gold/5 hover:text-gold'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-gold mt-4 text-center"
                >
                  Login
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
