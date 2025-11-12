import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiHome, FiBriefcase } from 'react-icons/fi'
import api from '../utils/api'
import PropertyCard from '../components/PropertyCard'

const OurProjects = () => {
  const { t } = useTranslation()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminProjects()
  }, [])

  const fetchAdminProjects = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/properties/admin-projects')
      setProperties(response.data)
    } catch (error) {
      console.error('Error fetching admin projects:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="p-3 bg-gradient-to-br from-primary-blue to-primary-emerald rounded-xl"
          >
            <FiBriefcase className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              {t('ourProjects.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
              {t('ourProjects.subtitle')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-16 w-16 border-4 border-primary-blue border-t-transparent"
          ></motion.div>
        </div>
      ) : properties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
        >
          <FiHome className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-xl font-medium">
            {t('ourProjects.noProjects')}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              {properties.length} {properties.length === 1 ? t('ourProjects.project') : t('ourProjects.projects')} {t('ourProjects.found')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default OurProjects

