import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiSearch, FiFilter, FiMapPin, FiHome, FiX, FiSliders } from 'react-icons/fi'
import api from '../utils/api'
import PropertyCard from '../components/PropertyCard'

const Properties = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
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
    setShowFilters(false)
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
    <div className="min-h-screen bg-gray-50">
      {/* ========== HERO HEADER ========== */}
      <section className="relative py-28 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
              Explore Properties
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Dream Property
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Browse through our extensive collection of properties
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <section className="py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ========== FILTERS SIDEBAR (Desktop) ========== */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block lg:col-span-1"
            >
              <div className="sticky top-28">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 rounded-xl text-emerald-600">
                        <FiSliders className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">
                        Filters
                      </h2>
                    </div>
                    {activeFiltersCount > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearFilters}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold flex items-center space-x-1"
                      >
                        <FiX className="w-4 h-4" />
                        <span>Clear</span>
                      </motion.button>
                    )}
                  </div>

                  <div className="h-px bg-gray-100 mb-6" />

                  <form onSubmit={handleSearch} className="space-y-5">
                    {/* City */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                          <FiMapPin className="w-4 h-4 text-emerald-600" />
                        </div>
                        <input
                          type="text"
                          value={filters.city}
                          onChange={(e) => handleFilterChange('city', e.target.value)}
                          placeholder="Enter city"
                          className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        State
                      </label>
                      <input
                        type="text"
                        value={filters.state}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                        placeholder="Enter state"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    {/* Property Type */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Property Type
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                          <FiHome className="w-4 h-4 text-emerald-600" />
                        </div>
                        <select
                          value={filters.property_type}
                          onChange={(e) => handleFilterChange('property_type', e.target.value)}
                          className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                        >
                          <option value="">All Types</option>
                          <option value="house">House</option>
                          <option value="apartment">Apartment</option>
                          <option value="villa">Villa</option>
                          <option value="plot">Plot</option>
                          <option value="commercial">Commercial</option>
                          <option value="farmland">Farm Land</option>
                        </select>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          Min Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 text-sm font-medium">₹</span>
                          <input
                            type="number"
                            value={filters.min_price}
                            onChange={(e) => handleFilterChange('min_price', e.target.value)}
                            placeholder="Min"
                            className="w-full pl-8 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          Max Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 text-sm font-medium">₹</span>
                          <input
                            type="number"
                            value={filters.max_price}
                            onChange={(e) => handleFilterChange('max_price', e.target.value)}
                            placeholder="Max"
                            className="w-full pl-8 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Beds & Baths */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          Beds
                        </label>
                        <input
                          type="number"
                          value={filters.bedrooms}
                          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                          placeholder="Any"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          Baths
                        </label>
                        <input
                          type="number"
                          value={filters.bathrooms}
                          onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                          placeholder="Any"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all flex items-center justify-center space-x-2"
                    >
                      <FiSearch className="w-4 h-4" />
                      <span>Search Properties</span>
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* ========== PROPERTIES GRID ========== */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(true)}
                  className="flex items-center space-x-2 px-5 py-3 bg-white border border-gray-200 rounded-xl shadow-sm"
                >
                  <FiFilter className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white text-xs font-bold rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Results Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-6"
              >
                <div>
                  <span className="text-gray-500">
                    {loading ? 'Loading...' : (
                      <span>
                        <span className="text-emerald-600 font-bold">{properties.length}</span>
                        {' '}{properties.length === 1 ? 'property' : 'properties'} found
                      </span>
                    )}
                  </span>
                </div>
              </motion.div>

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-32">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-3 border-emerald-200 border-t-emerald-500 rounded-full"
                  />
                </div>
              ) : properties.length === 0 ? (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto flex items-center justify-center bg-emerald-100 rounded-2xl text-emerald-600 mb-6">
                      <FiHome className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      No Properties Found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      No properties found. Try adjusting your filters.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearFilters}
                      className="px-6 py-3 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
                    >
                      Clear Filters
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* Properties Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property, index) => (
                    <PropertyCard key={property.id} property={property} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== MOBILE FILTERS MODAL ========== */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="h-px bg-gray-100 mb-6" />

              {/* Filter Form */}
              <form onSubmit={handleSearch} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    City
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <FiMapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <input
                      type="text"
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      placeholder="Enter city"
                      className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Property Type
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <FiHome className="w-4 h-4 text-emerald-600" />
                    </div>
                    <select
                      value={filters.property_type}
                      onChange={(e) => handleFilterChange('property_type', e.target.value)}
                      className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    >
                      <option value="">All Types</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="plot">Plot</option>
                      <option value="commercial">Commercial</option>
                      <option value="farmland">Farm Land</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Min Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 font-medium">₹</span>
                      <input
                        type="number"
                        value={filters.min_price}
                        onChange={(e) => handleFilterChange('min_price', e.target.value)}
                        placeholder="Min"
                        className="w-full pl-8 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Max Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 font-medium">₹</span>
                      <input
                        type="number"
                        value={filters.max_price}
                        onChange={(e) => handleFilterChange('max_price', e.target.value)}
                        placeholder="Max"
                        className="w-full pl-8 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearFilters}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                  >
                    Clear
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg"
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Properties
