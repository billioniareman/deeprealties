import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck, FiMessageCircle, FiClock, FiUser } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Contact = () => {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/contact', formData)
      setSubmitted(true)
      toast.success('Message sent successfully!')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <FiPhone className="w-5 h-5" />,
      title: 'Phone',
      value: '+91 8305551215',
      link: 'tel:+918305551215'
    },
    {
      icon: <FiMail className="w-5 h-5" />,
      title: 'Email',
      value: 'deeprealties@gmail.com',
      link: 'mailto:deeprealties@gmail.com'
    },
    {
      icon: <FiMapPin className="w-5 h-5" />,
      title: 'Address',
      value: 'Main Square, Hatod, City - 453111',
      link: '#'
    },
    {
      icon: <FiClock className="w-5 h-5" />,
      title: 'Working Hours',
      value: 'Mon - Sat: 9:00 AM - 7:00 PM',
      link: '#'
    }
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl text-white shadow-xl shadow-emerald-500/30"
          >
            <FiCheck className="w-12 h-12" />
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Message Sent!
          </h2>
          <p className="text-gray-500 mb-8">
            Thank you for contacting us. Our team will get back to you within 24 hours.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSubmitted(false)
              setFormData({ full_name: '', email: '', phone: '', subject: '', message: '' })
            }}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30"
          >
            Send Another Message
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs tracking-wider uppercase font-semibold rounded-full mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Contact Information
                </h2>
                <p className="text-gray-500">
                  Reach out to us through any of these channels
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start space-x-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {info.title}
                      </div>
                      <div className="text-gray-800 font-medium mt-1">
                        {info.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* WhatsApp Button */}
              <motion.a
                href="https://wa.me/918305551215"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-3 w-full py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all"
              >
                <FiMessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </motion.a>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Full Name *
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
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Email *
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Phone
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
                        Subject *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select Subject</option>
                        <option value="Buy Property">Buy Property</option>
                        <option value="Sell Property">Sell Property</option>
                        <option value="Rent Property">Rent Property</option>
                        <option value="Investment Inquiry">Investment Inquiry</option>
                        <option value="Project Inquiry">Project Inquiry</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Message *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none"
                      rows="6"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="bg-gray-100 rounded-2xl overflow-hidden">
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FiMapPin className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-gray-500">
                  Interactive map available with Google Maps API integration
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
