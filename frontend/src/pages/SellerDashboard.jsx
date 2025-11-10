import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiMail, FiHome, FiDollarSign } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import PropertyCard from '../components/PropertyCard'

const SellerDashboard = () => {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    state: '',
    price: '',
    property_type: 'house',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    latitude: '',
    longitude: '',
    images: [],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [propertiesRes, enquiriesRes] = await Promise.all([
        api.get('/api/properties/seller/my-properties'),
        api.get('/api/enquiries/seller/enquiries'),
      ])
      setProperties(propertiesRes.data)
      setEnquiries(enquiriesRes.data)
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      }

      if (editingProperty) {
        await api.put(`/api/properties/${editingProperty.id}`, submitData)
        toast.success('Property updated successfully!')
      } else {
        await api.post('/api/properties', submitData)
        toast.success('Property added successfully!')
      }
      setShowAddForm(false)
      setEditingProperty(null)
      resetForm()
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save property')
    }
  }

  const handleEdit = (property) => {
    setEditingProperty(property)
    setFormData({
      title: property.title || '',
      description: property.description || '',
      location: property.location || '',
      city: property.city || '',
      state: property.state || '',
      price: property.price || '',
      property_type: property.property_type || 'house',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      area_sqft: property.area_sqft || '',
      latitude: property.latitude || '',
      longitude: property.longitude || '',
      images: property.images || [],
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return

    try {
      await api.delete(`/api/properties/${id}`)
      toast.success('Property deleted successfully!')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete property')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      city: '',
      state: '',
      price: '',
      property_type: 'house',
      bedrooms: '',
      bathrooms: '',
      area_sqft: '',
      latitude: '',
      longitude: '',
      images: [],
    })
  }

  const markEnquiryRead = async (id) => {
    try {
      await api.put(`/api/enquiries/${id}/read`)
      fetchData()
    } catch (error) {
      toast.error('Failed to mark enquiry as read')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Seller Dashboard
          </h1>
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingProperty(null)
              resetForm()
            }}
            className="flex items-center space-x-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-navy transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Property</span>
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.full_name}! Manage your properties and enquiries here.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-blue bg-opacity-10 p-3 rounded-lg">
              <FiHome className="w-6 h-6 text-primary-blue" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {properties.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Properties</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-emerald bg-opacity-10 p-3 rounded-lg">
              <FiMail className="w-6 h-6 text-primary-emerald" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {enquiries.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Enquiries</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500 bg-opacity-10 p-3 rounded-lg">
              <FiMail className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {enquiries.filter(e => !e.is_read).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Unread Enquiries</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Property Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {editingProperty ? 'Edit Property' : 'Add New Property'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type *
                </label>
                <select
                  required
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Area (sqft)
                </label>
                <input
                  type="number"
                  value={formData.area_sqft}
                  onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-primary-navy transition-colors"
              >
                {editingProperty ? 'Update Property' : 'Add Property'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingProperty(null)
                  resetForm()
                }}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Properties List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Properties</h2>
        {properties.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <FiHome className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No properties listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <PropertyCard property={property} />
                <div className="p-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(property)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-navy transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Enquiries List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Enquiries</h2>
        {enquiries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <FiMail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No enquiries yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry) => (
              <motion.div
                key={enquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${
                  !enquiry.is_read ? 'border-l-4 border-primary-blue' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiMail className="w-5 h-5 text-primary-blue" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </span>
                      {!enquiry.is_read && (
                        <span className="bg-primary-blue text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 dark:text-white mb-2">{enquiry.message}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Property ID: {enquiry.property_id}
                    </p>
                  </div>
                  {!enquiry.is_read && (
                    <button
                      onClick={() => markEnquiryRead(enquiry.id)}
                      className="bg-primary-emerald text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerDashboard

