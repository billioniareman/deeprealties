import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiHome, FiCalendar, FiImage, FiCheck, FiClock, FiArrowRight } from 'react-icons/fi'
import { GiWheat, GiMountains, GiFarmTractor, GiTreeBranch, GiVillage } from 'react-icons/gi'
import api from '../utils/api'

// Animated Project Hero Background
const AnimatedProjectsHero = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Sky Gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-sky-300 to-emerald-400 dark:from-slate-900 dark:via-emerald-900 dark:to-slate-900" />
    
    {/* Animated Sun with Rays */}
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute top-10 right-20"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 360]
        }}
        transition={{ 
          scale: { duration: 4, repeat: Infinity },
          rotate: { duration: 30, repeat: Infinity, ease: 'linear' }
        }}
        className="relative w-28 h-28"
      >
        {/* Sun Rays */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-20 bg-gradient-to-t from-transparent via-yellow-300/50 to-transparent origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${i * 45}deg)` }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/50" />
      </motion.div>
    </motion.div>
    
    {/* Floating Clouds */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ x: '-20%' }}
        animate={{ x: '120vw' }}
        transition={{ 
          duration: 35 + i * 10,
          repeat: Infinity,
          delay: i * 12,
          ease: 'linear'
        }}
        className={`absolute ${['top-16', 'top-28', 'top-8'][i]}`}
      >
        <svg width={100 + i * 20} height={50} viewBox="0 0 120 60" fill="white" fillOpacity={0.8 - i * 0.1}>
          <ellipse cx="60" cy="40" rx="40" ry="20"/>
          <ellipse cx="35" cy="35" rx="25" ry="18"/>
          <ellipse cx="85" cy="38" rx="25" ry="15"/>
        </svg>
      </motion.div>
    ))}
    
    {/* Animated Village Silhouette */}
    <div className="absolute bottom-0 left-0 right-0">
      <svg className="w-full h-64" viewBox="0 0 1440 256" preserveAspectRatio="none">
        <defs>
          <linearGradient id="projectHill1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2E7D32"/>
            <stop offset="100%" stopColor="#1B5E20"/>
          </linearGradient>
          <linearGradient id="projectHill2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#43A047"/>
            <stop offset="100%" stopColor="#2E7D32"/>
          </linearGradient>
        </defs>
        
        {/* Back hills */}
        <motion.path
          animate={{ d: [
            "M0,150 Q200,80 400,140 Q600,60 800,130 Q1000,70 1200,140 Q1350,90 1440,120 L1440,256 L0,256 Z",
            "M0,140 Q200,90 400,130 Q600,70 800,140 Q1000,60 1200,130 Q1350,100 1440,130 L1440,256 L0,256 Z",
            "M0,150 Q200,80 400,140 Q600,60 800,130 Q1000,70 1200,140 Q1350,90 1440,120 L1440,256 L0,256 Z"
          ]}}
          transition={{ duration: 10, repeat: Infinity }}
          fill="url(#projectHill1)"
          opacity="0.6"
        />
        
        {/* Front hills */}
        <motion.path
          animate={{ d: [
            "M0,180 Q240,130 480,170 Q720,110 960,165 Q1200,120 1440,160 L1440,256 L0,256 Z",
            "M0,170 Q240,140 480,165 Q720,120 960,170 Q1200,110 1440,170 L1440,256 L0,256 Z",
            "M0,180 Q240,130 480,170 Q720,110 960,165 Q1200,120 1440,160 L1440,256 L0,256 Z"
          ]}}
          transition={{ duration: 8, repeat: Infinity }}
          fill="url(#projectHill2)"
        />
      </svg>
    </div>
    
    {/* Houses/Buildings Silhouette */}
    <div className="absolute bottom-20 left-1/4 flex gap-8 items-end">
      {[40, 60, 45, 70, 50].map((height, i) => (
        <motion.div
          key={i}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.15 }}
          className="relative"
        >
          <div 
            className="bg-gradient-to-t from-emerald-900 to-emerald-800"
            style={{ width: '24px', height: `${height}px` }}
          />
          <div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '16px solid transparent',
              borderRight: '16px solid transparent',
              borderBottom: '16px solid #1B5E20'
            }}
          />
        </motion.div>
      ))}
    </div>
    
    {/* Wheat Field */}
    <div className="absolute bottom-8 right-20 flex gap-1">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.08 }}
          className="text-amber-600/80 text-2xl origin-bottom"
        >
          <GiWheat />
        </motion.div>
      ))}
    </div>
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
  </div>
)

const Projects = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)

  const tabs = [
    { id: 'all', label: 'All Projects', icon: <FiHome /> },
    { id: 'completed', label: 'Completed', icon: <FiCheck /> },
    { id: 'ongoing', label: 'Ongoing', icon: <FiClock /> },
    { id: 'upcoming', label: 'Upcoming', icon: <FiCalendar /> }
  ]

  useEffect(() => {
    fetchProjects()
  }, [activeTab])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const endpoint = activeTab === 'all' 
        ? '/api/projects' 
        : `/api/projects/${activeTab}`
      const response = await api.get(endpoint)
      setProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'ongoing': return 'bg-gold-500'
      case 'upcoming': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const formatPrice = (min, max) => {
    const formatNum = (num) => {
      if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`
      if (num >= 100000) return `₹${(num / 100000).toFixed(0)}L`
      return `₹${num?.toLocaleString()}`
    }
    if (min && max) return `${formatNum(min)} - ${formatNum(max)}`
    if (min) return `From ${formatNum(min)}`
    if (max) return `Up to ${formatNum(max)}`
    return 'Contact for Price'
  }

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-onyx-950">
      {/* Hero Section - Animated Village Scene */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <AnimatedProjectsHero />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center space-x-3 mb-6 px-5 py-2 bg-emerald-900/60 backdrop-blur-sm rounded-full border border-emerald-500/30">
              <GiVillage className="text-gold-400" />
              <span className="text-gold-300 font-medium tracking-luxury text-sm uppercase">
                Our Portfolio
              </span>
              <GiMountains className="text-gold-400" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white drop-shadow-lg mb-4">
              Our Projects
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-light bg-black/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              Explore our premium residential and commercial developments
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-20 z-30 bg-ivory-50 dark:bg-onyx-950 border-b border-gold-500/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] py-4 text-center font-medium transition-all relative ${
                  activeTab === tab.id 
                    ? 'text-gold-500' 
                    : 'text-onyx-500 dark:text-ivory-500 hover:text-gold-500'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="project-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="loader-luxury" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="card-luxury p-12 max-w-md mx-auto">
                <FiHome className="w-16 h-16 mx-auto text-gold-500/30 mb-4" />
                <h3 className="font-display text-2xl text-onyx-900 dark:text-ivory-50 mb-2">
                  No Projects Found
                </h3>
                <p className="text-onyx-500 dark:text-ivory-500">
                  {activeTab === 'upcoming' 
                    ? 'New projects will be announced soon!'
                    : 'Check back later for updates'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedProject(project)}
                    className="card-luxury overflow-hidden group cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      {project.images?.[0] ? (
                        <img 
                          src={project.images[0]} 
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-onyx-800 to-onyx-900 flex items-center justify-center">
                          <FiHome className="w-16 h-16 text-gold-500/30" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={`absolute top-4 left-4 px-4 py-1.5 ${getStatusColor(project.status)} text-white text-xs font-bold uppercase tracking-wider`}>
                        {project.status}
                      </div>

                      {/* Gallery Icon */}
                      {project.gallery?.length > 0 && (
                        <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-onyx-900/80 text-ivory-100">
                          <FiImage className="w-5 h-5" />
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center bg-gold-500 text-onyx-900 text-xs font-bold rounded-full">
                            {project.gallery.length}
                          </span>
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-onyx-950 via-onyx-950/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold text-onyx-900 dark:text-ivory-50 mb-2 group-hover:text-gold-500 transition-colors">
                        {project.name}
                      </h3>
                      
                      <div className="flex items-center text-onyx-500 dark:text-ivory-500 text-sm mb-4">
                        <FiMapPin className="w-4 h-4 mr-1 text-gold-500" />
                        {project.location}, {project.city}
                      </div>

                      <p className="text-onyx-600 dark:text-ivory-400 text-sm font-light line-clamp-2 mb-4">
                        {project.description}
                      </p>

                      <div className="divider-gold mb-4" />

                      {/* Details */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-onyx-500 dark:text-ivory-500 uppercase">Price Range</span>
                          <div className="font-display text-lg font-semibold text-gradient-gold">
                            {formatPrice(project.price_range_min, project.price_range_max)}
                          </div>
                        </div>
                        {project.available_units && (
                          <div className="text-right">
                            <span className="text-xs text-onyx-500 dark:text-ivory-500 uppercase">Available</span>
                            <div className="font-semibold text-onyx-900 dark:text-ivory-50">
                              {project.available_units} Units
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Amenities Preview */}
                      {project.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.amenities.slice(0, 3).map((amenity, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 text-xs bg-gold-500/10 text-gold-500 border border-gold-500/20"
                            >
                              {amenity}
                            </span>
                          ))}
                          {project.amenities.length > 3 && (
                            <span className="px-2 py-1 text-xs text-onyx-500 dark:text-ivory-500">
                              +{project.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom accent */}
                    <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-gold-400 via-champagne-500 to-gold-400 transition-all duration-500" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-onyx-950/95"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ivory-50 dark:bg-onyx-900 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header Image */}
              <div className="relative h-80">
                {selectedProject.images?.[0] ? (
                  <img 
                    src={selectedProject.images[0]} 
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-onyx-800 to-onyx-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-onyx-950 to-transparent" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-ivory-100/20 text-ivory-100 hover:bg-gold-500 hover:text-onyx-900 transition-all"
                >
                  ✕
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className={`inline-block px-4 py-1.5 ${getStatusColor(selectedProject.status)} text-white text-xs font-bold uppercase tracking-wider mb-3`}>
                    {selectedProject.status}
                  </div>
                  <h2 className="font-display text-3xl font-semibold text-ivory-50">
                    {selectedProject.name}
                  </h2>
                  <div className="flex items-center text-ivory-300 mt-2">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    {selectedProject.location}, {selectedProject.city}, {selectedProject.state}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gold-500/10 p-4">
                    <span className="text-xs text-onyx-500 dark:text-ivory-500 uppercase">Price Range</span>
                    <div className="font-display text-xl font-semibold text-gradient-gold">
                      {formatPrice(selectedProject.price_range_min, selectedProject.price_range_max)}
                    </div>
                  </div>
                  {selectedProject.total_units && (
                    <div className="bg-gold-500/10 p-4">
                      <span className="text-xs text-onyx-500 dark:text-ivory-500 uppercase">Total Units</span>
                      <div className="font-display text-xl font-semibold text-onyx-900 dark:text-ivory-50">
                        {selectedProject.total_units}
                      </div>
                    </div>
                  )}
                  {selectedProject.available_units && (
                    <div className="bg-gold-500/10 p-4">
                      <span className="text-xs text-onyx-500 dark:text-ivory-500 uppercase">Available</span>
                      <div className="font-display text-xl font-semibold text-gold-500">
                        {selectedProject.available_units} Units
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="font-display text-xl font-semibold text-onyx-900 dark:text-ivory-50 mb-4">
                  About This Project
                </h3>
                <p className="text-onyx-600 dark:text-ivory-400 font-light leading-relaxed mb-8">
                  {selectedProject.description}
                </p>

                {selectedProject.highlights?.length > 0 && (
                  <>
                    <h3 className="font-display text-xl font-semibold text-onyx-900 dark:text-ivory-50 mb-4">
                      Highlights
                    </h3>
                    <ul className="grid grid-cols-2 gap-3 mb-8">
                      {selectedProject.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center space-x-2 text-onyx-600 dark:text-ivory-400">
                          <FiCheck className="w-4 h-4 text-gold-500" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {selectedProject.amenities?.length > 0 && (
                  <>
                    <h3 className="font-display text-xl font-semibold text-onyx-900 dark:text-ivory-50 mb-4">
                      Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedProject.amenities.map((amenity, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1.5 bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-luxury w-full flex items-center justify-center space-x-2"
                >
                  <span>Enquire About This Project</span>
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Projects

