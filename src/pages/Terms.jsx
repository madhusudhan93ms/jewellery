import { motion } from 'framer-motion';

export default function Terms() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using the VJS Jewellery website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.',
    },
    {
      title: 'Products and Pricing',
      content: 'All product descriptions, images, and prices are subject to change without notice. We strive for accuracy but do not warrant that product descriptions or pricing are error-free. Gold prices are subject to daily market fluctuations.',
    },
    {
      title: 'Orders and Payment',
      content: 'Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. Payment must be received in full before dispatch. We accept credit/debit cards, UPI, net banking, and EMI options.',
    },
    {
      title: 'Shipping and Delivery',
      content: 'Standard delivery takes 5-7 business days. Express delivery is available in select cities. Risk of loss passes to you upon delivery. We are not responsible for delays caused by circumstances beyond our control.',
    },
    {
      title: 'Returns and Exchanges',
      content: 'We offer a 15-day return policy on eligible items. Products must be in original condition with all certificates and packaging. Custom-made and engraved items are non-returnable. Refunds are processed within 7-10 business days.',
    },
    {
      title: 'Intellectual Property',
      content: 'All content on this website, including designs, images, text, and logos, is the property of VJS Jewellery and protected by intellectual property laws. Unauthorized use is prohibited.',
    },
    {
      title: 'Limitation of Liability',
      content: 'VJS Jewellery shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services, beyond the purchase price of the product.',
    },
  ];

  return (
    <>
      <section className="relative h-48 md:h-64 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-dark-gradient" />
        <div className="relative page-container">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl text-white"
          >
            Terms & Conditions
          </motion.h1>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="page-container max-w-3xl">
          <p className="font-sans text-sm text-luxury-gray mb-10">Last updated: January 2026</p>
          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <h2 className="font-display text-xl mb-3">{section.title}</h2>
                <p className="font-body text-lg text-luxury-gray leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
