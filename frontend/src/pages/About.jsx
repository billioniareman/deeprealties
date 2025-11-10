import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiHome, FiUsers, FiTrendingUp, FiAward, FiShield, FiTarget, FiZap, FiHeart, FiArrowRight } from 'react-icons/fi'

const About = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: <FiHome className="w-8 h-8" />,
      title: t('home.features.premium.title'),
      description: t('home.features.premium.description'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: t('home.features.expert.title'),
      description: t('home.features.expert.description'),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: t('home.features.insights.title'),
      description: t('home.features.insights.description'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: t('home.features.trusted.title'),
      description: t('home.features.trusted.description'),
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const values = [
    {
      icon: <FiShield className="w-8 h-8" />,
      title: t('about.values.integrity.title'),
      description: t('about.values.integrity.description'),
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description'),
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: t('about.values.customer.title'),
      description: t('about.values.customer.description'),
      color: 'from-red-500 to-orange-600'
    }
  ]

  const stats = [
    { value: '1000+', label: t('home.stats.properties'), delay: 0 },
    { value: '500+', label: t('home.stats.customers'), delay: 0.1 },
    { value: '50+', label: t('home.stats.cities'), delay: 0.2 }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-navy via-primary-blue to-primary-emerald text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80')`,
          }}
        ></motion.div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            {t('about.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            {t('about.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              {t('about.mission')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
              {t('about.missionText1')}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              {t('about.missionText2')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-emerald text-white rounded-lg hover:from-primary-navy hover:to-primary-blue transition-all shadow-lg font-semibold flex items-center space-x-2"
            >
              <span>Explore Properties</span>
              <FiArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl group"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80"
              alt="Modern building"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              {t('about.whyChooseUs')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xl">
              {t('about.whyChooseUsSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Our Core Values
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-xl">
            The principles that guide everything we do
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg`}
              >
                {value.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-primary-navy via-primary-blue to-primary-emerald py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: stat.delay }}
                className="text-white"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + stat.delay, type: 'spring' }}
                  className="text-6xl md:text-7xl font-bold mb-4"
                >
                  {stat.value}
                </motion.div>
                <div className="text-xl md:text-2xl text-gray-200 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-xl">
            The experts behind DeepRealties
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'John Smith', role: 'CEO & Founder', image: 'https://i.pravatar.cc/150?img=12' },
            { name: 'Emily Johnson', role: 'Head of Sales', image: 'https://i.pravatar.cc/150?img=47' },
            { name: 'Michael Chen', role: 'Tech Lead', image: 'https://i.pravatar.cc/150?img=33' }
          ].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700"
            >
              <motion.img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary-blue"
                whileHover={{ scale: 1.1 }}
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {member.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default About
