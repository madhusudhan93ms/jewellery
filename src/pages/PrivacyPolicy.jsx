import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly, such as your name, email address, phone number, shipping address, and payment details when you create an account, place an order, or contact us.',
    },
    {
      title: 'How We Use Your Information',
      content: 'Your information is used to process orders, provide customer support, send promotional communications (with your consent), improve our services, and comply with legal obligations.',
    },
    {
      title: 'Data Security',
      content: 'We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal information.',
    },
    {
      title: 'Cookies',
      content: 'Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can manage cookie preferences through your browser settings.',
    },
    {
      title: 'Third-Party Sharing',
      content: 'We do not sell your personal information. We may share data with trusted service providers for payment processing, shipping, and analytics, bound by confidentiality agreements.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information. Contact us at privacy@vjsjewellery.com to exercise these rights.',
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
            Privacy Policy
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
