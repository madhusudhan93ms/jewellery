import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { getNewArrivals } from '../data/products';

export default function NewArrivals() {
  const products = getNewArrivals();

  return (
    <>
      <section className="relative h-64 md:h-80 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1920&h=600&fit=crop"
            alt="New Arrivals"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-luxury-black/60" />
        </div>
        <div className="relative page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Just In</span>
            <h1 className="font-display text-4xl md:text-5xl text-white mt-2">New Arrivals</h1>
            <p className="font-body text-lg text-white/80 mt-3 max-w-xl">
              Discover our latest handcrafted pieces, fresh from our master artisans
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-cream min-h-[50vh]">
        <div className="page-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
