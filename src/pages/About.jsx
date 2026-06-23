import { motion } from 'framer-motion';
import { FiShield, FiAward, FiHeart, FiUsers } from 'react-icons/fi';

const trustPoints = [
  { icon: FiShield, title: 'BIS Certified Gold', description: 'Every gold piece carries the BIS hallmark of purity and authenticity.' },
  { icon: FiAward, title: 'Certified Diamonds', description: 'IGI and GIA certified diamonds ensuring exceptional quality.' },
  { icon: FiHeart, title: 'Customer First', description: 'Dedicated support team ensuring a seamless shopping experience.' },
  { icon: FiUsers, title: 'Generations of Trust', description: 'Over three decades of serving families across India.' },
];

export default function About() {
  return (
    <>
      <section className="relative h-64 md:h-80 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634662?w=1920&h=600&fit=crop"
            alt="About VJS Jewellery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-luxury-black/60" />
        </div>
        <div className="relative page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl text-white">About VJS Jewellery</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="page-container max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-xl md:text-2xl text-luxury-gray leading-relaxed text-center"
          >
            VJS Jewellery is dedicated to crafting timeless jewellery that combines tradition, elegance, and modern design. Every piece reflects exceptional craftsmanship and celebrates life's precious moments.
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Our Mission</span>
              <h2 className="font-display text-3xl mt-3 mb-6">Crafting Memories That Last Forever</h2>
              <p className="font-body text-lg text-luxury-gray leading-relaxed">
                Our mission is to create exquisite jewellery that becomes a part of your most cherished memories. We blend traditional Indian craftsmanship with contemporary designs, ensuring every piece is a work of art that transcends generations.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[4/3] rounded-sm overflow-hidden shadow-luxury"
            >
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[4/3] rounded-sm overflow-hidden shadow-luxury order-2 md:order-1"
            >
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb19cc73?w=800&h=600&fit=crop"
                alt="Vision"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Our Vision</span>
              <h2 className="font-display text-3xl mt-3 mb-6">Leading Luxury Jewellery in India</h2>
              <p className="font-body text-lg text-luxury-gray leading-relaxed">
                We envision becoming India's most trusted luxury jewellery brand, known for uncompromising quality, innovative designs, and exceptional customer service. Our goal is to make fine jewellery accessible while maintaining the highest standards of craftsmanship.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Trust</span>
            <h2 className="section-title mt-3">Why Customers Trust Us</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-8 bg-cream rounded-sm hover:shadow-luxury transition-shadow"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                    <Icon size={24} className="text-gold" />
                  </div>
                  <h3 className="font-display text-lg mb-2">{point.title}</h3>
                  <p className="font-sans text-sm text-luxury-gray">{point.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
