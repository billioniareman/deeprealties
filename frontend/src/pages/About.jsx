import { motion } from 'framer-motion'
import { FiHome, FiUsers, FiTrendingUp, FiAward } from 'react-icons/fi'

const About = () => {
  const features = [
    {
      icon: <FiHome className="w-8 h-8" />,
      title: 'Premium Properties',
      description: 'Curated selection of the finest properties in prime locations',
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Expert Team',
      description: 'Our experienced team is here to help you every step of the way',
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Market Insights',
      description: 'Stay informed with real-time market trends and analytics',
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Trusted Platform',
      description: 'Join thousands of satisfied buyers and sellers',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-navy to-primary-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            About DeepRealties
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Your trusted partner in finding and selling premium real estate properties
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
              At DeepRealties, we believe that finding the perfect property should be a seamless
              and enjoyable experience. Our mission is to connect buyers with their dream homes
              and help sellers showcase their properties to the right audience.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              With cutting-edge technology, personalized service, and a commitment to excellence,
              we're revolutionizing the real estate industry one property at a time.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-lg overflow-hidden shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80"
              alt="Modern building"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Experience the difference with our comprehensive platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 text-center"
              >
                <div className="text-primary-blue mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl font-bold text-primary-blue mb-2">1000+</div>
            <div className="text-gray-600 dark:text-gray-400 text-lg">Properties Listed</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-5xl font-bold text-primary-blue mb-2">500+</div>
            <div className="text-gray-600 dark:text-gray-400 text-lg">Happy Customers</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-5xl font-bold text-primary-blue mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-400 text-lg">Cities Covered</div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About

