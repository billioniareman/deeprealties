import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiUser, FiMail, FiPhone, FiSend, FiCheck, FiSearch } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Buy = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    property_type: '',
    min_budget: '',
    max_budget: '',
    preferred_location: '',
    city: '',
    state: '',
    min_area_sqft: '',
    max_area_sqft: '',
    bedrooms: '',
    bathrooms: '',
    additional_requirements: '',
    full_name: '',
    email: '',
    phone: ''
  })

  const propertyTypes = [
    { value: 'land', label: 'Land', icon: '🏞️' },
    { value: 'plot', label: 'Plot', icon: '📐' },
    { value: 'flat', label: 'Flat', icon: '🏢' },
    { value: 'house', label: 'House', icon: '🏠' },
    { value: 'villa', label: 'Villa', icon: '🏛️' },
    { value: 'commercial', label: 'Commercial', icon: '🏬' },
    { value: 'farmland', label: 'Farm Land', icon: '🌾' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.post('/api/requirements', {
        ...formData,
        min_budget: parseFloat(formData.min_budget) || 0,
        max_budget: parseFloat(formData.max_budget) || 0,
        min_area_sqft: formData.min_area_sqft ? parseFloat(formData.min_area_sqft) : null,
        max_area_sqft: formData.max_area_sqft ? parseFloat(formData.max_area_sqft) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null
      })
      setSubmitted(true)
      toast.success('Your requirement has been submitted! We will contact you soon.')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit requirement')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl text-white shadow-xl"
          >
            <FiCheck className="w-12 h-12" />
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Requirement Submitted!
          </h2>
          <p className="text-gray-500 mb-8">
            Thank you for sharing your property requirements. Our expert team will analyze your needs and get back to you with the best matching properties within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              <FiSearch className="w-5 h-5" />
              <span>Browse Properties</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  property_type: '', min_budget: '', max_budget: '', preferred_location: '',
                  city: '', state: '', min_area_sqft: '', max_area_sqft: '', bedrooms: '',
                  bathrooms: '', additional_requirements: '', full_name: '', email: '', phone: ''
                })
              }}
              className="px-6 py-3 border-2 border-emerald-500 text-emerald-600 font-bold rounded-xl"
            >
              Submit Another
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
              Find Your Dream Property
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Buy Property
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Tell us what you're looking for and we'll find the perfect property for you
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Property Requirement Form
                </h2>
                <p className="text-gray-500">
                  Fill in your requirements and our team will find matching properties for you
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Property Type Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                    Property Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {propertyTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, property_type: type.value })}
                        className={`p-4 border-2 rounded-xl transition-all flex flex-col items-center space-y-2 ${
                          formData.property_type === type.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <span className={`text-sm font-semibold ${
                          formData.property_type === type.value ? 'text-emerald-600' : 'text-gray-600'
                        }`}>
                          {type.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Minimum Budget *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-semibold">₹</span>
                      <input
                        type="number"
                        required
                        value={formData.min_budget}
                        onChange={(e) => setFormData({ ...formData, min_budget: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        placeholder="e.g., 5000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Maximum Budget *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-semibold">₹</span>
                      <input
                        type="number"
                        required
                        value={formData.max_budget}
                        onChange={(e) => setFormData({ ...formData, max_budget: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        placeholder="e.g., 10000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Preferred Location *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <FiMapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.preferred_location}
                        onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                        className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        placeholder="Area / Locality"
                      />
                    </div>
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="State"
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Min Area (sqft)
                    </label>
                    <input
                      type="number"
                      value={formData.min_area_sqft}
                      onChange={(e) => setFormData({ ...formData, min_area_sqft: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="Min"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Max Area (sqft)
                    </label>
                    <input
                      type="number"
                      value={formData.max_area_sqft}
                      onChange={(e) => setFormData({ ...formData, max_area_sqft: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="Max"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="Any"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="Any"
                    />
                  </div>
                </div>

                {/* Additional Requirements */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Additional Requirements
                  </label>
                  <textarea
                    value={formData.additional_requirements}
                    onChange={(e) => setFormData({ ...formData, additional_requirements: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
                    rows="4"
                    placeholder="Any specific requirements like parking, garden, facing direction, nearby amenities, etc."
                  />
                </div>

                <div className="h-px bg-gray-200" />

                {/* Contact Information */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
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
                          className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
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
                          className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {loading ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Submit Requirement</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Buy
