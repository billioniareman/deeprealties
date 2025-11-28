import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { 
  FiSun, FiMoon, FiUser, FiLogOut, FiMenu, FiX, FiGlobe, 
  FiChevronDown, FiHome, FiCalendar, FiInfo, FiPhone, FiGrid,
  FiDollarSign, FiKey, FiTrendingUp
} from 'react-icons/fi'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'hi' : 'en')
  }

  const services = [
    { to: '/buy', label: 'Buy Property', icon: <FiHome className="w-4 h-4" />, desc: 'Houses, Apartments, Villas & More' },
    { to: '/sell', label: 'Sell Property', icon: <FiDollarSign className="w-4 h-4" />, desc: 'List your property with us' },
    { to: '/rent', label: 'Rent Property', icon: <FiKey className="w-4 h-4" />, desc: 'Find or list rentals' },
    { to: '/invest', label: 'Invest With Us', icon: <FiTrendingUp className="w-4 h-4" />, desc: 'Investment opportunities' },
  ]

  const moreLinks = [
    { to: '/projects', label: 'Our Projects', icon: <FiGrid className="w-4 h-4" /> },
    { to: '/events', label: 'Events', icon: <FiCalendar className="w-4 h-4" /> },
    { to: '/about', label: 'About Us', icon: <FiInfo className="w-4 h-4" /> },
    { to: '/contact', label: 'Contact', icon: <FiPhone className="w-4 h-4" /> },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg shadow-gray-200/50 py-3' 
            : 'bg-white/80 backdrop-blur-md py-4'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3"
              >
                <img 
                  src="https://storage.googleapis.com/supersourcing-doc-dev/fece4825-210b-4e5e-824b-283e221d16b7.png" 
                  alt="DeepRealties" 
                  className="h-12 w-auto"
                />
                <span className="text-xl font-bold text-gray-800">
                  Deep<span className="text-emerald-600">Realties</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Properties Link */}
              <Link
                to="/properties"
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                  isActive('/properties') 
                    ? 'text-white bg-emerald-500' 
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                Properties
              </Link>

              {/* Services Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('services')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 rounded-full hover:bg-emerald-50 transition-all">
                  <span>Services</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'services' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-72 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden"
                    >
                      <div className="p-2">
                        {services.map((service) => (
                          <Link
                            key={service.to}
                            to={service.to}
                            className={`flex items-start space-x-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors group ${
                              isActive(service.to) ? 'bg-emerald-50' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive(service.to) ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-500 group-hover:text-white'} transition-colors`}>
                              {service.icon}
                            </div>
                            <div>
                              <div className={`font-semibold text-sm ${isActive(service.to) ? 'text-emerald-600' : 'text-gray-800 group-hover:text-emerald-600'}`}>
                                {service.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {service.desc}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* More Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('more')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 rounded-full hover:bg-emerald-50 transition-all">
                  <span>More</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'more' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'more' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-52 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden"
                    >
                      <div className="p-2">
                        {moreLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors ${
                              isActive(link.to) ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive(link.to) ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {link.icon}
                            </div>
                            <span className="font-medium text-sm">{link.label}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dashboard Link - Only visible when logged in */}
              {isAuthenticated && (
                <Link
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                    isActive('/dashboard') || isActive('/admin/dashboard')
                      ? 'text-white bg-emerald-500' 
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Language Switcher */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-emerald-50 transition-colors group"
              >
                <FiGlobe className="w-4 h-4 text-gray-600 group-hover:text-emerald-600 transition-colors" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-emerald-50 transition-colors group"
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <FiSun className="w-4 h-4 text-amber-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <FiMoon className="w-4 h-4 text-gray-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-200" />

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                      user?.role === 'admin' 
                        ? 'bg-amber-50 hover:bg-amber-100' 
                        : 'bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    <FiUser className={`w-4 h-4 ${user?.role === 'admin' ? 'text-amber-600' : 'text-emerald-600'}`} />
                    <span className={`text-sm font-semibold ${user?.role === 'admin' ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {user?.full_name}
                    </span>
                    {user?.role === 'admin' && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded">
                        ADMIN
                      </span>
                    )}
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-1 p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-gray-700 hover:text-emerald-600 text-sm font-semibold transition-colors"
                  >
                    Login
                  </Link>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link 
                      to="/register" 
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 text-gray-700 bg-gray-100 rounded-xl"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <FiX className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <FiMenu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex flex-col h-full pt-20 pb-8 px-6">
                {/* Services */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
                    Services
                  </h3>
                  {services.map((service) => (
                    <Link
                      key={service.to}
                      to={service.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 mb-1 rounded-xl transition-colors ${
                        isActive(service.to) 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive(service.to) ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {service.icon}
                      </div>
                      <span className="font-semibold text-sm">{service.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-gray-100 mb-6" />

                {/* More Links */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
                    Explore
                  </h3>
                  <Link
                    to="/properties"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 mb-1 rounded-xl transition-colors ${
                      isActive('/properties') 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive('/properties') ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <FiHome className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">All Properties</span>
                  </Link>
                  {moreLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 mb-1 rounded-xl transition-colors ${
                        isActive(link.to) 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive(link.to) ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {link.icon}
                      </div>
                      <span className="font-semibold text-sm">{link.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-gray-100 mb-6" />

                {/* Settings */}
                <div className="flex items-center justify-between px-3 py-3 mb-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-gray-600">Theme</span>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2.5 bg-white text-emerald-600 rounded-lg shadow-sm"
                  >
                    {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between px-3 py-3 mb-6 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-gray-600">Language</span>
                  <button
                    onClick={toggleLanguage}
                    className="px-4 py-1.5 text-sm font-bold bg-white text-emerald-600 rounded-lg shadow-sm"
                  >
                    {language === 'en' ? 'हिंदी' : 'EN'}
                  </button>
                </div>

                {/* Auth */}
                <div className="mt-auto space-y-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl ${
                          user?.role === 'admin' ? 'bg-amber-50' : 'bg-emerald-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <FiUser className={`w-4 h-4 ${user?.role === 'admin' ? 'text-amber-600' : 'text-emerald-600'}`} />
                          <span className="text-sm font-bold text-gray-700">
                            {user?.full_name}
                          </span>
                          {user?.role === 'admin' && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-1 ${user?.role === 'admin' ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {user?.role === 'admin' ? 'Open Admin Panel →' : 'View Dashboard →'}
                        </p>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-500 font-semibold hover:bg-red-50 rounded-xl"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 text-gray-700 font-semibold border border-gray-200 rounded-xl hover:bg-gray-50"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
