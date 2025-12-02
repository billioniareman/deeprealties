import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiMapPin, FiSearch, FiPlus, FiCheck, FiUser, FiMail, FiPhone } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Rent = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('find')
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    rent_type: '',
    tenant_type: '',
    min_rent: '',
    max_rent: '',
    bedrooms: ''
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'flat',
    locality: '',
    city: '',
    state: '',
    monthly_rent: '',
    security_deposit: '',
    area_sqft: '',
    bedrooms: '',
    bathrooms: '',
    rent_type: 'unfurnished',
    tenant_type: 'any',
    amenities: [],
    images: [],
    // Contact details
    full_name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (activeTab === 'find') {
      fetchRentals()
    }
  }, [activeTab])

  const fetchRentals = async () => {
    setLoading(true)
    try {
      const params = {}
      Object.keys(filters).forEach(key => {
        if (filters[key]) params[key] = filters[key]
      })
      const response = await api.get('/api/rentals', { params })
      setRentals(response.data)
    } catch (error) {
      console.error('Error fetching rentals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRentals()
  }

  const handleListSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/api/rentals', {
        ...formData,
        monthly_rent: parseFloat(formData.monthly_rent),
        security_deposit: formData.security_deposit ? parseFloat(formData.security_deposit) : null,
        area_sqft: parseFloat(formData.area_sqft),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null
      })
      toast.success('Rental property submitted! It will be visible after admin approval.')
      setActiveTab('find')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit rental')
    } finally {
      setSubmitting(false)
    }
  }

  const formatRent = (rent) => {
    if (rent >= 100000) return `₹${(rent / 100000).toFixed(1)}L/mo`
    if (rent >= 1000) return `₹${(rent / 1000).toFixed(0)}K/mo`
    return `₹${rent}/mo`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
              Rental Properties
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Rent Property
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Find your perfect rental home or list your property for rent
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex">
            <button
              onClick={() => setActiveTab('find')}
              className={`flex-1 py-4 text-center font-semibold transition-all relative ${
                activeTab === 'find' ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiSearch className="w-5 h-5" />
                <span>Find Property to Rent</span>
              </div>
              {activeTab === 'find' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-4 text-center font-semibold transition-all relative ${
                activeTab === 'list' ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiPlus className="w-5 h-5" />
                <span>List Property for Rent</span>
              </div>
              {activeTab === 'list' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'find' ? (
          <motion.section
            key="find"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="py-12"
          >
            <div className="container mx-auto px-6 lg:px-8">
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <FiMapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <input
                      type="text"
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="City"
                    />
                  </div>
                  <select
                    value={filters.property_type}
                    onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  >
                    <option value="">Property Type</option>
                    <option value="flat">Flat</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="apartment">Apartment</option>
                  </select>
                  <select
                    value={filters.rent_type}
                    onChange={(e) => setFilters({ ...filters, rent_type: e.target.value })}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  >
                    <option value="">Furnishing</option>
                    <option value="furnished">Furnished</option>
                    <option value="semi_furnished">Semi-Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                  <select
                    value={filters.tenant_type}
                    onChange={(e) => setFilters({ ...filters, tenant_type: e.target.value })}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  >
                    <option value="">Tenant Type</option>
                    <option value="family">Family</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="any">Any</option>
                  </select>
                  <input
                    type="number"
                    value={filters.max_rent}
                    onChange={(e) => setFilters({ ...filters, max_rent: e.target.value })}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="Max Rent"
                  />
                  <input
                    type="number"
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="Bedrooms"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2"
                  >
                    <FiSearch className="w-4 h-4" />
                    <span>Search</span>
                  </motion.button>
                </form>
              </div>

              {/* Results */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full"
                  />
                </div>
              ) : rentals.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                    <FiHome className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Rentals Found</h3>
                  <p className="text-gray-500">Try adjusting your filters or check back later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentals.map((rental, index) => (
                    <motion.div
                      key={rental.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                        {rental.images?.[0] ? (
                          <img 
                            src={rental.images[0]} 
                            alt={rental.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiHome className="w-12 h-12 text-emerald-400" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 flex space-x-2">
                          <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase">
                            {rental.rent_type?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="text-2xl font-bold text-emerald-600 mb-2">
                          {formatRent(rental.monthly_rent)}
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">
                          {rental.title}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiMapPin className="w-4 h-4 mr-1 text-emerald-500" />
                          {rental.locality}, {rental.city}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-12"
          >
            <div className="container mx-auto px-6 lg:px-8">
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    List Your Property for Rent
                  </h2>

                  <form onSubmit={handleListSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        placeholder="e.g., 2BHK Furnished Flat Near Metro"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          Monthly Rent (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.monthly_rent}
                          onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                          placeholder="25000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          Security Deposit (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.security_deposit}
                          onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                          placeholder="50000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          Furnishing *
                        </label>
                        <select
                          required
                          value={formData.rent_type}
                          onChange={(e) => setFormData({ ...formData, rent_type: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        >
                          <option value="unfurnished">Unfurnished</option>
                          <option value="semi_furnished">Semi-Furnished</option>
                          <option value="furnished">Furnished</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          Preferred Tenant *
                        </label>
                        <select
                          required
                          value={formData.tenant_type}
                          onChange={(e) => setFormData({ ...formData, tenant_type: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        >
                          <option value="any">Any</option>
                          <option value="family">Family Only</option>
                          <option value="bachelor">Bachelor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          Property Type *
                        </label>
                        <select
                          required
                          value={formData.property_type}
                          onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        >
                          <option value="flat">Flat</option>
                          <option value="house">House</option>
                          <option value="villa">Villa</option>
                          <option value="apartment">Apartment</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          Locality *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.locality}
                          onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                          placeholder="Area"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Description *
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
                        rows="4"
                        placeholder="Describe your rental property..."
                      />
                    </div>

                    <div className="h-px bg-gray-200" />

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                            Full Name *
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                              <FiUser className="w-4 h-4 text-emerald-600" />
                            </div>
                            <input
                              type="text"
                              required
                              value={formData.full_name}
                              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                              className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                              placeholder="Your Name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                            Email *
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                              <FiMail className="w-4 h-4 text-emerald-600" />
                            </div>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                            Phone *
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                              <FiPhone className="w-4 h-4 text-emerald-600" />
                            </div>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                              placeholder="+91 98765 43210"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <FiCheck className="w-5 h-5" />
                          <span>Submit for Review</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Rent
