import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiArrowRight, FiCheck, FiImage, FiPlay } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [registering, setRegistering] = useState(false)
  const [regForm, setRegForm] = useState({
    full_name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [activeTab])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const endpoint = activeTab === 'upcoming' ? '/api/events/upcoming' : '/api/events/past'
      const response = await api.get(endpoint)
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegistering(true)
    try {
      await api.post(`/api/events/${selectedEvent.id}/register`, regForm)
      toast.success('Successfully registered for the event!')
      setSelectedEvent(null)
      setRegForm({ full_name: '', email: '', phone: '' })
      fetchEvents()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
  }

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-onyx-950">
      {/* Hero Section */}
      <section className="relative py-32 bg-onyx-950 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx-950/60 to-onyx-950" />
        <div className="absolute inset-0 bg-grid-luxury opacity-30" />
        
        <div className="container mx-auto px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center space-x-3 mb-6">
              <span className="diamond" />
              <span className="text-gold-400 font-medium tracking-luxury text-sm uppercase">
                Join Our Community
              </span>
              <span className="diamond" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-ivory-50 mb-4">
              Events & Exhibitions
            </h1>
            <p className="text-xl text-ivory-300/80 max-w-2xl mx-auto font-light">
              Stay connected with our property exhibitions, investment seminars, and networking events
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-20 z-30 bg-ivory-50 dark:bg-onyx-950 border-b border-gold-500/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-4 text-center font-medium transition-all relative ${
                activeTab === 'upcoming' 
                  ? 'text-gold-500' 
                  : 'text-onyx-500 dark:text-ivory-500 hover:text-gold-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiCalendar className="w-5 h-5" />
                <span>Upcoming Events</span>
              </div>
              {activeTab === 'upcoming' && (
                <motion.div 
                  layoutId="event-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-4 text-center font-medium transition-all relative ${
                activeTab === 'past' 
                  ? 'text-gold-500' 
                  : 'text-onyx-500 dark:text-ivory-500 hover:text-gold-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiImage className="w-5 h-5" />
                <span>Past Events</span>
              </div>
              {activeTab === 'past' && (
                <motion.div 
                  layoutId="event-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="loader-luxury" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="card-luxury p-12 max-w-md mx-auto">
                <FiCalendar className="w-16 h-16 mx-auto text-gold-500/30 mb-4" />
                <h3 className="font-display text-2xl text-onyx-900 dark:text-ivory-50 mb-2">
                  No {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Events
                </h3>
                <p className="text-onyx-500 dark:text-ivory-500">
                  {activeTab === 'upcoming' 
                    ? 'Stay tuned for exciting upcoming events!'
                    : 'No past events to display'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {events.map((event, index) => {
                const date = formatDate(event.event_date)
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-luxury overflow-hidden group"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4">
                      {/* Date Column */}
                      <div className="md:col-span-1 bg-onyx-950 p-8 flex flex-col items-center justify-center text-center">
                        <div className="font-display text-5xl font-bold text-gradient-gold">
                          {date.day}
                        </div>
                        <div className="text-ivory-300 uppercase tracking-wider text-lg">
                          {date.month}
                        </div>
                        <div className="text-ivory-500 text-sm mt-1">
                          {date.year}
                        </div>
                        {!event.is_past && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedEvent(event)}
                            className="mt-6 px-6 py-2 bg-gold-500 text-onyx-900 font-medium text-sm uppercase tracking-wide"
                          >
                            Register
                          </motion.button>
                        )}
                      </div>

                      {/* Content Column */}
                      <div className="md:col-span-2 p-8">
                        <h3 className="font-display text-2xl font-semibold text-onyx-900 dark:text-ivory-50 mb-3 group-hover:text-gold-500 transition-colors">
                          {event.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-onyx-500 dark:text-ivory-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <FiMapPin className="w-4 h-4 text-gold-500" />
                            <span>{event.location}, {event.city}</span>
                          </div>
                          {event.event_time && (
                            <div className="flex items-center space-x-1">
                              <FiClock className="w-4 h-4 text-gold-500" />
                              <span>{event.event_time}</span>
                            </div>
                          )}
                          {event.registered_count > 0 && (
                            <div className="flex items-center space-x-1">
                              <FiUsers className="w-4 h-4 text-gold-500" />
                              <span>{event.registered_count} registered</span>
                            </div>
                          )}
                        </div>

                        <p className="text-onyx-600 dark:text-ivory-400 font-light line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      {/* Image Column */}
                      <div className="md:col-span-1 relative h-48 md:h-auto overflow-hidden">
                        {event.images?.[0] ? (
                          <img 
                            src={event.images[0]} 
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center">
                            <FiCalendar className="w-12 h-12 text-gold-500/50" />
                          </div>
                        )}
                        {event.videos?.length > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 flex items-center justify-center bg-ivory-50/90 text-gold-500 rounded-full">
                              <FiPlay className="w-6 h-6 ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-onyx-950/90"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ivory-50 dark:bg-onyx-900 max-w-md w-full p-8"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-onyx-500 hover:text-gold-500"
              >
                ✕
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gold-500/10 text-gold-500 mb-4">
                  <FiCalendar className="w-8 h-8" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-onyx-900 dark:text-ivory-50">
                  Register for Event
                </h2>
                <p className="text-onyx-500 dark:text-ivory-500 text-sm mt-1">
                  {selectedEvent.title}
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-onyx-700 dark:text-ivory-300 mb-2 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.full_name}
                    onChange={(e) => setRegForm({ ...regForm, full_name: e.target.value })}
                    className="input-luxury"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-onyx-700 dark:text-ivory-300 mb-2 uppercase tracking-wide">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="input-luxury"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-onyx-700 dark:text-ivory-300 mb-2 uppercase tracking-wide">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="input-luxury"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={registering}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-luxury w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {registering ? (
                    <div className="loader-luxury w-5 h-5 border-2" />
                  ) : (
                    <>
                      <FiCheck className="w-5 h-5" />
                      <span>Confirm Registration</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Events

