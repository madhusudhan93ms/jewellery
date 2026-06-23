import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-cream py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center page-container"
      >
        <span className="font-display text-8xl md:text-9xl text-gold/30">404</span>
        <h1 className="font-display text-3xl md:text-4xl text-luxury-black mt-4 mb-4">
          Page Not Found
        </h1>
        <p className="font-body text-lg text-luxury-gray mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let us guide you back to our collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-gold">Go Home</Link>
          <Link to="/shop" className="btn-outline">Browse Shop</Link>
        </div>
      </motion.div>
    </div>
  );
}
