import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiAward, FiLock, FiRefreshCw, FiTool } from 'react-icons/fi';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Testimonial from '../components/Testimonial';
import Newsletter from '../components/Newsletter';
import {
  categories,
  getBestSellers,
  getNewArrivals,
  testimonials,
  instagramPosts,
  whyChooseUs,
} from '../data/products';

const iconMap = {
  shield: FiShield,
  diamond: FiAward,
  lock: FiLock,
  return: FiRefreshCw,
  craft: FiTool,
};

export default function Home() {
  const bestSellers = getBestSellers().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 4);

  return (
    <>
      <Hero />

      {/* Featured Categories */}
      <section className="py-20 bg-cream">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Categories</span>
            <h2 className="section-title mt-3">Featured Categories</h2>
            <p className="section-subtitle mx-auto">
              Explore our curated collections of exquisite handcrafted jewellery
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Popular</span>
              <h2 className="section-title mt-3">Best Sellers</h2>
            </motion.div>
            <Link to="/shop" className="btn-outline mt-4 md:mt-0">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-cream">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Just In</span>
              <h2 className="section-title mt-3">New Arrivals</h2>
            </motion.div>
            <Link to="/new-arrivals" className="btn-outline mt-4 md:mt-0">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Bridal Collection Showcase */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb19cc73?w=1920&h=800&fit=crop"
            alt="Bridal collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-luxury-black/70" />
        </div>
        <div className="relative page-container">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-sans text-gold text-sm uppercase tracking-[0.4em]"
            >
              Bridal Collection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl text-white mt-3 mb-6"
            >
              Your Dream Wedding Begins Here
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-body text-xl text-white/80 mb-8"
            >
              Discover our exquisite bridal sets crafted to make your special day truly unforgettable.
            </motion.p>
            <Link to="/bridal" className="btn-gold">
              Explore Bridal
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Our Promise</span>
            <h2 className="section-title mt-3">Why Choose VJS Jewellery</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whyChooseUs.map((item, i) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-sm hover:bg-cream transition-colors duration-300 group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <Icon size={28} className="text-gold" />
                  </div>
                  <h3 className="font-display text-lg text-luxury-black mb-2">{item.title}</h3>
                  <p className="font-sans text-sm text-luxury-gray leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cream">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Reviews</span>
            <h2 className="section-title mt-3">Customer Testimonials</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Testimonial key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">@vjsjewellery</span>
            <h2 className="section-title mt-3">Instagram Gallery</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {instagramPosts.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square overflow-hidden group cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Instagram post ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
