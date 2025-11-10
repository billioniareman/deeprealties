import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiHome, FiDollarSign, FiHeart, FiEye } from 'react-icons/fi'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PropertyCard = ({ property, index = 0 }) => {
  const { t } = useTranslation()
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  return (
    <Link to={`/properties/${property.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:border-gray-700"
      >
        {/* Image Container with Overlay */}
        <div className="relative h-64 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-blue via-primary-navy to-primary-emerald animate-pulse" />
          )}
          {property.images && property.images.length > 0 ? (
            <motion.img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onLoad={() => setImageLoaded(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-blue via-primary-navy to-primary-emerald flex items-center justify-center">
              <FiHome className="w-20 h-20 text-white opacity-50" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="absolute top-4 left-4 bg-primary-emerald text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm bg-opacity-90"
          >
            {property.property_type?.charAt(0).toUpperCase() + property.property_type?.slice(1) || 'Property'}
          </motion.div>

          {/* Favorite Button */}
          <motion.button
            onClick={handleFavorite}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
          >
            <FiHeart
              className={`w-5 h-5 transition-colors ${
                isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            />
          </motion.button>

          {/* View Details Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FiEye className="w-4 h-4 text-primary-blue" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">{t('properties.viewDetails')}</span>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-blue transition-colors">
            {property.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">
            {property.description}
          </p>

          {/* Features */}
          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {property.bedrooms && (
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg"
              >
                <FiHome className="w-4 h-4 text-primary-blue" />
                <span className="font-medium">{property.bedrooms} {t('properties.beds')}</span>
              </motion.span>
            )}
            {property.bathrooms && (
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg"
              >
                <span className="text-primary-blue">🚿</span>
                <span className="font-medium">{property.bathrooms} {t('properties.baths')}</span>
              </motion.span>
            )}
            {property.area_sqft && (
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg"
              >
                <span className="text-primary-blue">📐</span>
                <span className="font-medium">{property.area_sqft.toLocaleString()} {t('properties.sqft')}</span>
              </motion.span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-primary-blue">
              <FiMapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{property.city}, {property.state}</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-1 text-primary-emerald font-bold text-xl"
            >
              <FiDollarSign className="w-6 h-6" />
              <span>{property.price?.toLocaleString() || 'N/A'}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default PropertyCard
