import Styles from './LanguagePopUp.module.css'
import { useState } from 'react'
import Popup from '../ReservationCard/PopUp/PopUp'
import useOutsideClick from '../../hooks/useOutsideClick'
import { useTranslation } from 'react-i18next'

const LanguagePopUp = ({ onCloseClick, isVisible }) => {
  const [isLanguageSelected, setIsLanguageSelected] = useState(true)

  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    try {
      i18n.changeLanguage(lng);
      console.log("Language changed to:", lng);
    } catch (error) {
      console.error("Failed to change language", error);
    }
  };

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
              <p>Language and region</p>
            </div>
            <div
              className={
                isLanguageSelected
                  ? Styles.currencyButtonDisabled
                  : Styles.currencyButton
              }
              onClick={handelCurrencyClick}
            >
              <p>Currency</p>
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
