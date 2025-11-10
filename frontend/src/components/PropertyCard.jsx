import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiHome, FiDollarSign } from 'react-icons/fi'

const PropertyCard = ({ property }) => {
  return (
    <Link to={`/properties/${property.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-shadow hover:shadow-xl"
      >
        <div className="relative h-48 overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-blue to-primary-navy flex items-center justify-center">
              <FiHome className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          <div className="absolute top-4 right-4 bg-primary-emerald text-white px-3 py-1 rounded-full text-sm font-semibold">
            {property.property_type}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
            {property.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {property.description}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            {property.bedrooms && (
              <span className="flex items-center space-x-1">
                <FiHome className="w-4 h-4" />
                <span>{property.bedrooms} Beds</span>
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center space-x-1">
                <span>{property.bathrooms} Baths</span>
              </span>
            )}
            {property.area_sqft && (
              <span>{property.area_sqft.toLocaleString()} sqft</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-primary-blue">
              <FiMapPin className="w-4 h-4" />
              <span className="text-sm">{property.city}, {property.state}</span>
            </div>
            <div className="flex items-center space-x-1 text-primary-emerald font-bold text-lg">
              <FiDollarSign className="w-5 h-5" />
              <span>{property.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default PropertyCard

