import Popup from '../PopUp/PopUp'
import { CloseIcon } from '../../../icons'
import AnimalServiceImg from '../../../assets/images/service-images/animal-service.jpg'
import styles from './GuestCountPopUp.module.css'
import { useTranslation } from 'react-i18next'

const GuestCountPopUp = ({ isVisible, onClose, showGuests, setShowGuests, isSearchWhoDropdown }) => {

  const { t } = useTranslation();

  if (!showGuests && !isSearchWhoDropdown) {
    setShowGuests(true)
  } 

  return (
    <Popup isVisible={isVisible} onClose={onClose}>
      <div className={styles.header}>
        <button className={styles.button} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <section className={styles.contentContainer}>
        <div className={styles.imageContainer}>
          <img
            src={AnimalServiceImg}
            className={styles.image}
            alt="Animal Service"
          />
        </div>
        <div className={styles.text}>
          <h2 className={styles.title}>{t('product.serviceAnimals')}</h2>
          <p>
            {t('product.serviceAnimalNote')}
          </p>
          <p>
            {t('product.emotionalSupportAnimal')}
          </p>
        </div>
      </section>
    </Popup>
  )
}

export default GuestCountPopUp
