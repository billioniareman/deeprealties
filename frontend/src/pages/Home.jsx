import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiDollarSign, FiHome } from 'react-icons/fi'
import api from '../utils/api'
import PropertyCard from '../components/PropertyCard'

const Home = () => {
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-navy to-primary-blue opacity-90"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80')`,
          }}
        ></div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Find Your Dream Home Today
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Discover the perfect property for you
          </p>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="City"
                  value={searchFilters.city}
                  onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={searchFilters.property_type}
                  onChange={(e) => setSearchFilters({ ...searchFilters, property_type: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={searchFilters.max_price}
                  onChange={(e) => setSearchFilters({ ...searchFilters, max_price: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-blue text-white py-3 px-6 rounded-lg hover:bg-primary-navy transition-colors flex items-center justify-center space-x-2"
              >
                <FiSearch className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </motion.form>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Featured Properties
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our handpicked selection of premium properties
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/properties')}
            className="px-8 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-navy transition-colors"
          >
            View All Properties
          </button>
        </motion.div>
      </section>
    </div>
  )
}

export default Home

