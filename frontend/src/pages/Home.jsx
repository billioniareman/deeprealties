import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiSearch, FiMapPin, FiDollarSign, FiHome, FiTrendingUp, FiUsers, FiAward, FiStar, FiArrowRight, FiCheck } from 'react-icons/fi'
import api from '../utils/api'
import PropertyCard from '../components/PropertyCard'

const Home = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    property_type: '',
    min_price: '',
    max_price: '',
  })
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProperties()
  }, [])

  const fetchFeaturedProperties = async () => {
    try {
      const response = await api.get('/api/properties', {
        params: { limit: 6 }
      })
      setFeaturedProperties(response.data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchFilters.city) params.append('city', searchFilters.city)
    if (searchFilters.property_type) params.append('property_type', searchFilters.property_type)
    if (searchFilters.min_price) params.append('min_price', searchFilters.min_price)
    if (searchFilters.max_price) params.append('max_price', searchFilters.max_price)
    navigate(`/properties?${params.toString()}`)
  }

  const features = [
    {
      icon: <FiHome className="w-8 h-8" />,
      title: t('home.features.premium.title'),
      description: t('home.features.premium.description'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: t('home.features.expert.title'),
      description: t('home.features.expert.description'),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: t('home.features.insights.title'),
      description: t('home.features.insights.description'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: t('home.features.trusted.title'),
      description: t('home.features.trusted.description'),
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Buyer',
      image: 'https://i.pravatar.cc/150?img=47',
      rating: 5,
      text: 'Found my dream home in just two weeks! The team was incredibly helpful and professional throughout the entire process.'
    },
    {
      name: 'Michael Chen',
      role: 'Property Seller',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'Sold my property quickly and at a great price. The platform made everything so easy and transparent.'
    },
    {
      name: 'Emma Williams',
      role: 'Property Buyer',
      image: 'https://i.pravatar.cc/150?img=45',
      rating: 5,
      text: 'Excellent service! The property listings are accurate and the support team is always ready to help.'
    }
  ]

  const stats = [
    { value: '1000+', label: t('home.stats.properties'), icon: <FiHome className="w-8 h-8" /> },
    { value: '500+', label: t('home.stats.customers'), icon: <FiUsers className="w-8 h-8" /> },
    { value: '50+', label: t('home.stats.cities'), icon: <FiMapPin className="w-8 h-8" /> }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-navy via-primary-blue to-primary-emerald opacity-90"></div>
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80')`,
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        ></motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4 w-full max-w-6xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            {t('home.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-10 text-gray-200"
          >
            {t('home.subtitle')}
          </motion.p>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="max-w-5xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('home.search.city')}
                  value={searchFilters.city}
                  onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={searchFilters.property_type}
                  onChange={(e) => setSearchFilters({ ...searchFilters, property_type: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="">{t('home.search.propertyType')}</option>
                  <option value="house">{t('properties.house')}</option>
                  <option value="apartment">{t('properties.apartment')}</option>
                  <option value="condo">{t('properties.condo')}</option>
                  <option value="villa">{t('properties.villa')}</option>
                  <option value="land">{t('properties.land')}</option>
                  <option value="commercial">{t('properties.commercial')}</option>
                </select>
              </div>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder={t('home.search.maxPrice')}
                  value={searchFilters.max_price}
                  onChange={(e) => setSearchFilters({ ...searchFilters, max_price: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary-blue to-primary-emerald text-white py-3 px-6 rounded-lg hover:from-primary-navy hover:to-primary-blue transition-all flex items-center justify-center space-x-2 shadow-lg font-semibold"
              >
                <FiSearch className="w-5 h-5" />
                <span>{t('home.search.search')}</span>
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-primary-blue mb-4 flex justify-center"
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                  className="text-5xl font-bold text-gray-800 dark:text-white mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            {t('home.whyChooseUs')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-xl">
            {t('home.whyChooseUsSubtitle')}
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
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto`}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            {t('home.featuredProperties')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-xl">
            {t('home.featuredSubtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="rounded-full h-16 w-16 border-4 border-primary-blue border-t-transparent"
            ></motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/properties')}
            className="px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-emerald text-white rounded-lg hover:from-primary-navy hover:to-primary-blue transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center space-x-2 mx-auto"
          >
            <span>{t('home.viewAll')}</span>
            <FiArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            {t('home.testimonials.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-xl">
            {t('home.testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-navy via-primary-blue to-primary-emerald">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {t('home.cta.subtitle')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/properties')}
              className="px-8 py-4 bg-white text-primary-blue rounded-lg hover:bg-gray-100 transition-colors shadow-xl font-semibold text-lg flex items-center space-x-2 mx-auto"
            >
              <span>{t('home.cta.button')}</span>
              <FiArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
