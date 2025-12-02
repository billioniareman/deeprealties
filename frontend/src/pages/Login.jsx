import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await login(formData.email, formData.password)
    setLoading(false)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700"
        />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
      <motion.div
            initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center"
      >
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs tracking-wider uppercase font-semibold rounded-full mb-6">
          Welcome Back
            </span>
            <h2 className="text-4xl md:text-5xl text-white font-bold leading-tight mb-6">
              Discover Your <br />
              <span className="text-emerald-200 italic">Dream Property</span>
        </h2>
            <p className="text-white/80 max-w-md mx-auto">
              Access exclusive listings and premium real estate opportunities.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center mb-12">
            <img 
              src="https://storage.googleapis.com/supersourcing-doc-dev/fece4825-210b-4e5e-824b-283e221d16b7.png" 
              alt="DeepRealties" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Sign In
              </h1>
              <p className="text-gray-500">
                Enter your credentials to continue
              </p>
            </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 accent-emerald-500 cursor-pointer rounded" />
                  <span className="text-gray-600 group-hover:text-emerald-600 transition-colors">
                    Remember me
                  </span>
                </label>
                <a href="#" className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>

              <motion.button
            type="submit"
            disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <span>Sign In</span>
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
          Don't have an account?{' '}
              <Link to="/register" className="text-emerald-600 hover:text-emerald-700 transition-colors font-semibold">
                Create Account
          </Link>
        </p>
          </div>
      </motion.div>
      </div>
    </div>
  )
}

export default Login
