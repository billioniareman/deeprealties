import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiUser, FiPhone, FiArrowRight, FiHome, FiTrendingUp } from 'react-icons/fi'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'buyer',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await register(formData)
    setLoading(false)
    if (success) {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
      <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-lg"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center mb-10">
            <img 
              src="https://storage.googleapis.com/supersourcing-doc-dev/ddc22abb-49ab-4b37-85fd-d8aa4a4d3ff4.jpeg" 
              alt="DeepRealties" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Account
              </h1>
              <p className="text-gray-500">
                Join our exclusive real estate community
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
          <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-emerald-600" />
                  </div>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    placeholder="John Doe"
              />
            </div>
          </div>

          <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Email Address
            </label>
            <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <FiMail className="w-4 h-4 text-emerald-600" />
                  </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Phone (Optional)
            </label>
            <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <FiPhone className="w-4 h-4 text-emerald-600" />
                  </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <FiLock className="w-4 h-4 text-emerald-600" />
                  </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    placeholder="••••••••"
              />
            </div>
          </div>

          <div>
                <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              I want to
            </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, role: 'buyer' })}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                      formData.role === 'buyer'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.role === 'buyer' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <FiHome className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-semibold ${formData.role === 'buyer' ? 'text-emerald-600' : 'text-gray-600'}`}>
                      Buy Property
                    </span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, role: 'seller' })}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                      formData.role === 'seller'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.role === 'seller' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <FiTrendingUp className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-semibold ${formData.role === 'seller' ? 'text-emerald-600' : 'text-gray-600'}`}>
                      Sell Property
                    </span>
                  </motion.button>
                </div>
          </div>

              <motion.button
            type="submit"
            disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all flex items-center justify-center space-x-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
        </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="h-px bg-gray-200" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white text-gray-400 text-sm">
                or
              </span>
            </div>

            <p className="text-center text-gray-600">
          Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 transition-colors font-semibold">
                Sign In
          </Link>
        </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700"
        />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs tracking-wider uppercase font-semibold rounded-full mb-6">
              Join Us Today
            </span>
            <h2 className="text-4xl md:text-5xl text-white font-bold leading-tight mb-6">
              Start Your <br />
              <span className="text-emerald-200 italic">Journey Today</span>
            </h2>
            <p className="text-white/80 max-w-md mx-auto">
              Get access to exclusive listings, market insights, and personalized recommendations.
            </p>
      </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Register
