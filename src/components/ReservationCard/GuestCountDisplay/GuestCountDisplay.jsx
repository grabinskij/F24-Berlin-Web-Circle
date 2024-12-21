import { useTranslation } from 'react-i18next';
import { DownArrow, UpArrow } from '../../../icons'
import styles from './GuestCountDisplay.module.css'

const GuestCountDisplay = ({
  showGuests,
  adultsAndChildrenCount,
  infantsCount,
  petsCount,
}) => {

  const { t } = useTranslation();

  return (
  <div className={styles.guestsPickerSectionContent}>
    <label>{t('search.guestsBig')}</label>
    <div className={styles.guestCountWrapper}>
      <div>
      {adultsAndChildrenCount ? `${adultsAndChildrenCount} ${t('search.guests', { count: adultsAndChildrenCount })}` : ''}
      {infantsCount ? `, ${infantsCount} ${t('search.infants', { count: infantsCount })}` : ''}
      {petsCount ? `, ${petsCount} ${t('search.pets', { count: petsCount })}` : ''}
    </div>
    {showGuests ? <UpArrow /> : <DownArrow />}
    </div>
  </div>
  )
}

export default GuestCountDisplay