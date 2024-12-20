import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import de from './locales/de.json'
import ukr from './locales/ukr.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    ukr: { translation: ukr },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
    format: function(value, format) {
      if (format === 'uppercase') {
        return value.toUpperCase();
      }
      return value;
    }
  },
  pluralSeparator: '_',
  pluralization: true, // Enable pluralization
  keySeparator: '.', // Key separator for nested keys (e.g., product.guests)
  nsSeparator: ':', // Namespace separator
})

export default i18n
