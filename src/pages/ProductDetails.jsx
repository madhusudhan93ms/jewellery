import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { getProductById, formatPrice } from '../data/products';
import { useShop } from '../context/ShopContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="py-32 text-center bg-cream min-h-screen">
        <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
        <Link to="/shop" className="btn-gold">Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="py-12 bg-cream min-h-screen">
      <div className="page-container">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-sans text-sm text-luxury-gray hover:text-gold transition-colors mb-8"
        >
          <FiArrowLeft size={16} />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square bg-white rounded-sm overflow-hidden shadow-card mb-4">
              <img
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-gold' : 'border-transparent hover:border-gold/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={16}
                  className={i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-gray-300'}
                />
              ))}
              <span className="font-sans text-sm text-luxury-gray ml-2">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-luxury-black mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-sans text-3xl font-bold text-luxury-black">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-sans text-lg text-luxury-gray line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="font-body text-lg text-luxury-gray leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex gap-6 mb-8 text-sm">
              <div>
                <span className="font-sans text-luxury-gray">Weight: </span>
                <span className="font-sans font-semibold">{product.weight}</span>
              </div>
              <div>
                <span className="font-sans text-luxury-gray">Purity: </span>
                <span className="font-sans font-semibold">{product.purity}</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-sans text-sm font-semibold uppercase tracking-wider">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gold/10 transition-colors"
                >
                  <FiMinus size={16} />
                </button>
                <span className="px-4 font-sans font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gold/10 transition-colors"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={handleAddToCart} className="btn-gold flex-1">
                <FiShoppingBag size={16} />
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="btn-dark flex-1">
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 border-2 rounded-sm transition-colors ${
                  inWishlist
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-gold text-luxury-black hover:bg-gold'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Reviews */}
            {product.reviewList && product.reviewList.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-display text-xl mb-6">Customer Reviews</h3>
                <div className="space-y-4">
                  {product.reviewList.map((review, i) => (
                    <div key={i} className="bg-white p-5 rounded-sm shadow-card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans font-semibold">{review.name}</span>
                        <span className="font-sans text-xs text-luxury-gray">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(review.rating)].map((_, j) => (
                          <FiStar key={j} size={12} className="text-gold fill-gold" />
                        ))}
                      </div>
                      <p className="font-body text-luxury-gray">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
