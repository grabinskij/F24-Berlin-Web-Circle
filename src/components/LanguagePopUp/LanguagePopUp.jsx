import Styles from './LanguagePopUp.module.css'
import { useState } from 'react'
import Popup from '../ReservationCard/PopUp/PopUp'
import useOutsideClick from '../../hooks/useOutsideClick'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'


const LanguagePopUp = ({ 
  onCloseClick, 
  isVisible, 
  onCurrencyChange, 
  setExchangeRateUSD, 
  setExchangeRateUAH,
  selectedCurrency, 
  setSelectedCurrency
}) => {
  const [isLanguageSelected, setIsLanguageSelected] = useState(true)
  const [searchParams] = useSearchParams()
  // const [selectedCurrency, setSelectedCurrency] = useState('Euro') 
  // const [exchangeRateUSD, setExchangeRateUSD] = useState(1) 
  // const [exchangeRateUAH, setExchangeRateUAH] = useState(1)

  // const onCurrencyChange = (currency, exchangeRate) => {
  //   if (currency === 'USD') {
  //     setExchangeRateUSD(exchangeRate); 
  //   } else if (currency === 'UAH') {
  //     setExchangeRateUAH(exchangeRate);  
  //   } else {
  //     setExchangeRateUSD(1);
  //     setExchangeRateUAH(1);
  //   }
  // }
  
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
  const location = useLocation()

  const changeLanguage = async (lng) => {
    try {
      i18n.changeLanguage(lng);
      localStorage.setItem('language', lng);

      const params = new URLSearchParams(searchParams)
      params.set('lng', lng)
      navigate({
        pathname: location.pathname,
        search: createSearchParams(params).toString(),
      })

      const response = await axios.get(`http://localhost:8800/setLanguage`, {
        params: { lng }, 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        console.log("Language cookie set to", lng);
        navigate({
          pathname: location.pathname,
          search: createSearchParams(params).toString(),
        }, { replace: true }); 

        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        console.error("Failed to set language on the server");
      }
    } catch (error) {
      console.error("Failed to change language", error.response?.data || error.message);
    }
  };

  const handleCurrencyChange = async (currencyKey, currencyName) => {

    if (currencyKey === 'EUR') {
      setExchangeRateUSD(1);
      setExchangeRateUAH(1);
      setSelectedCurrency(currencyName);
      onCurrencyChange(currencyKey, 1);
      console.log(`Exchange rate for ${currencyName}: 1 (default)`);
      // return;
    }

    try {
      setSelectedCurrency(currencyName);

      const response = await axios.get(`http://localhost:8800/api/currency`, {
        params: { selectedCurrency: currencyKey }
      });

      const rateEURtoUSD = response.data.quotes.EURUSD.end_rate;
      const rateEURtoUAH = response.data.quotes.EURUAH.end_rate;

      localStorage.setItem('exchangeRateUSD', rateEURtoUSD);
      localStorage.setItem('exchangeRateUAH', rateEURtoUAH);
      localStorage.setItem('selectedCurrency', currencyKey);
      // if (currencyKey === 'USD') {
      //   setExchangeRateUSD(rateEURtoUSD); 
      //   console.log(`Exchange rate for ${currencyName}: ${rateEURtoUSD}`);
      // } else if (currencyKey === 'UAH') {
      //   setExchangeRateUAH(rateEURtoUAH);  
      //   console.log(`Exchange rate for ${currencyName}: ${rateEURtoUAH}`);
      // }
  
      onCurrencyChange(currencyKey, currencyKey === 'USD' ? rateEURtoUSD : currencyKey === 'UAH' ? rateEURtoUAH : 1);
  
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };
  

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
  };

  // const currency = {
  //   Euro: 'Euro',
  //   UsDollar: 'US Dollar',
  //   Hryvnia: 'Гривня',
  // }

  // const currencyCodes = {
  //   ["Euro"]: 'EUR',
  //   ["United States Dollar"]: 'USD',
  //   ["Ukrainian Hryvnia"]: 'UAH',
  // }
  const currencies = {
    Euro: { label: 'Euro', code: 'EUR' },
    'United States Dollar': { label: 'US Dollar', code: 'USD' },
    'Ukrainian Hryvnia': { label: 'Hryvnia', code: 'UAH' },
  };

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
                  <button onClick={() => handleCurrencyChange(code, label)}
                          className={selectedCurrency === label ? Styles.selected : ''}
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
