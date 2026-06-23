import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../data/products';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="py-32 bg-cream min-h-screen text-center">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FiHeart size={64} className="mx-auto text-gold/40 mb-6" />
            <h1 className="font-display text-3xl mb-4">Your Wishlist is Empty</h1>
            <p className="font-body text-lg text-luxury-gray mb-8">
              Save your favourite pieces and shop them later
            </p>
            <Link to="/shop" className="btn-gold">Explore Collection</Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-cream min-h-screen">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-2">My Wishlist</h1>
          <p className="font-sans text-luxury-gray mb-10">{wishlist.length} saved item(s)</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-sm overflow-hidden shadow-card group"
            >
              <div className="relative aspect-square overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <div className="p-5">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-display text-lg hover:text-gold transition-colors line-clamp-1 mb-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="font-sans text-lg font-bold mb-4">{formatPrice(product.price)}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="btn-gold w-full !py-2.5 !text-xs"
                >
                  <FiShoppingBag size={14} />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
