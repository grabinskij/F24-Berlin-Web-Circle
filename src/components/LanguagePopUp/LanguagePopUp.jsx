import Styles from './LanguagePopUp.module.css'
import { useState } from 'react'
import Popup from '../ReservationCard/PopUp/PopUp'
import useOutsideClick from '../../hooks/useOutsideClick'

const LanguagePopUp = ({ onCloseClick, isVisible }) => {
  const [isLanguageSelected, setIsLanguageSelected] = useState(true)

  const languageRef = useOutsideClick(onCloseClick)

  const handelLanguageClick = () => {
    setIsLanguageSelected(true)
  }
  const handelCurrencyClick = () => {
    setIsLanguageSelected(false)
  }

  const languages = {
    English: 'English',
    German: 'Deutsch',
    Ukrainian: 'Українська',
  }

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
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  )
}
export default LanguagePopUp
