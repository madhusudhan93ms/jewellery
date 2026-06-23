import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { getProductsByCategory } from '../data/products';

export default function CategoryPage({ title, subtitle, category, bannerImage }) {
  const categoryProducts = getProductsByCategory(category);

  return (
    <>
      <section className="relative h-64 md:h-80 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={bannerImage} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-luxury-black/60" />
        </div>
        <div className="relative page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Collection</span>
            <h1 className="font-display text-4xl md:text-5xl text-white mt-2">{title}</h1>
            <p className="font-body text-lg text-white/80 mt-3 max-w-xl">{subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-cream min-h-[50vh]">
        <div className="page-container">
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-xl text-luxury-gray">No products in this category yet</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
