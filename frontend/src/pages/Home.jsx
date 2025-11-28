import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiSearch, FiMapPin, FiHome, FiTrendingUp, FiUsers, FiAward, FiStar, FiArrowRight, FiArrowUpRight, FiPhone, FiShield, FiCheck, FiKey, FiDollarSign, FiMail } from 'react-icons/fi'
import api from '../utils/api'
import PropertyCard from '../components/PropertyCard'

// ============================================
// ELEGANT GREEN THEME COMPONENTS
// ============================================

// Beautiful animated gradient background
const ElegantBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Base gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/60" />
    
    {/* Animated gradient mesh */}
    <motion.div
      animate={{ 
        background: [
          'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
        ]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
    />
    
    {/* Large floating orbs */}
    <motion.div
      animate={{ 
        x: [0, 100, 50, 0],
        y: [0, 50, 100, 0],
        scale: [1, 1.2, 1.1, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full opacity-60"
      style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(20, 184, 166, 0.08) 40%, transparent 70%)', filter: 'blur(40px)' }}
    />
    <motion.div
      animate={{ 
        x: [0, -80, -40, 0],
        y: [0, 80, 40, 0],
        scale: [1.1, 1, 1.2, 1.1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-50"
      style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(16, 185, 129, 0.06) 50%, transparent 70%)', filter: 'blur(50px)' }}
    />
    <motion.div
      animate={{ 
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 60%)', filter: 'blur(60px)' }}
    />
    
    {/* Animated wave lines */}
    <svg className="absolute bottom-0 left-0 w-full h-64 opacity-20" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <motion.path
        d="M0,100 C360,150 720,50 1080,100 C1260,130 1440,80 1440,80 L1440,200 L0,200 Z"
        fill="url(#waveGradient1)"
        animate={{
          d: [
            "M0,100 C360,150 720,50 1080,100 C1260,130 1440,80 1440,80 L1440,200 L0,200 Z",
            "M0,80 C360,50 720,150 1080,80 C1260,50 1440,120 1440,120 L1440,200 L0,200 Z",
            "M0,100 C360,150 720,50 1080,100 C1260,130 1440,80 1440,80 L1440,200 L0,200 Z",
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M0,120 C480,170 960,70 1440,120 L1440,200 L0,200 Z"
        fill="url(#waveGradient2)"
        animate={{
          d: [
            "M0,120 C480,170 960,70 1440,120 L1440,200 L0,200 Z",
            "M0,100 C480,50 960,170 1440,100 L1440,200 L0,200 Z",
            "M0,120 C480,170 960,70 1440,120 L1440,200 L0,200 Z",
          ]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
    
    {/* Subtle grid pattern */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16, 185, 129, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }}
    />
  </div>
)

// Floating decorative elements with various shapes
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Floating circles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`circle-${i}`}
        initial={{ 
          x: `${10 + (i * 12)}%`, 
          y: `${20 + (i * 8)}%`, 
          opacity: 0,
          scale: 0.5
        }}
        animate={{ 
          y: [`${20 + (i * 8)}%`, `${10 + (i * 5)}%`, `${20 + (i * 8)}%`],
          opacity: [0.2, 0.5, 0.2],
          scale: [0.8, 1, 0.8],
        }}
        transition={{ 
          duration: 6 + i * 2, 
          repeat: Infinity, 
          delay: i * 0.5,
          ease: "easeInOut"
        }}
        className="absolute w-3 h-3 rounded-full"
        style={{
          background: `linear-gradient(135deg, rgba(16, 185, 129, ${0.3 + i * 0.05}), rgba(20, 184, 166, ${0.2 + i * 0.03}))`,
          boxShadow: `0 0 20px rgba(16, 185, 129, 0.3)`
        }}
      />
    ))}
    
    {/* Floating diamonds */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={`diamond-${i}`}
        initial={{ 
          x: `${70 - (i * 15)}%`, 
          y: `${30 + (i * 12)}%`, 
          rotate: 45,
          opacity: 0 
        }}
        animate={{ 
          y: [`${30 + (i * 12)}%`, `${20 + (i * 8)}%`, `${30 + (i * 12)}%`],
          rotate: [45, 225, 405],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{ 
          duration: 10 + i * 3, 
          repeat: Infinity, 
          delay: i * 0.8,
          ease: "easeInOut"
        }}
        className="absolute w-4 h-4 border-2 border-emerald-400/40"
      />
    ))}
    
    {/* Glowing dots trail */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={`dot-${i}`}
        initial={{ opacity: 0 }}
        animate={{ 
          x: [
            `${5 + i * 8}%`,
            `${10 + i * 8}%`,
            `${5 + i * 8}%`
          ],
          y: [
            `${80 - i * 5}%`,
            `${75 - i * 5}%`,
            `${80 - i * 5}%`
          ],
          opacity: [0, 0.6, 0],
          scale: [0.5, 1.2, 0.5],
        }}
        transition={{ 
          duration: 4 + Math.random() * 3, 
          repeat: Infinity, 
          delay: i * 0.3,
          ease: "easeInOut"
        }}
        className="absolute w-1.5 h-1.5 rounded-full bg-teal-400"
        style={{ boxShadow: '0 0 10px rgba(20, 184, 166, 0.5)' }}
      />
    ))}
    
    {/* Animated rings */}
    <motion.div
      animate={{ 
        scale: [1, 1.5, 1],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-20 right-20 w-32 h-32 rounded-full border border-emerald-300/30"
    />
    <motion.div
      animate={{ 
        scale: [1.2, 1, 1.2],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="absolute bottom-32 left-16 w-24 h-24 rounded-full border-2 border-teal-300/20"
    />
  </div>
)

// Animated counter
const AnimatedCounter = ({ value, suffix = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      const num = parseInt(value.replace(/\D/g, ''))
      let current = 0
      const step = num / 50
      const timer = setInterval(() => {
        current += step
        if (current >= num) { setCount(num); clearInterval(timer) }
        else { setCount(Math.floor(current)) }
      }, 20)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// Reveal animation
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

const Home = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  
  const [searchFilters, setSearchFilters] = useState({ city: '', property_type: '', max_price: '' })
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [hoveredService, setHoveredService] = useState(null)

  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, -60])

  useEffect(() => {
    fetchFeaturedProperties()
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 6000)
    return () => clearInterval(timer)
  }, [])

  const fetchFeaturedProperties = async () => {
    try {
      const res = await api.get('/api/properties', { params: { limit: 6 } })
      setFeaturedProperties(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(searchFilters).forEach(([k, v]) => v && params.append(k, v))
    navigate(`/properties?${params.toString()}`)
  }

  const services = [
    { id: 'buy', title: 'Buy Property', subtitle: 'Find Your Dream Home', icon: <FiHome className="w-6 h-6" />, desc: 'Houses, Apartments, Villas & More', color: 'from-emerald-500 to-teal-500' },
    { id: 'sell', title: 'Sell Property', subtitle: 'Get Best Value', icon: <FiDollarSign className="w-6 h-6" />, desc: 'Quick & Hassle-free Sales', color: 'from-teal-500 to-cyan-500' },
    { id: 'rent', title: 'Rent Property', subtitle: 'Flexible Options', icon: <FiKey className="w-6 h-6" />, desc: 'Residential & Commercial Rentals', color: 'from-cyan-500 to-emerald-500' },
    { id: 'invest', title: 'Invest With Us', subtitle: 'Grow Your Wealth', icon: <FiTrendingUp className="w-6 h-6" />, desc: 'High Returns Investment Plans', color: 'from-emerald-600 to-green-500' },
  ]

  const stats = [
    { value: '100', suffix: '+', label: 'Properties Listed' },
    { value: '50', suffix: '+', label: 'Happy Clients' },
    { value: '5', suffix: '+', label: 'Cities Covered' },
    { value: '2', suffix: '+', label: 'Years Experience' },
  ]

  const propertyTypes = [
    { name: 'Houses', icon: '🏠', count: '500+' },
    { name: 'Apartments', icon: '🏢', count: '400+' },
    { name: 'Villas', icon: '🏡', count: '200+' },
    { name: 'Plots', icon: '📍', count: '300+' },
    { name: 'Commercial', icon: '🏪', count: '150+' },
    { name: 'Farm Land', icon: '🌾', count: '100+' },
  ]

  const features = [
    { icon: <FiShield />, title: 'Verified Properties', desc: 'All properties are verified by our expert team for authenticity', tag: '100%' },
    { icon: <FiTrendingUp />, title: 'Best Market Prices', desc: 'Get competitive prices with our extensive market research', tag: 'Guaranteed' },
    { icon: <FiCheck />, title: 'Legal Assistance', desc: 'Complete legal support from documentation to registration', tag: 'Free' },
    { icon: <FiUsers />, title: 'Dedicated Support', desc: 'Personal property advisor for your buying journey', tag: '24/7' },
  ]

  const testimonials = [
    { name: 'Rajesh Sharma', title: 'Home Buyer', quote: 'Deep Realties helped me find my dream home in just 2 weeks. Their team understood exactly what I needed!', property: '3 BHK Villa', location: 'Hatod' },
    { name: 'Priya Patel', title: 'Property Investor', quote: 'Excellent investment advice and transparent dealings. My portfolio has grown significantly with their guidance.', property: 'Commercial Space', location: 'Indore' },
    { name: 'Vikram Singh', title: 'First-time Buyer', quote: 'As a first-time buyer, I was nervous but their team made the entire process smooth and stress-free.', property: '2 BHK Apartment', location: 'Dewas' },
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <ElegantBackground />
        <FloatingElements />
        
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 w-full px-6 lg:px-8 py-20"
        >
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/25">
                <span className="text-white text-xs font-semibold tracking-wider uppercase">
                  ✨ Trusted by 50+ Happy Families
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6"
            >
              <h1 className="font-display leading-[1.15]">
                <span className="block text-gray-800 text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  Find Your Perfect
                </span>
                <span className="block text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                    Dream Property
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Houses, Apartments, Villas, Plots, Commercial Spaces & More.
              <span className="text-emerald-600 font-semibold"> Your trusted partner</span> in finding the perfect property.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/properties')}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold tracking-wide rounded-full shadow-xl shadow-emerald-500/30"
              >
                <span className="flex items-center gap-2">
                  Explore Properties
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-white text-emerald-600 text-sm font-bold tracking-wide rounded-full border-2 border-emerald-500 hover:bg-emerald-50 transition-colors shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4" />
                  Free Consultation
                </span>
              </motion.button>
            </motion.div>

            {/* Search */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative group">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter city or locality..."
                      value={searchFilters.city}
                      onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex-1 relative group">
                    <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                    <select
                      value={searchFilters.property_type}
                      onChange={(e) => setSearchFilters({ ...searchFilters, property_type: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-gray-800 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all"
                    >
                      <option value="">All Property Types</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="plot">Plot</option>
                      <option value="commercial">Commercial</option>
                      <option value="farmland">Farm Land</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold tracking-wide rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <FiSearch className="w-4 h-4" />
                    Search
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-800">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ==================== PROPERTY TYPES ==================== */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Browse by <span className="text-emerald-600">Property Type</span>
            </h2>
          </Reveal>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {propertyTypes.map((type, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  onClick={() => navigate(`/properties?type=${type.name.toLowerCase()}`)}
                  className="text-center p-5 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:border-emerald-200 transition-all"
                >
                  <span className="text-3xl mb-2 block">{type.icon}</span>
                  <h3 className="text-gray-800 text-sm font-semibold">{type.name}</h3>
                  <p className="text-emerald-600 text-xs mt-1">{type.count}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        {/* Animated background for services */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-emerald-200/30"
          />
          <motion.div
            animate={{ 
              rotate: [360, 0],
            }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full border-2 border-dashed border-teal-200/20"
          />
          {/* Floating blobs */}
          <motion.div
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[20%] w-32 h-32 rounded-full bg-emerald-100/50 blur-3xl"
          />
          <motion.div
            animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-[15%] w-40 h-40 rounded-full bg-teal-100/40 blur-3xl"
          />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative">
          <Reveal className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              How Can We <span className="text-emerald-600">Help You</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.1}>
                <motion.div
                  onHoverStart={() => setHoveredService(service.id)}
                  onHoverEnd={() => setHoveredService(null)}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/${service.id}`)}
                  className="group relative cursor-pointer p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredService === service.id ? 0.05 : 0 }}
                    className={`absolute inset-0 bg-gradient-to-br ${service.color}`}
                  />
                  
                  <div className="relative">
                    <div className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg`}>
                      {service.icon}
                    </div>
                    <h3 className="text-gray-800 text-lg font-bold mb-1 group-hover:text-emerald-600 transition-colors">{service.title}</h3>
                    <p className="text-emerald-600 text-xs font-semibold mb-2">{service.subtitle}</p>
                    <p className="text-gray-500 text-sm">{service.desc}</p>
                  </div>
                  
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: hoveredService === service.id ? 1 : 0, opacity: hoveredService === service.id ? 1 : 0 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <FiArrowUpRight className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              The <span className="text-emerald-600">Deep Realties</span> Advantage
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {features.map((feature, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl hover:shadow-xl hover:border-emerald-200 transition-all"
                >
                  <span className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-[10px] tracking-wider uppercase font-bold rounded-full">
                    {feature.tag}
                  </span>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-gray-800 text-base font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PROPERTIES ==================== */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating property icons */}
          <motion.div
            animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[5%] text-4xl opacity-10"
          >
            🏠
          </motion.div>
          <motion.div
            animate={{ y: [15, -15, 15], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-[8%] text-3xl opacity-10"
          >
            🏢
          </motion.div>
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-32 left-[12%] text-3xl opacity-10"
          >
            🏡
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 right-[15%] text-4xl opacity-10"
          >
            🏘️
          </motion.div>
          
          {/* Gradient accents */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-1/4 w-60 h-60 bg-emerald-100/40 rounded-full blur-3xl"
          />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <Reveal>
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
                Featured Listings
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Premium <span className="text-emerald-600">Properties</span>
              </h2>
            </Reveal>
            
            <Reveal delay={0.2}>
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => navigate('/properties')}
                className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full hover:bg-emerald-100 transition-colors"
              >
                View All Properties
                <FiArrowUpRight className="w-4 h-4" />
              </motion.button>
            </Reveal>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        {/* Animated decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Moving light orbs */}
          <motion.div
            animate={{ 
              x: [-50, 50, -50],
              y: [-30, 30, -30],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [50, -50, 50],
              y: [30, -30, 30],
              scale: [1.2, 1, 1.2],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
          
          {/* Floating stars/sparkles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
            />
          ))}
          
          {/* Animated quote marks */}
          <motion.div
            animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] text-white/10 text-[200px] font-serif"
          >
            "
          </motion.div>
          <motion.div
            animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-0 right-[10%] text-white/10 text-[200px] font-serif rotate-180"
          >
            "
          </motion.div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative">
          <Reveal className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What Our Clients Say
            </h2>
          </Reveal>

          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl">
                  <div className="flex justify-center gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-6 italic">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-lg font-bold mb-3 shadow-lg">
                      {testimonials[activeTestimonial].name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h4 className="text-gray-800 font-bold">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-emerald-600 text-sm font-medium">{testimonials[activeTestimonial].title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>🏠 {testimonials[activeTestimonial].property}</span>
                      <span>📍 {testimonials[activeTestimonial].location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeTestimonial 
                      ? 'w-8 h-2.5 bg-white' 
                      : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full border border-emerald-100/50"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full border-2 border-dashed border-teal-100/40"
          />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 p-10 md:p-14 rounded-3xl border border-gray-100 shadow-xl shadow-emerald-100/30 relative overflow-hidden"
          >
            {/* Inner animated accents */}
            <motion.div
              animate={{ x: [-20, 20, -20], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ x: [20, -20, 20], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 right-0 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl"
            />
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Ready to Find Your
                <span className="text-emerald-600 block mt-1">Dream Property?</span>
              </h2>
              <p className="text-gray-500 text-base mb-8 max-w-lg mx-auto">
                Let our experts help you find the perfect property. Get personalized recommendations based on your needs.
              </p>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/properties')}
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold tracking-wide rounded-full shadow-xl shadow-emerald-500/30"
                >
                  <span className="flex items-center gap-2">
                    Browse Properties
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/contact')}
                  className="px-8 py-4 bg-white text-emerald-600 text-sm font-bold tracking-wide rounded-full border-2 border-emerald-500 hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    Contact Us
                  </span>
                </motion.button>
              </div>
            </Reveal>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer */}
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://storage.googleapis.com/supersourcing-doc-dev/fece4825-210b-4e5e-824b-283e221d16b7.png" 
                  alt="DeepRealties" 
                  className="h-12 w-auto brightness-0 invert"
                />
                <span className="text-xl font-bold text-white">
                  Deep<span className="text-emerald-400">Realties</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Your trusted partner in finding the perfect property. We connect dreams with reality.
              </p>
              <div className="flex space-x-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/properties" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Properties</Link></li>
                <li><Link to="/buy" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Buy Property</Link></li>
                <li><Link to="/sell" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Sell Property</Link></li>
                <li><Link to="/rent" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Rent Property</Link></li>
                <li><Link to="/invest" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Invest With Us</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">About Us</Link></li>
                <li><Link to="/projects" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Our Projects</Link></li>
                <li><Link to="/events" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Events</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <FiMapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">Main Square, Hatod, MP - 453111</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FiPhone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <a href="tel:+918305551215" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">+91 8305551215</a>
                </li>
                <li className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <a href="mailto:deeprealties@gmail.com" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">deeprealties@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Deep Realties. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
