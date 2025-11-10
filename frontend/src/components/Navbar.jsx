import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FiSun, FiMoon, FiUser, FiLogOut, FiHome, FiSettings } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-primary-navy dark:text-primary-blue"
            >
              DeepRealties
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors"
            >
              Home
            </Link>
            <Link
              to="/properties"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors"
            >
              Properties
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors"
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <FiSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'seller' || user?.role === 'admin' ? (
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/seller/dashboard'}
                    className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors"
                  >
                    <FiSettings className="w-5 h-5" />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                ) : null}
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <FiUser className="w-5 h-5" />
                  <span className="hidden md:inline">{user?.full_name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-navy transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

