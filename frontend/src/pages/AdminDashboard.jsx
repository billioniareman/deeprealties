import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiHome, FiMail, FiTrendingUp, FiMapPin, FiEdit, FiTrash2, FiCheck, FiX, FiClock, FiEye } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [users, setUsers] = useState([])
  const [properties, setProperties] = useState([])
  const [pendingProperties, setPendingProperties] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [dashboardRes, usersRes, propertiesRes, pendingRes, enquiriesRes] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/users'),
        api.get('/api/admin/properties'),
        api.get('/api/properties/pending'),
        api.get('/api/admin/enquiries'),
      ])
      setDashboardData(dashboardRes.data)
      setUsers(usersRes.data)
      setProperties(propertiesRes.data)
      setPendingProperties(pendingRes.data || [])
      setEnquiries(enquiriesRes.data)
    } catch (error) {
      console.error('Dashboard error:', error)
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserActive = async (userId) => {
    try {
      await api.put(`/api/admin/users/${userId}/toggle-active`)
      toast.success('User status updated')
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const deleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return

    try {
      await api.delete(`/api/properties/${propertyId}`)
      toast.success('Property deleted successfully')
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to delete property')
    }
  }

  const approveProperty = async (propertyId) => {
    try {
      await api.put(`/api/properties/${propertyId}/approve`)
      toast.success('Property approved successfully!')
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to approve property')
    }
  }

  const rejectProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to reject this property?')) return
    try {
      await api.put(`/api/properties/${propertyId}/reject`)
      toast.success('Property rejected')
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to reject property')
    }
  }

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`
    return `₹${price?.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const stats = dashboardData.stats || {}
  const topCities = dashboardData.top_cities || []
  const recentProperties = dashboardData.recent_properties || []
  const recentEnquiries = dashboardData.recent_enquiries || []

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.full_name}! Manage the platform here.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-blue bg-opacity-10 p-3 rounded-lg">
              <FiUsers className="w-6 h-6 text-primary-blue" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.total_users || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Users</div>
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
              <FiHome className="w-6 h-6 text-primary-emerald" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.total_properties || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Properties</div>
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
                {stats.total_enquiries || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Enquiries</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-red-500 bg-opacity-10 p-3 rounded-lg">
              <FiMail className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.unread_enquiries || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Unread Enquiries</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'pending'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-amber-600'
            }`}
          >
            <FiClock className="w-4 h-4" />
            <span>Pending Approval</span>
            {pendingProperties.length > 0 && (
              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingProperties.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-emerald-600 border-b-2 border-emerald-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-emerald-600 border-b-2 border-emerald-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'properties'
                ? 'text-emerald-600 border-b-2 border-emerald-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'
            }`}
          >
            Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'enquiries'
                ? 'text-emerald-600 border-b-2 border-emerald-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'
            }`}
          >
            Enquiries ({enquiries.length})
          </button>
        </div>
      </div>

      {/* Pending Properties Tab */}
      {activeTab === 'pending' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {pendingProperties.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">All Caught Up!</h3>
              <p className="text-gray-500">No properties pending approval</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-200 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="w-full md:w-64 h-48 md:h-auto bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      {property.images?.[0] ? (
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <FiHome className="w-12 h-12 text-emerald-400" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-2">
                            PENDING APPROVAL
                          </span>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            {property.title}
                          </h3>
                        </div>
                        <span className="text-2xl font-bold text-emerald-600">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {property.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {property.locality}, {property.city}
                        </span>
                        <span className="capitalize">{property.property_type}</span>
                        <span>{property.area_sqft} sqft</span>
                      </div>

                      {/* Contact Info */}
                      {(property.full_name || property.email || property.phone) && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-4">
                          <p className="text-xs text-gray-500 mb-1">Submitted by:</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            {property.full_name && <span className="font-semibold text-gray-800 dark:text-white">{property.full_name}</span>}
                            {property.email && <span className="text-gray-600">{property.email}</span>}
                            {property.phone && <span className="text-gray-600">{property.phone}</span>}
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => approveProperty(property.id)}
                          className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => rejectProperty(property.id)}
                          className="flex items-center space-x-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                        <Link
                          to={`/properties/${property.id}`}
                          className="flex items-center space-x-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Cities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
              <FiMapPin className="w-6 h-6 text-primary-blue" />
              <span>Top Cities</span>
            </h2>
            {topCities.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No data available</p>
            ) : (
              <div className="space-y-4">
                {topCities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-800 dark:text-white font-medium">
                      {city.city || 'Unknown'}
                    </span>
                    <span className="text-primary-blue font-bold">{city.count} properties</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Properties */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
              <FiHome className="w-6 h-6 text-primary-emerald" />
              <span>Recent Properties</span>
            </h2>
            {recentProperties.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No recent properties</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                  >
                    <div className="font-medium text-gray-800 dark:text-white mb-1">
                      {property.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {property.city}, {property.state} • ${property.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Enquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
              <FiMail className="w-6 h-6 text-yellow-500" />
              <span>Recent Enquiries</span>
            </h2>
            {recentEnquiries.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No recent enquiries</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Property ID: {enquiry.property_id} •{' '}
                          {new Date(enquiry.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-gray-800 dark:text-white">{enquiry.message}</div>
                      </div>
                      {!enquiry.is_read && (
                        <span className="bg-primary-blue text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-blue bg-opacity-10 text-primary-blue">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleUserActive(user.id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                          user.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {user.is_active ? (
                          <>
                            <FiX className="w-4 h-4" />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <FiCheck className="w-4 h-4" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {properties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary-blue to-primary-navy flex items-center justify-center">
                  <FiHome className="w-16 h-16 text-white opacity-50" />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {property.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {property.city}, {property.state}
                  </span>
                  <span className="text-lg font-bold text-primary-emerald">
                    ${property.price.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => deleteProperty(property.id)}
                  className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Enquiries Tab */}
      {activeTab === 'enquiries' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
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
                    Property ID: {enquiry.property_id} • Buyer ID: {enquiry.buyer_id}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default AdminDashboard

