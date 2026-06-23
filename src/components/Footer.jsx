import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const footerLinks = {
  shop: [
    { name: 'Gold Jewellery', path: '/gold' },
    { name: 'Diamond Jewellery', path: '/diamond' },
    { name: 'Bridal Collection', path: '/bridal' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Collections', path: '/collections' },
  ],
  company: [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ],
  legal: [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms' },
  ],
};

const socialLinks = [
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
];

export default function Footer() {
  return (
    <footer className="bg-luxury-black text-white">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="font-display text-3xl font-semibold text-gold tracking-wider">
                VJS
              </span>
              <span className="block font-body text-sm text-white/60 tracking-[0.3em] uppercase mt-1">
                Jewellery
              </span>
            </Link>
            <p className="font-body text-white/70 text-lg leading-relaxed mb-6">
              Crafting timeless elegance since generations. Every piece tells a story of tradition, artistry, and love.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-gold hover:text-luxury-black hover:border-gold transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-gold mb-6 tracking-wide">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-sans text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-gold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-sans text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-3 mt-6 pt-6 border-t border-white/10">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-sans text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-gold mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-gold mt-1 flex-shrink-0" size={18} />
                <span className="font-sans text-sm text-white/70">
                  42, Jewellery Street, T. Nagar, Chennai, Tamil Nadu 600017
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-gold flex-shrink-0" size={18} />
                <a href="tel:+914412345678" className="font-sans text-sm text-white/70 hover:text-gold transition-colors">
                  +91 44 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-gold flex-shrink-0" size={18} />
                <a href="mailto:info@vjsjewellery.com" className="font-sans text-sm text-white/70 hover:text-gold transition-colors">
                  info@vjsjewellery.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-sm text-white/50">
            © 2026 VJS Jewellery. All Rights Reserved.
          </p>
          <p className="font-sans text-xs text-white/40 tracking-widest uppercase">
            Timeless Elegance, Crafted Forever
          </p>
        </div>
      </div>
    </footer>
  );
}
