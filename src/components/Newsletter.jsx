import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-dark-gradient" />
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb19cc73?w=1920&h=600&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">
            Stay Connected
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-white mt-3 mb-4">
            Join Our Exclusive Circle
          </h2>
          <p className="font-body text-lg text-white/70 mb-8">
            Subscribe to receive updates on new collections, exclusive offers, and jewellery care tips.
          </p>

          {submitted ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-body text-gold text-lg"
            >
              Thank you for subscribing! Welcome to the VJS family.
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <button type="submit" className="btn-gold whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
