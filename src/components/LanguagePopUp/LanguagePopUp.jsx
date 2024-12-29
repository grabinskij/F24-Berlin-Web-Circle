import Styles from './LanguagePopUp.module.css'
import { useEffect, useState } from 'react'
import Popup from '../ReservationCard/PopUp/PopUp'
import useOutsideClick from '../../hooks/useOutsideClick'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

const LanguagePopUp = ({
  onCloseClick,
  isVisible,
  onCurrencyChange,
  setExchangeRateUSD,
  setExchangeRateUAH,
  setSelectedCurrency,
  selectedCurrency,
}) => {
  const [isLanguageSelected, setIsLanguageSelected] = useState(true)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setSelectedCurrency(localStorage.getItem('selectedCurrency'))
  }, [])

  const changeLanguage = async (lng) => {
    try {
      i18n.changeLanguage(lng)
      localStorage.setItem('language', lng)

      const response = await axios.get(`http://localhost:8800/setLanguage`, {
        params: { lng },
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        setTimeout(() => {
          window.location.reload()
        }, 50)
      } else {
        console.error('Failed to set language on the server')
      }
    } catch (error) {
      console.error(
        'Failed to change language',
        error.response?.data || error.message
      )
    }
  }

  const handleCurrencyChange = async (currencyKey) => {
    if (currencyKey === 'EUR') {
      setExchangeRateUSD(1)
      setExchangeRateUAH(1)
      setSelectedCurrency(currencyKey)
      onCurrencyChange(currencyKey, 1)
    }

    try {
      setSelectedCurrency(currencyKey)

      const response = await axios.get(`http://localhost:8800/api/currency`, {
        params: { selectedCurrency: currencyKey },
      })

      const rateEURtoUSD = response.data.quotes.EURUSD.end_rate
      const rateEURtoUAH = response.data.quotes.EURUAH.end_rate

      const roundedRateEURtoUSD = Math.floor(rateEURtoUSD * 100) / 100
      const roundedRateEURtoUAH = Math.floor(rateEURtoUAH * 100) / 100

      localStorage.setItem('exchangeRateUSD', roundedRateEURtoUSD)
      localStorage.setItem('exchangeRateUAH', roundedRateEURtoUAH)
      localStorage.setItem('selectedCurrency', currencyKey)

      onCurrencyChange(
        currencyKey,
        currencyKey === 'USD'
          ? roundedRateEURtoUSD
          : currencyKey === 'UAH'
          ? roundedRateEURtoUAH
          : 1
      )

      if (response.status === 200) {
        setTimeout(() => {
          window.location.reload()
        }, 50)
      } else {
        console.error('Failed to set currency on the server')
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
    }
  }

  const languageRef = useOutsideClick(onCloseClick)

  const handelLanguageClick = () => {
    setIsLanguageSelected(true)
  }
  const handelCurrencyClick = () => {
    setIsLanguageSelected(false)
  }

  const languages = {
    English: { label: 'English', code: 'en' },
    German: { label: 'Deutsch', code: 'de' },
    Ukrainian: { label: 'Українська', code: 'ukr' },
  }

  const currencies = {
    Euro: { label: 'Euro', code: 'EUR' },
    'United States Dollar': { label: 'US Dollar', code: 'USD' },
    'Ukrainian Hryvnia': { label: 'Hryvnia', code: 'UAH' },
  }

  const itemsToRender = isLanguageSelected ? languages : currencies

  return (
    <Popup onCloseClick={onCloseClick} isVisible={isVisible}>
      <div ref={languageRef}>
        <div className={Styles.container}>
          <div className={Styles.tabContainer}>
            <div
              className={
                isLanguageSelected
                  ? Styles.languageButton
                  : Styles.languageButtonDisabled
              }
              onClick={handelLanguageClick}
            >
              <p>{t('search.languageAndRegion')}</p>
            </div>
            <div
              className={
                isLanguageSelected
                  ? Styles.currencyButtonDisabled
                  : Styles.currencyButton
              }
              onClick={handelCurrencyClick}
            >
              <p>{t('search.currency')}</p>
            </div>
          </div>
          <div className={Styles.selectionIndicatorContainer}>
            <div
              className={
                isLanguageSelected
                  ? Styles.languageSelectionIndicatorSelected
                  : Styles.languageSelectionIndicatorNotSelected
              }
            ></div>
            <div
              className={
                isLanguageSelected
                  ? Styles.currencySelectionIndicatorNotSelected
                  : Styles.currencySelectionIndicatorSelected
              }
            ></div>
          </div>
        </div>
        <div className={Styles.langCurrencyContainer}>
          <div className={Styles.langCurrencyWrapper}>
            {Object.entries(itemsToRender).map(([key, { label, code }]) => (
              <div key={key} className={Styles.item}>
                {isLanguageSelected ? (
                  <button
                    onClick={() => changeLanguage(code || 'en')}
                    className={i18n.language === code ? Styles.selected : ''}
                  >
                    {label || key}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleCurrencyChange(code, label)
                      onCloseClick()
                    }}
                    className={selectedCurrency === code ? Styles.selected : ''}
                  >
                    {label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  )
}
export default LanguagePopUp
