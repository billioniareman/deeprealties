import { motion } from 'framer-motion'
import { FiMessageCircle } from 'react-icons/fi'

const WhatsAppButton = () => {
  const phoneNumber = '918305551215' // Replace with actual number
  const message = 'Hello! I am interested in your properties.'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
        
        {/* Button */}
        <div className="relative w-14 h-14 flex items-center justify-center bg-green-500 rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <FiMessageCircle className="w-7 h-7 text-white" />
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
        >
          <div className="px-4 py-2 bg-onyx-900 text-ivory-100 text-sm rounded shadow-lg">
            Chat with us!
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-onyx-900 rotate-45" />
          </div>
        </motion.div>
      </motion.div>
    </motion.a>
  )
}

export default WhatsAppButton

