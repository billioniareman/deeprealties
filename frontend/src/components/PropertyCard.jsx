import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiHome, FiHeart, FiArrowUpRight, FiMaximize } from 'react-icons/fi'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Elegant Placeholder for properties
const PropertyPlaceholder = ({ type }) => {
  const getIcon = () => {
    switch (type?.toLowerCase()) {
      case 'house':
        return '🏠'
      case 'apartment':
        return '🏢'
      case 'villa':
        return '🏡'
      case 'plot':
        return '📍'
      case 'commercial':
        return '🏪'
      case 'farmland':
      case 'agricultural':
        return '🌾'
      default:
        return '🏠'
    }
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Soft gradient overlay */}
      <motion.div
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(16, 185, 129, 0.12) 0%, transparent 60%)',
        }}
      />
      
      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 1) 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />
      
      {/* Property icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-5xl"
        >
          {getIcon()}
        </motion.div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </div>
  )
}

const PropertyCard = ({ property, index = 0 }) => {
  const { t } = useTranslation()
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  const formatPrice = (price) => {
    if (!price) return 'Price on Request'
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`
    return `₹${price.toLocaleString()}`
  }

  const getTypeLabel = (type) => {
    const labels = {
      house: 'House',
      apartment: 'Apartment',
      villa: 'Villa',
      plot: 'Plot',
      commercial: 'Commercial',
      farmland: 'Farm Land',
      agricultural: 'Agricultural',
    }
    return labels[type?.toLowerCase()] || 'Property'
  }

  return (
    <Link to={`/properties/${property.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative"
      >
        <motion.div 
          whileHover={{ y: -8 }}
          className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
        >
          
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            {!imageLoaded && property.images?.length > 0 && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            
            {property.images && property.images.length > 0 ? (
              <motion.img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
                style={{ 
                  scale: isHovered ? 1.08 : 1,
                  transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
                onLoad={() => setImageLoaded(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
              />
            ) : (
              <PropertyPlaceholder type={property.property_type} />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Type badge */}
            <div className="absolute top-3 left-3 z-10">
              <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md">
                <span className="text-emerald-600 text-[10px] tracking-wider uppercase font-bold">
                  {getTypeLabel(property.property_type)}
                </span>
              </div>
            </div>

            {/* Favorite */}
            <motion.button
              onClick={handleFavorite}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <FiHeart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
            </motion.button>

            {/* Price */}
            <div className="absolute bottom-3 left-3 z-10">
              <div className="text-xl font-bold text-white drop-shadow-lg">
                {formatPrice(property.price)}
              </div>
            </div>
            
            {/* View button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              className="absolute bottom-3 right-3 z-10"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-lg">
                View
                <FiArrowUpRight className="w-3 h-3" />
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-gray-800 text-base font-bold mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {property.title}
            </h3>
            
            <div className="flex items-center gap-1.5 text-gray-500 mb-3">
              <FiMapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-sm truncate">{property.city}, {property.state}</span>
            </div>

            <div className="h-px bg-gray-100 mb-3" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                {property.bedrooms && (
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">{property.bedrooms}</span>
                    <span className="text-gray-400 text-xs">Beds</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">{property.bathrooms}</span>
                    <span className="text-gray-400 text-xs">Baths</span>
                  </div>
                )}
              </div>
              
              {property.area_sqft && (
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <FiMaximize className="w-3 h-3 text-emerald-500" />
                  <span className="font-medium">{property.area_sqft.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 origin-left"
          />
        </motion.div>
      </motion.div>
    </Link>
  )
}

export default PropertyCard
