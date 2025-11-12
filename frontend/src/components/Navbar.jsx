import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import { FiSun, FiMoon, FiUser, FiLogOut, FiHome, FiSettings, FiGlobe } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'hi' : 'en')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary-navy via-primary-blue to-primary-emerald bg-clip-text text-transparent"
            >
              DeepRealties
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors font-medium"
              >
                {t('nav.home')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                to="/properties"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors font-medium"
              >
                {t('nav.properties')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                to="/our-projects"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors font-medium"
              >
                {t('nav.ourProjects')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                to="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors font-medium"
              >
                {t('nav.about')}
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
              title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              <FiGlobe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {language === 'en' ? 'हिंदी' : 'English'}
              </span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <FiSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-700" />
              )}
            </motion.button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.role === 'seller' || user?.role === 'admin' ? (
                  <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                    <Link
                      to={user?.role === 'admin' ? '/admin/dashboard' : '/seller/dashboard'}
                      className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors font-medium"
                    >
                      <FiSettings className="w-5 h-5" />
                      <span className="hidden md:inline">{t('nav.dashboard')}</span>
                    </Link>
                  </motion.div>
                ) : null}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg"
                >
                  <FiUser className="w-4 h-4" />
                  <span className="hidden md:inline text-sm font-medium">{user?.full_name}</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors font-medium"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="hidden md:inline">{t('nav.logout')}</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-blue transition-colors font-medium"
                  >
                    {t('nav.login')}
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-primary-blue to-primary-emerald text-white rounded-lg hover:from-primary-navy hover:to-primary-blue transition-all shadow-lg hover:shadow-xl font-medium"
                  >
                    {t('nav.register')}
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
