import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiMapPin, FiUsers, FiCheck, FiArrowRight, FiMail, FiPhone, FiUser, FiTarget, FiShield, FiAward } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Invest = () => {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    investment_budget: '',
    preferred_investment_type: '',
    message: ''
  })

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      const response = await api.get('/api/investments/opportunities')
      setOpportunities(response.data)
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/api/investments/register', {
        ...formData,
        investment_budget: formData.investment_budget ? parseFloat(formData.investment_budget) : null
      })
      toast.success('Thank you! Our team will contact you shortly.')
      setShowForm(false)
      setFormData({
        full_name: '', email: '', phone: '', investment_budget: '',
        preferred_investment_type: '', message: ''
      })
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  const benefits = [
    {
      icon: <FiTrendingUp className="w-7 h-7" />,
      title: 'High ROI',
      description: 'Earn premium returns with our verified investment opportunities'
    },
    {
      icon: <FiShield className="w-7 h-7" />,
      title: 'Secure Investment',
      description: 'All properties are legally verified and RERA approved'
    },
    {
      icon: <FiUsers className="w-7 h-7" />,
      title: 'Expert Guidance',
      description: 'Our investment advisors help you make informed decisions'
    },
    {
      icon: <FiAward className="w-7 h-7" />,
      title: 'Proven Track Record',
      description: '100+ successful investments with satisfied investors'
    }
  ]

  const stats = [
    { value: '₹50Cr+', label: 'Total Investments' },
    { value: '15-25%', label: 'Average ROI' },
    { value: '200+', label: 'Happy Investors' },
    { value: '50+', label: 'Active Projects' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs tracking-wider uppercase font-semibold rounded-full mb-6">
                Premium Investment Opportunities
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Invest With <span className="text-emerald-200 italic">Deep Realties</span>
              </h1>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                Join our investor community and earn premium profits through verified real estate investments
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl shadow-xl flex items-center space-x-3 mx-auto hover:bg-emerald-50 transition-colors"
              >
                <span>Join Investor Community</span>
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 via-emerald-900 to-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-emerald-600 font-semibold tracking-wider text-sm uppercase mb-4 block">
              Why Invest With Us
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Investment Benefits
            </h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-emerald-100 rounded-2xl text-emerald-600 mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-500">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-emerald-600 font-semibold tracking-wider text-sm uppercase mb-4 block">
              Current Opportunities
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Verified Colonies & Projects
            </h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full"
              />
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 max-w-lg mx-auto">
                <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <FiTarget className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  New Opportunities Coming Soon
                </h3>
                <p className="text-gray-500 mb-6">
                  Register now to be the first to know about upcoming investment opportunities
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Get Notified
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {opportunities.map((opp, index) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <span className="text-6xl">🏡</span>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full">
                      {opp.expected_roi}% ROI
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-emerald-600 text-sm uppercase font-semibold tracking-wide">
                      {opp.investment_type}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">
                      {opp.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <FiMapPin className="w-4 h-4 mr-1 text-emerald-500" />
                      {opp.location}, {opp.city}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-400 uppercase">Min Investment</span>
                        <div className="text-lg font-bold text-emerald-600">
                          ₹{(opp.min_investment / 100000).toFixed(0)}L
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-emerald-100 text-emerald-600 text-sm font-bold rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        Invest Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-600">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Investing?
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
              Join our investor community today and start earning premium returns on your investments
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl shadow-xl flex items-center space-x-3 mx-auto hover:bg-emerald-50 transition-colors"
            >
              <span>Register as Investor</span>
              <FiArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Registration Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Join Investor Community
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-emerald-600" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <FiMail className="w-4 h-4 text-emerald-600" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Phone *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <FiPhone className="w-4 h-4 text-emerald-600" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Investment Budget (₹)
                </label>
                <input
                  type="number"
                  value={formData.investment_budget}
                  onChange={(e) => setFormData({ ...formData, investment_budget: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  placeholder="e.g., 1000000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Preferred Investment Type
                </label>
                <select
                  value={formData.preferred_investment_type}
                  onChange={(e) => setFormData({ ...formData, preferred_investment_type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  <option value="">Select Type</option>
                  <option value="Colony">Colony</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
                  rows="3"
                  placeholder="Any specific requirements..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    <span>Submit</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Invest
