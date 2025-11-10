import { createContext, useContext, useState, useEffect } from 'react'
import i18n from '../i18n/config'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    return saved || i18n.language || 'en'
  })

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguage(savedLanguage)
    i18n.changeLanguage(savedLanguage)
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = savedLanguage
  }, [])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = lang
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
