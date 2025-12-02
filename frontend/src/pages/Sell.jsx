import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiDollarSign, FiImage, FiSend, FiCheck, FiGlobe, FiUser, FiMail, FiPhone } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Sell = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    listing_type: 'sale',
    price: '',
    locality: '',
    city: '',
    state: '',
    area_sqft: '',
    bedrooms: '',
    bathrooms: '',
    floors: '',
    parking: false,
    facing: '',
    plot_number: '',
    is_farmland: false,
    google_earth_link: '',
    amenities: [],
    images: [],
    // Contact details
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
    { value: 'apartment', label: 'Apartment', icon: '🏬' },
    { value: 'commercial', label: 'Commercial', icon: '🏪' },
    { value: 'farmland', label: 'Farm Land', icon: '🌾' }
  ]

  const amenitiesList = [
    'Swimming Pool', 'Gym', 'Garden', 'Security', 'Parking', 'Power Backup',
    'Lift', 'Club House', 'Children Play Area', 'Sports Facility', 'Water Supply',
    'CCTV', 'Intercom', 'Fire Safety', 'Rainwater Harvesting'
  ]

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const urls = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls].slice(0, 10)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.post('/api/properties', {
        ...formData,
        price: parseFloat(formData.price),
        area_sqft: parseFloat(formData.area_sqft),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        floors: formData.floors ? parseInt(formData.floors) : null
      })
      setSubmitted(true)
      toast.success('Property submitted successfully! It will be visible after admin approval.')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit property')
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
            Property Submitted!
          </h2>
          <p className="text-gray-500 mb-8">
            Your property has been submitted for review. Our team will verify the details and approve it within 24-48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg"
            >
              View Properties
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  title: '', description: '', property_type: '', listing_type: 'sale',
                  price: '', locality: '', city: '', state: '', area_sqft: '',
                  bedrooms: '', bathrooms: '', floors: '', parking: false, facing: '',
                  plot_number: '', is_farmland: false, google_earth_link: '', amenities: [], images: []
                })
              }}
              className="px-6 py-3 border-2 border-emerald-500 text-emerald-600 font-bold rounded-xl"
            >
              List Another Property
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
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
              List Your Property
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sell Property
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Reach thousands of potential buyers through our premium platform
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
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12"
            >
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
                        onClick={() => setFormData({ 
                          ...formData, 
                          property_type: type.value,
                          is_farmland: type.value === 'farmland'
                        })}
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

                {/* Basic Info */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="e.g., Luxury 3BHK Villa in Prime Location"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
                    rows="5"
                    placeholder="Describe your property in detail..."
                  />
                </div>

                {/* Price and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Price (₹) *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <FiDollarSign className="w-4 h-4 text-emerald-600" />
                      </div>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        placeholder="e.g., 5000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Area (sqft) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.area_sqft}
                      onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="e.g., 2500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Locality *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <FiMapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
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
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="State"
                    />
                  </div>
                </div>

                {/* Property Details */}
                {['house', 'flat', 'villa', 'apartment'].includes(formData.property_type) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        placeholder="3"
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
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Floors
                      </label>
                      <input
                        type="number"
                        value={formData.floors}
                        onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Facing
                      </label>
                      <select
                        value={formData.facing}
                        onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      >
                        <option value="">Select</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Farmland Google Earth Link */}
                {formData.is_farmland && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl"
                  >
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider flex items-center space-x-2">
                      <FiGlobe className="w-4 h-4 text-emerald-600" />
                      <span>Google Earth Link (Required for Farmland)</span>
                    </label>
                    <input
                      type="url"
                      required={formData.is_farmland}
                      value={formData.google_earth_link}
                      onChange={(e) => setFormData({ ...formData, google_earth_link: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="https://earth.google.com/..."
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Paste the Google Earth link to show the exact location of your farmland
                    </p>
                  </motion.div>
                )}

                {/* Amenities */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {amenitiesList.map((amenity) => (
                      <motion.button
                        key={amenity}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`px-4 py-2 text-sm border-2 rounded-full transition-all ${
                          formData.amenities.includes(amenity)
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                        }`}
                      >
                        {amenity}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Property Images (Max 10)
                  </label>
                  <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors bg-emerald-50/50">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <FiImage className="w-12 h-12 mx-auto text-emerald-400 mb-4" />
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
                    </label>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Parking */}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                    className="w-5 h-5 accent-emerald-500 rounded"
                  />
                  <span className="text-gray-700 group-hover:text-emerald-600 transition-colors font-medium">
                    Parking Available
                  </span>
                </label>

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
                      <span>Submit Property</span>
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

export default Sell
