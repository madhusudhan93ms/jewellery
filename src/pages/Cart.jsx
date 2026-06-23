import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../data/products';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useShop();

  if (cart.length === 0) {
    return (
      <div className="py-32 bg-cream min-h-screen text-center">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FiShoppingBag size={64} className="mx-auto text-gold/40 mb-6" />
            <h1 className="font-display text-3xl mb-4">Your Cart is Empty</h1>
            <p className="font-body text-lg text-luxury-gray mb-8">
              Discover our exquisite collection and find something you love
            </p>
            <Link to="/shop" className="btn-gold">Continue Shopping</Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-cream min-h-screen">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-2">Shopping Cart</h1>
          <p className="font-sans text-luxury-gray mb-10">{cart.length} item(s) in your cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-4 md:p-6 rounded-sm shadow-card flex gap-4 md:gap-6"
              >
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-sm"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/product/${item.id}`}
                      className="font-display text-lg hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="font-sans text-lg font-bold mt-1">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gold/10 transition-colors"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="px-3 font-sans text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gold/10 transition-colors"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="hidden md:flex items-center">
                  <span className="font-sans font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </motion.div>
            ))}

            <button
              onClick={clearCart}
              className="font-sans text-sm text-red-400 hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-sm shadow-card sticky top-24">
              <h2 className="font-display text-xl mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-luxury-gray">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-luxury-gray">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-sans font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              <button className="btn-gold w-full mb-3">Proceed to Checkout</button>
              <Link to="/shop" className="btn-outline w-full text-center block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
