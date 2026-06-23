import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

export default function Testimonial({ testimonial, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="bg-white p-8 rounded-sm shadow-card hover:shadow-luxury transition-shadow duration-500 relative"
    >
      <div className="absolute top-6 right-6 font-display text-6xl text-gold/20 leading-none">
        "
      </div>

      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <FiStar key={i} size={14} className="text-gold fill-gold" />
        ))}
      </div>

      <p className="font-body text-lg text-luxury-gray leading-relaxed mb-6 italic">
        "{testimonial.text}"
      </p>

      <div className="flex items-center gap-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/30"
        />
        <div>
          <p className="font-display text-lg text-luxury-black">{testimonial.name}</p>
          <p className="font-sans text-sm text-luxury-gray">{testimonial.location}</p>
        </div>
      </div>
    </motion.div>
  );
}
