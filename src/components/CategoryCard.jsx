import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        to={category.slug}
        className="group relative block aspect-[3/4] overflow-hidden rounded-sm"
      >
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-luxury-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
          <h3 className="font-display text-xl md:text-2xl text-white text-center group-hover:text-gold transition-colors duration-300">
            {category.name}
          </h3>
          <span className="mt-2 font-sans text-xs text-white/70 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore →
          </span>
        </div>
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/50 transition-colors duration-300 rounded-sm" />
      </Link>
    </motion.div>
  );
}
