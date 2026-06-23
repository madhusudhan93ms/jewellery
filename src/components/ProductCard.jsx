import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { formatPrice } from '../data/products';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group bg-white rounded-sm overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500"
    >
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </Link>

        {product.isNew && (
          <span className="absolute top-3 left-3 bg-gold text-luxury-black text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1">
            New
          </span>
        )}

        {product.originalPrice > product.price && (
          <span className="absolute top-3 right-3 bg-luxury-black text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1">
            Sale
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 flex items-center justify-center gap-2 bg-gold-gradient text-luxury-black py-2.5 text-xs font-sans font-semibold uppercase tracking-widest hover:shadow-luxury transition-shadow"
          >
            <FiShoppingBag size={14} />
            Add to Cart
          </button>
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${
              inWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white text-luxury-black hover:bg-gold hover:text-luxury-black'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              size={12}
              className={i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-gray-300'}
            />
          ))}
          <span className="font-sans text-xs text-luxury-gray ml-1">
            ({product.reviews})
          </span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg text-luxury-black hover:text-gold transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-sans text-lg font-bold text-luxury-black">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="font-sans text-sm text-luxury-gray line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
