import { motion } from 'framer-motion'
import { FiHome, FiUsers, FiTrendingUp, FiAward, FiArrowRight, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  // Founder info
  const founder = {
    name: 'Deepak Rathore',
    role: 'Founder & CEO',
    image: '/founder.jpg',
    description: 'Visionary leader with years of experience in real estate, committed to helping people find their dream properties.'
  }

  const features = [
    { icon: <FiHome className="w-6 h-6" />, title: 'Premium Properties', desc: 'Handpicked luxury properties' },
    { icon: <FiUsers className="w-6 h-6" />, title: 'Expert Team', desc: 'Professional guidance always' },
    { icon: <FiTrendingUp className="w-6 h-6" />, title: 'Best Investment', desc: 'Maximum returns guaranteed' },
    { icon: <FiAward className="w-6 h-6" />, title: 'Trusted Service', desc: '100% verified listings' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Trusted Real Estate Partner
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Deep Realties is committed to helping you find your perfect property with trust, transparency, and expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Choose Deep Realties</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
              Leadership
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Meet Our Founder</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              The visionary behind Deep Realties, dedicated to transforming the real estate experience
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Founder Image */}
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-emerald-500 to-teal-600">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold text-white">
                      {founder.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
                
                {/* Founder Info */}
                <div className="p-8 flex flex-col justify-center">
                  <span className="inline-block w-fit px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                    {founder.role}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {founder.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {founder.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-emerald-600">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      <span>Hatod, MP</span>
                    </div>
                    <div className="flex items-center text-emerald-600">
                      <FiAward className="w-4 h-4 mr-1" />
                      <span>10+ Years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At Deep Realties, we believe that finding the perfect property should be a seamless and enjoyable experience. Our mission is to connect buyers with their dream homes and help sellers showcase their properties to the right audience.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                With cutting-edge technology, personalized service, and a commitment to excellence, we're revolutionizing the real estate industry one property at a time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Get in touch with us today and let us help you make the right choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/properties')}
                className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Browse Properties</span>
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/contact')}
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl flex items-center justify-center space-x-2"
              >
                <FiPhone className="w-5 h-5" />
                <span>Contact Us</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
