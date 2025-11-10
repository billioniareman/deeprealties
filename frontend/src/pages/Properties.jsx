import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiSearch, FiFilter, FiMapPin, FiDollarSign, FiHome, FiX } from 'react-icons/fi'
import api from '../utils/api'
import PropertyCard from '../components/PropertyCard'

const Properties = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    property_type: searchParams.get('property_type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
  })

  useEffect(() => {
    fetchProperties()
  }, [searchParams])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = {}
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params[key] = filters[key]
        }
      })
      const response = await api.get('/api/properties', { params })
      setProperties(response.data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key])
      }
    })
    setSearchParams(params)
    fetchProperties()
  }

  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      property_type: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      bathrooms: '',
    })
    setSearchParams({})
  }

  const activeFiltersCount = Object.values(filters).filter(v => v).length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          {t('properties.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('properties.subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FiFilter className="w-5 h-5 text-primary-blue" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('properties.filters')}</h2>
              </div>
              {activeFiltersCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearFilters}
                  className="text-primary-blue hover:text-primary-navy text-sm font-medium flex items-center space-x-1"
                >
                  <FiX className="w-4 h-4" />
                  <span>{t('properties.clearFilters')}</span>
                </motion.button>
              )}
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('properties.city')}
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder={t('properties.city')}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('properties.state')}
                </label>
                <input
                  type="text"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  placeholder={t('properties.state')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('properties.propertyType')}
                </label>
                <div className="relative">
                  <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filters.property_type}
                    onChange={(e) => handleFilterChange('property_type', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="">{t('properties.allTypes')}</option>
                    <option value="house">{t('properties.house')}</option>
                    <option value="apartment">{t('properties.apartment')}</option>
                    <option value="condo">{t('properties.condo')}</option>
                    <option value="villa">{t('properties.villa')}</option>
                    <option value="land">{t('properties.land')}</option>
                    <option value="commercial">{t('properties.commercial')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('properties.minPrice')}
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    placeholder={t('properties.minPrice')}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('properties.maxPrice')}
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    placeholder={t('properties.maxPrice')}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('properties.bedrooms')}
                </label>
                <input
                  type="number"
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  placeholder={t('properties.bedrooms')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('properties.bathrooms')}
                </label>
                <input
                  type="number"
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  placeholder={t('properties.bathrooms')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-primary-blue to-primary-emerald text-white py-3 px-4 rounded-lg hover:from-primary-navy hover:to-primary-blue transition-all flex items-center justify-center space-x-2 shadow-lg font-semibold"
              >
                <FiSearch className="w-5 h-5" />
                <span>{t('properties.search')}</span>
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Properties Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="rounded-full h-16 w-16 border-4 border-primary-blue border-t-transparent"
              ></motion.div>
            </div>
          ) : properties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
            >
              <FiHome className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-xl font-medium">
                {t('properties.noProperties')}
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Properties
