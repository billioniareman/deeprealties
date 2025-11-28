import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiMapPin, FiHome, FiArrowLeft, FiMail, FiChevronLeft, FiChevronRight, FiHeart, FiMaximize2, FiX, FiCheck, FiSend } from 'react-icons/fi'
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
  const [showLightbox, setShowLightbox] = useState(false)

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

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`
    }
    return `₹${price.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ivory-50 dark:bg-onyx-950">
        <div className="loader-luxury" />
      </div>
    )
  }

  if (!property) {
    return null
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80']

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-onyx-950">
      {/* ========== HEADER ========== */}
      <div className="bg-onyx-950 py-8">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-3 text-ivory-400 hover:text-gold-400 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t('propertyDetails.back')}</span>
          </motion.button>
        </div>
      </div>

      {/* ========== IMAGE GALLERY ========== */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-[60vh] lg:h-[70vh] overflow-hidden group"
        >
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-950 via-transparent to-onyx-950/30" />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-onyx-950/80 backdrop-blur-sm border border-gold-500/30 text-ivory-100 hover:border-gold-500 hover:text-gold-400 transition-all opacity-0 group-hover:opacity-100"
              >
                <FiChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-onyx-950/80 backdrop-blur-sm border border-gold-500/30 text-ivory-100 hover:border-gold-500 hover:text-gold-400 transition-all opacity-0 group-hover:opacity-100"
              >
                <FiChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}

          {/* Top Actions */}
          <div className="absolute top-6 right-6 flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorited(!isFavorited)}
              className="w-12 h-12 flex items-center justify-center bg-onyx-950/80 backdrop-blur-sm border border-gold-500/30 hover:border-gold-500 transition-all"
            >
              <FiHeart
                className={`w-5 h-5 transition-colors ${
                  isFavorited ? 'text-red-500 fill-red-500' : 'text-ivory-200'
                }`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowLightbox(true)}
              className="w-12 h-12 flex items-center justify-center bg-onyx-950/80 backdrop-blur-sm border border-gold-500/30 text-ivory-200 hover:border-gold-500 hover:text-gold-400 transition-all"
            >
              <FiMaximize2 className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-6 px-4 py-2 bg-onyx-950/80 backdrop-blur-sm border border-gold-500/30">
            <span className="text-ivory-200 text-sm">
              <span className="text-gold-400 font-semibold">{currentImageIndex + 1}</span>
              <span className="mx-2">/</span>
              <span>{images.length}</span>
            </span>
          </div>

          {/* Thumbnail Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1 transition-all ${
                    index === currentImageIndex 
                      ? 'w-8 bg-gold-400' 
                      : 'w-4 bg-ivory-400/50 hover:bg-ivory-400'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* ========== CONTENT ========== */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-12"
            >
              {/* Title & Location */}
              <div>
                <span className="text-gold-500 font-medium tracking-luxury text-sm uppercase mb-3 block">
                  {property.property_type?.charAt(0).toUpperCase() + property.property_type?.slice(1) || 'Property'}
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-semibold text-onyx-900 dark:text-ivory-50 mb-4">
                  {property.title}
                </h1>
                <div className="flex items-center space-x-2 text-onyx-500 dark:text-ivory-500">
                  <FiMapPin className="w-5 h-5 text-gold-500" />
                  <span className="font-light">{property.location || property.city}, {property.city}, {property.state}</span>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms && (
                  <div className="card-luxury p-5">
                    <div className="w-10 h-10 flex items-center justify-center bg-gold-500/10 text-gold-500 mb-3">
                      <FiHome className="w-5 h-5" />
                    </div>
                    <div className="text-sm text-onyx-500 dark:text-ivory-500 uppercase tracking-wide mb-1">
                      {t('propertyDetails.bedrooms')}
                    </div>
                    <div className="font-display text-2xl font-semibold text-onyx-900 dark:text-ivory-50">
                      {property.bedrooms}
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="card-luxury p-5">
                    <div className="w-10 h-10 flex items-center justify-center bg-gold-500/10 text-gold-500 mb-3">
                      <span className="text-lg">🚿</span>
                    </div>
                    <div className="text-sm text-onyx-500 dark:text-ivory-500 uppercase tracking-wide mb-1">
                      {t('propertyDetails.bathrooms')}
                    </div>
                    <div className="font-display text-2xl font-semibold text-onyx-900 dark:text-ivory-50">
                      {property.bathrooms}
                    </div>
                  </div>
                )}
                {property.area_sqft && (
                  <div className="card-luxury p-5">
                    <div className="w-10 h-10 flex items-center justify-center bg-gold-500/10 text-gold-500 mb-3">
                      <span className="text-lg">📐</span>
                    </div>
                    <div className="text-sm text-onyx-500 dark:text-ivory-500 uppercase tracking-wide mb-1">
                      {t('propertyDetails.area')}
                    </div>
                    <div className="font-display text-2xl font-semibold text-onyx-900 dark:text-ivory-50">
                      {property.area_sqft.toLocaleString()}
                      <span className="text-sm font-normal text-onyx-500 dark:text-ivory-500 ml-1">sqft</span>
                    </div>
                  </div>
                )}
                <div className="card-luxury p-5">
                  <div className="w-10 h-10 flex items-center justify-center bg-gold-500/10 text-gold-500 mb-3">
                    <span className="text-lg">🏠</span>
                  </div>
                  <div className="text-sm text-onyx-500 dark:text-ivory-500 uppercase tracking-wide mb-1">
                    {t('propertyDetails.type')}
                  </div>
                  <div className="font-display text-xl font-semibold text-onyx-900 dark:text-ivory-50 capitalize">
                    {property.property_type}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card-luxury p-8">
                <span className="corner-accent corner-accent-tl" />
                <span className="corner-accent corner-accent-br" />
                
                <h2 className="font-display text-2xl font-semibold text-onyx-900 dark:text-ivory-50 mb-6">
                  {t('propertyDetails.description')}
                </h2>
                <div className="divider-gold w-16 mb-6" />
                <p className="text-onyx-600 dark:text-ivory-400 leading-relaxed whitespace-pre-line font-light text-lg">
                  {property.description}
                </p>
              </div>

              {/* Map Placeholder */}
              {property.latitude && property.longitude && (
                <div className="card-luxury p-8">
                  <h2 className="font-display text-2xl font-semibold text-onyx-900 dark:text-ivory-50 mb-6">
                    {t('propertyDetails.location')}
                  </h2>
                  <div className="divider-gold w-16 mb-6" />
                  <div className="h-64 bg-onyx-100 dark:bg-onyx-800 flex items-center justify-center">
                    <div className="text-center">
                      <FiMapPin className="w-12 h-12 text-gold-500/30 mx-auto mb-3" />
                      <p className="text-onyx-500 dark:text-ivory-500 font-light">
                        Map integration available
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-28">
                <div className="card-luxury p-8">
                  <span className="corner-accent corner-accent-tl" />
                  <span className="corner-accent corner-accent-tr" />
                  <span className="corner-accent corner-accent-bl" />
                  <span className="corner-accent corner-accent-br" />
                  
                  {/* Price */}
                  <div className="text-center mb-8">
                    <span className="text-sm text-onyx-500 dark:text-ivory-500 uppercase tracking-wide block mb-2">
                      Price
                    </span>
                    <div className="font-display text-4xl font-bold text-gradient-gold">
                      {formatPrice(property.price)}
                    </div>
                  </div>

                  <div className="divider-gold mb-8" />

                  {/* Enquiry Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                    className="btn-luxury w-full flex items-center justify-center space-x-2 mb-4"
                  >
                    <FiMail className="w-5 h-5" />
                    <span>{t('propertyDetails.sendEnquiry')}</span>
                  </motion.button>

                  {/* Enquiry Form */}
                  <AnimatePresence>
                    {showEnquiryForm && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleEnquiry}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-4">
                          <textarea
                            value={enquiryMessage}
                            onChange={(e) => setEnquiryMessage(e.target.value)}
                            placeholder={t('propertyDetails.enterMessage')}
                            required
                            rows="4"
                            className="input-luxury resize-none"
                          />
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center space-x-2 py-3 bg-gold-500/10 text-gold-500 border border-gold-500/30 hover:bg-gold-500 hover:text-onyx-900 transition-all font-medium"
                          >
                            <FiSend className="w-4 h-4" />
                            <span>{t('propertyDetails.submitEnquiry')}</span>
                          </motion.button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Features List */}
                  <div className="mt-8 pt-8 border-t border-gold-500/10">
                    <h3 className="font-medium text-onyx-900 dark:text-ivory-50 mb-4 uppercase tracking-wide text-sm">
                      Highlights
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3 text-onyx-600 dark:text-ivory-400">
                        <FiCheck className="w-4 h-4 text-gold-500" />
                        <span className="font-light">Premium Location</span>
                      </li>
                      <li className="flex items-center space-x-3 text-onyx-600 dark:text-ivory-400">
                        <FiCheck className="w-4 h-4 text-gold-500" />
                        <span className="font-light">Modern Architecture</span>
                      </li>
                      <li className="flex items-center space-x-3 text-onyx-600 dark:text-ivory-400">
                        <FiCheck className="w-4 h-4 text-gold-500" />
                        <span className="font-light">Ready to Move</span>
                      </li>
                      <li className="flex items-center space-x-3 text-onyx-600 dark:text-ivory-400">
                        <FiCheck className="w-4 h-4 text-gold-500" />
                        <span className="font-light">Verified Property</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== LIGHTBOX ========== */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-onyx-950/95 flex items-center justify-center p-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowLightbox(false)}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-ivory-100/10 text-ivory-100 hover:bg-gold-500 hover:text-onyx-900 transition-all"
            >
              <FiX className="w-6 h-6" />
            </motion.button>

            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={property.title}
              className="max-w-full max-h-[80vh] object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            />

            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-6 w-14 h-14 flex items-center justify-center bg-ivory-100/10 text-ivory-100 hover:bg-gold-500 hover:text-onyx-900 transition-all"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-6 w-14 h-14 flex items-center justify-center bg-ivory-100/10 text-ivory-100 hover:bg-gold-500 hover:text-onyx-900 transition-all"
                >
                  <FiChevronRight className="w-6 h-6" />
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PropertyDetails
