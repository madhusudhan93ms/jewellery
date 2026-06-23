import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <section className="relative h-64 md:h-80 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634662?w=1920&h=600&fit=crop"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-luxury-black/60" />
        </div>
        <div className="relative page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl text-white">Contact Us</h1>
            <p className="font-body text-lg text-white/80 mt-3">We'd love to hear from you</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-display text-2xl mb-6">Get in Touch</h2>

              {submitted ? (
                <div className="bg-white p-8 rounded-sm shadow-card text-center">
                  <p className="font-display text-xl text-gold mb-2">Thank You!</p>
                  <p className="font-body text-luxury-gray">Your message has been sent. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="input-field"
                    />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                      className="input-field"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                    className="input-field"
                  />
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                    className="input-field"
                  />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    required
                    rows={5}
                    className="input-field resize-none"
                  />
                  <button type="submit" className="btn-gold">
                    <FiSend size={16} />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-sm shadow-card">
                <h3 className="font-display text-xl mb-6">Contact Information</h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="text-gold" size={18} />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-sm uppercase tracking-wider mb-1">Address</p>
                      <p className="font-sans text-luxury-gray">
                        42, Jewellery Street, T. Nagar, Chennai, Tamil Nadu 600017
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <FiPhone className="text-gold" size={18} />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-sm uppercase tracking-wider mb-1">Phone</p>
                      <a href="tel:+914412345678" className="font-sans text-luxury-gray hover:text-gold transition-colors">
                        +91 44 1234 5678
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <FiMail className="text-gold" size={18} />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-sm uppercase tracking-wider mb-1">Email</p>
                      <a href="mailto:info@vjsjewellery.com" className="font-sans text-luxury-gray hover:text-gold transition-colors">
                        info@vjsjewellery.com
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-sm overflow-hidden shadow-card h-64 md:h-80">
                <iframe
                  title="VJS Jewellery Location"
                  src="https://maps.google.com/maps?q=T+Nagar+Chennai&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
