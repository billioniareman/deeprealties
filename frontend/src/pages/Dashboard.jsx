import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  FiUser, FiMail, FiPhone, FiCalendar, FiHome, FiHeart, 
  FiEye, FiMessageSquare, FiMapPin, FiEdit, FiTrash2,
  FiDollarSign, FiClock, FiCheck, FiX, FiExternalLink
} from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  const [myProperties, setMyProperties] = useState([])
  const [receivedEnquiries, setReceivedEnquiries] = useState([])
  const [myEnquiries, setMyEnquiries] = useState([])
  const [interestedProperties, setInterestedProperties] = useState([])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchDashboardData()
  }, [isAuthenticated])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch user info
      const userRes = await api.get('/api/users/me')
      setUserInfo(userRes.data)

      // Fetch user's listed properties
      try {
        const propsRes = await api.get('/api/properties/my-properties')
        setMyProperties(propsRes.data || [])
      } catch (e) {
        console.log('No properties found')
        setMyProperties([])
      }

      // Fetch received enquiries (people interested in user's properties)
      try {
        const receivedRes = await api.get('/api/enquiries/received-enquiries')
        setReceivedEnquiries(receivedRes.data || [])
      } catch (e) {
        setReceivedEnquiries([])
      }

      // Fetch user's enquiries (properties user is interested in)
      try {
        const myEnqRes = await api.get('/api/enquiries/my-enquiries')
        setMyEnquiries(myEnqRes.data || [])
        
        // Fetch property details for each enquiry
        const propertyPromises = myEnqRes.data.map(async (enq) => {
          try {
            const propRes = await api.get(`/api/properties/${enq.property_id}`)
            return { ...propRes.data, enquiry: enq }
          } catch (e) {
            return null
          }
        })
        const props = await Promise.all(propertyPromises)
        setInterestedProperties(props.filter(p => p !== null))
      } catch (e) {
        setMyEnquiries([])
        setInterestedProperties([])
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`
    return `₹${price.toLocaleString()}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      rejected: 'bg-red-100 text-red-700'
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  const getEnquiryCount = (propertyId) => {
    return receivedEnquiries.filter(e => e.property_id === propertyId).length
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <FiUser className="w-5 h-5" /> },
    { id: 'properties', label: 'My Properties', icon: <FiHome className="w-5 h-5" />, count: myProperties.length },
    { id: 'interested', label: 'Interested Properties', icon: <FiHeart className="w-5 h-5" />, count: interestedProperties.length },
    { id: 'enquiries', label: 'Received Enquiries', icon: <FiMessageSquare className="w-5 h-5" />, count: receivedEnquiries.length },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, <span className="text-emerald-600">{userInfo?.full_name?.split(' ')[0] || 'User'}</span>!
          </h1>
          <p className="text-gray-500 mt-2">Manage your properties and track your interests</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FiHome className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{myProperties.length}</p>
                <p className="text-sm text-gray-500">Listed Properties</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiHeart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{interestedProperties.length}</p>
                <p className="text-sm text-gray-500">Interested In</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FiMessageSquare className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{receivedEnquiries.length}</p>
                <p className="text-sm text-gray-500">Enquiries Received</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiEye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {myProperties.reduce((acc, p) => acc + (p.views || 0), 0)}
                </p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[150px] flex items-center justify-center space-x-2 py-4 px-6 font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-emerald-600'
                    : 'text-gray-500 hover:text-emerald-600'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {userInfo?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <p className="mt-4 text-lg font-semibold text-gray-800">{userInfo?.full_name}</p>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full mt-2 capitalize">
                    {userInfo?.role || 'User'}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <FiMail className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-gray-800 font-medium">{userInfo?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <FiPhone className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-gray-800 font-medium">{userInfo?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <FiCalendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Member Since</p>
                          <p className="text-gray-800 font-medium">{formatDate(userInfo?.created_at)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <FiCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="text-emerald-600 font-medium">Active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* My Properties Tab */}
          {activeTab === 'properties' && (
            <motion.div
              key="properties"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {myProperties.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiHome className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Properties Listed</h3>
                  <p className="text-gray-500 mb-6">You haven't listed any properties yet</p>
                  <button
                    onClick={() => navigate('/sell')}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg"
                  >
                    List Your Property
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Property Image */}
                        <div className="w-full md:w-48 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center overflow-hidden">
                          {property.images?.[0] ? (
                            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                          ) : (
                            <FiHome className="w-10 h-10 text-emerald-400" />
                          )}
                        </div>

                        {/* Property Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{property.title}</h3>
                              <div className="flex items-center text-gray-500 text-sm mt-1">
                                <FiMapPin className="w-4 h-4 mr-1" />
                                {property.locality}, {property.city}
                              </div>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(property.status)}`}>
                              {property.status}
                            </span>
                          </div>

                          <p className="text-2xl font-bold text-emerald-600 mb-3">
                            {formatPrice(property.price)}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center text-gray-500">
                              <FiEye className="w-4 h-4 mr-1 text-purple-500" />
                              <span>{property.views || 0} views</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FiHeart className="w-4 h-4 mr-1 text-red-500" />
                              <span>{getEnquiryCount(property.id)} interested</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FiClock className="w-4 h-4 mr-1" />
                              <span>Listed {formatDate(property.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col gap-2">
                          <Link
                            to={`/properties/${property.id}`}
                            className="flex-1 md:flex-none px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-lg text-center hover:bg-emerald-100 transition-colors"
                          >
                            <FiExternalLink className="w-4 h-4 inline mr-1" />
                            View
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Interested Properties Tab */}
          {activeTab === 'interested' && (
            <motion.div
              key="interested"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {interestedProperties.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiHeart className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Interested Properties</h3>
                  <p className="text-gray-500 mb-6">You haven't shown interest in any properties yet</p>
                  <button
                    onClick={() => navigate('/properties')}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg"
                  >
                    Browse Properties
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {interestedProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="h-40 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center overflow-hidden">
                        {property.images?.[0] ? (
                          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                          <FiHome className="w-12 h-12 text-emerald-400" />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{property.title}</h3>
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {property.locality}, {property.city}
                        </div>
                        <p className="text-xl font-bold text-emerald-600 mb-3">
                          {formatPrice(property.price)}
                        </p>
                        <div className="text-xs text-gray-400 mb-3">
                          Enquired on {formatDate(property.enquiry?.created_at)}
                        </div>
                        <Link
                          to={`/properties/${property.id}`}
                          className="block w-full py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-lg text-center hover:bg-emerald-100 transition-colors"
                        >
                          View Property
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Received Enquiries Tab */}
          {activeTab === 'enquiries' && (
            <motion.div
              key="enquiries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {receivedEnquiries.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiMessageSquare className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Enquiries Yet</h3>
                  <p className="text-gray-500">You haven't received any enquiries on your properties</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedEnquiries.map((enquiry, index) => (
                    <motion.div
                      key={enquiry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-2xl shadow-sm border p-6 ${
                        enquiry.is_read ? 'border-gray-100' : 'border-emerald-200 bg-emerald-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            <FiUser className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Property Enquiry</p>
                            <p className="text-sm text-gray-500">{formatDate(enquiry.created_at)}</p>
                          </div>
                        </div>
                        {!enquiry.is_read && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 bg-gray-50 rounded-xl p-4 mb-3">
                        "{enquiry.message}"
                      </p>
                      <Link
                        to={`/properties/${enquiry.property_id}`}
                        className="text-emerald-600 text-sm font-semibold hover:underline"
                      >
                        View Property →
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Dashboard

