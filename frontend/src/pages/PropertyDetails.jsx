import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiMapPin, FiHome, FiDollarSign, FiArrowLeft, FiMail, FiChevronLeft, FiChevronRight, FiHeart } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const PropertyDetails = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [enquiryMessage, setEnquiryMessage] = useState('')
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-16 w-16 border-4 border-primary-blue border-t-transparent"
        ></motion.div>
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
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-blue mb-6 transition-colors font-medium"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>{t('propertyDetails.back')}</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Carousel */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group"
          >
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
                >
                  <FiChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
                >
                  <FiChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
                </motion.button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Favorite Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
            >
              <FiHeart
                className={`w-6 h-6 transition-colors ${
                  isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300'
                }`}
              />
            </motion.button>
          </motion.div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.slice(0, 4).map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? 'border-primary-blue ring-2 ring-primary-blue' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100 dark:border-gray-700"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {property.title}
              </h1>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                <FiMapPin className="w-5 h-5 text-primary-blue" />
                <span>{property.location || property.city}, {property.city}, {property.state}</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-bold text-primary-emerald flex items-center space-x-1"
              >
                <FiDollarSign className="w-8 h-8" />
                <span>{property.price?.toLocaleString() || 'N/A'}</span>
              </motion.div>
            </div>

            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                {property.bedrooms && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                  >
                    <FiHome className="w-5 h-5 text-primary-blue" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('propertyDetails.bedrooms')}</div>
                      <div className="font-semibold text-gray-800 dark:text-white">{property.bedrooms}</div>
                    </div>
                  </motion.div>
                )}
                {property.bathrooms && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                  >
                    <span className="text-primary-blue text-xl">🚿</span>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('propertyDetails.bathrooms')}</div>
                      <div className="font-semibold text-gray-800 dark:text-white">{property.bathrooms}</div>
                    </div>
                  </motion.div>
                )}
                {property.area_sqft && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                  >
                    <span className="text-primary-blue text-xl">📐</span>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('propertyDetails.area')}</div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {property.area_sqft.toLocaleString()} sqft
                      </div>
                    </div>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                >
                  <span className="text-primary-blue text-xl">🏠</span>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('propertyDetails.type')}</div>
                    <div className="font-semibold text-gray-800 dark:text-white capitalize">
                      {property.property_type}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEnquiryForm(!showEnquiryForm)}
              className="w-full bg-gradient-to-r from-primary-blue to-primary-emerald text-white py-3 px-4 rounded-lg hover:from-primary-navy hover:to-primary-blue transition-all flex items-center justify-center space-x-2 mb-4 shadow-lg font-semibold"
            >
              <FiMail className="w-5 h-5" />
              <span>{t('propertyDetails.sendEnquiry')}</span>
            </motion.button>

            {showEnquiryForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleEnquiry}
                className="space-y-4"
              >
                <textarea
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  placeholder={t('propertyDetails.enterMessage')}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary-emerald text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-lg"
                >
                  {t('propertyDetails.submitEnquiry')}
                </motion.button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {t('propertyDetails.description')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line text-lg">
          {property.description}
        </p>
      </motion.div>

      {/* Map Placeholder */}
      {property.latitude && property.longitude && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('propertyDetails.location')}
          </h2>
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
