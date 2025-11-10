import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiHome, FiDollarSign, FiArrowLeft, FiMail } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [enquiryMessage, setEnquiryMessage] = useState('')
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/api/properties/${id}`)
      setProperty(response.data)
    } catch (error) {
      toast.error('Property not found')
      navigate('/properties')
    } finally {
      setLoading(false)
    }
  }

  const handleEnquiry = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to send an enquiry')
      navigate('/login')
      return
    }

    try {
      await api.post('/api/enquiries', {
        property_id: id,
        message: enquiryMessage
      })
      toast.success('Enquiry sent successfully!')
      setEnquiryMessage('')
      setShowEnquiryForm(false)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send enquiry')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  if (!property) {
    return null
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80']

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-blue mb-6 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Carousel */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-96 rounded-lg overflow-hidden shadow-xl"
          >
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                >
                  →
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 rounded-lg overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-primary-blue' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sticky top-24"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {property.title}
              </h1>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                <FiMapPin className="w-5 h-5" />
                <span>{property.location}, {property.city}, {property.state}</span>
              </div>
              <div className="text-3xl font-bold text-primary-emerald flex items-center space-x-1">
                <FiDollarSign className="w-8 h-8" />
                <span>{property.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                {property.bedrooms && (
                  <div className="flex items-center space-x-2">
                    <FiHome className="w-5 h-5 text-primary-blue" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                      <div className="font-semibold text-gray-800 dark:text-white">{property.bedrooms}</div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center space-x-2">
                    <span className="text-primary-blue">🚿</span>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                      <div className="font-semibold text-gray-800 dark:text-white">{property.bathrooms}</div>
                    </div>
                  </div>
                )}
                {property.area_sqft && (
                  <div className="flex items-center space-x-2">
                    <span className="text-primary-blue">📐</span>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Area</div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {property.area_sqft.toLocaleString()} sqft
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-primary-blue">🏠</span>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Type</div>
                    <div className="font-semibold text-gray-800 dark:text-white capitalize">
                      {property.property_type}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEnquiryForm(!showEnquiryForm)}
              className="w-full bg-primary-blue text-white py-3 px-4 rounded-lg hover:bg-primary-navy transition-colors flex items-center justify-center space-x-2 mb-4"
            >
              <FiMail className="w-5 h-5" />
              <span>Send Enquiry</span>
            </button>

            {showEnquiryForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleEnquiry}
                className="space-y-4"
              >
                <textarea
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  placeholder="Enter your message..."
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full bg-primary-emerald text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Submit Enquiry
                </button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Description</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
          {property.description}
        </p>
      </motion.div>

      {/* Map Placeholder */}
      {property.latitude && property.longitude && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Location</h2>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">
              Map integration available (Google Maps API key required)
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PropertyDetails

