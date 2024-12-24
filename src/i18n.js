import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import de from './locales/de.json'
import ukr from './locales/ukr.json'
import LanguageDetector from 'i18next-browser-languagedetector/cjs'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    ukr: { translation: ukr },
  },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
    // eslint-disable-next-line no-unused-vars
    format: function (value, format, lng) {
      if (format === 'uppercase') return value.toUpperCase();
      if (format === 'lowercase') return value.toLowerCase();
      if (format === 'capitalize') return `${value.substr(0, 1).toUpperCase()}${value.substr(1)}`;
      return value;
    },
  },
  pluralSeparator: '_',
  pluralization: true, 
  keySeparator: '.',
  nsSeparator: ':',
})

export default i18n
