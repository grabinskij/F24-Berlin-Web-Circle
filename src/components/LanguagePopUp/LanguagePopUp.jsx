import Styles from './LanguagePopUp.module.css'
import { useState } from 'react'
import Popup from '../ReservationCard/PopUp/PopUp'
import useOutsideClick from '../../hooks/useOutsideClick'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'


const LanguagePopUp = ({ onCloseClick, isVisible }) => {
  const [isLanguageSelected, setIsLanguageSelected] = useState(true)
  const [searchParams] = useSearchParams()

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


//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Failed to set language on server');
//     }
//     return response.json();
//   })
//   .then(() => {
//     // Force reload i18n with new language
//     i18n.reloadResources([lng]).then(() => {
//       window.location.reload(); // Optional: only if you need a full page refresh
//     });
//   })
//   .catch(error => {
//     console.error("Failed to set language on server:", error);
//   });
// } catch (error) {
//   console.error("Failed to change language:", error);
// }


  const handleCurrencyChange = (currency) => {
    console.log(`Currency changed to: ${currency}`);
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

  const currency = {
    Euro: 'Euro',
    UsDollar: 'US Dollar',
    Hryvnia: 'Гривня',
  }

  const itemsToRender = isLanguageSelected ? languages : currency

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
            {Object.entries(itemsToRender).map(([key, value]) => (
              <div key={key} className={Styles.item}>
             {isLanguageSelected ? (
                  <button
                    onClick={() => changeLanguage(value.code || 'en')}
                    className={i18n.language === value.code ? Styles.selected : ''} 
                  >
                    {value.label || value}
                  </button>
                ) : (
                  <button onClick={() => handleCurrencyChange(key)}>{value}</button>
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
