import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../data/products';

const collections = [
  {
    title: 'Heritage Collection',
    description: 'Timeless designs inspired by centuries of Indian craftsmanship and royal traditions.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop',
    link: '/gold',
  },
  {
    title: 'Modern Minimalist',
    description: 'Contemporary pieces for the modern woman who appreciates understated elegance.',
    image: 'https://images.pexels.com/photos/963787/pexels-photo-963787.jpeg?w=800&h=600&fit=crop',
    link: '/shop?category=earrings',
  },
  {
    title: 'Bridal Dreams',
    description: 'Opulent bridal sets designed to make every bride feel like royalty on her special day.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb19cc73?w=800&h=600&fit=crop',
    link: '/bridal',
  },
  {
    title: 'Diamond Eternity',
    description: 'Certified diamonds set in precious metals for moments that last forever.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop',
    link: '/diamond',
  },
];

export default function Collections() {
  return (
    <>
      <section className="relative h-64 md:h-80 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634662?w=1920&h=600&fit=crop"
            alt="Collections"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-luxury-black/60" />
        </div>
        <div className="relative page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Curated</span>
            <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Our Collections</h1>
            <p className="font-body text-lg text-white/80 mt-3 max-w-xl">
              Explore our signature collections, each telling a unique story of elegance
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="page-container space-y-8">
          {collections.map((collection, i) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white rounded-sm overflow-hidden shadow-card hover:shadow-luxury transition-shadow`}
            >
              <div className="md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="font-display text-3xl text-luxury-black mb-4">{collection.title}</h2>
                <p className="font-body text-lg text-luxury-gray leading-relaxed mb-6">
                  {collection.description}
                </p>
                <Link to={collection.link} className="btn-outline self-start">
                  View Collection
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="page-container">
          <h2 className="section-title text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.slug}
                className="group relative aspect-square overflow-hidden rounded-sm"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-luxury-black/40 group-hover:bg-luxury-black/60 transition-colors flex items-center justify-center">
                  <span className="font-display text-xl text-white group-hover:text-gold transition-colors">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
