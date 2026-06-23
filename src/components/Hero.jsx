import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1573408301185-9146fe634662?w=1920&h=1080&fit=crop"
          alt="Luxury jewellery display"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/80 via-luxury-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/40 to-transparent" />
      </div>

      <div className="relative page-container py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block font-sans text-gold text-sm uppercase tracking-[0.4em] mb-4"
          >
            Premium Handcrafted Jewellery
          </motion.span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white font-medium leading-tight mb-6">
            Timeless Elegance,{' '}
            <span className="text-gold italic">Crafted Forever</span>
          </h1>

          <p className="font-body text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-xl">
            Discover handcrafted gold, diamond, and bridal jewellery designed to celebrate every special moment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="btn-gold">
              Shop Now
            </Link>
            <Link
              to="/collections"
              className="btn-outline !border-white !text-white hover:!bg-white hover:!text-luxury-black"
            >
              Explore Collection
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="font-sans text-xs text-white/50 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
