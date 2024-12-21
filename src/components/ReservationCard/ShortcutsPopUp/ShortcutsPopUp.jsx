import { useTranslation } from 'react-i18next';
import Popup from '../PopUp/PopUp'
import ShortcutItem from './ShortcutItem/ShortcutItem'
import styles from './ShortcutsPopUp.module.css'

const ShortcutsPopUp = ({ isVisible, onClose, showCalendar, setShowCalendar }) => {

const { t } = useTranslation();

if (!showCalendar) {
  setShowCalendar(true)
}

  return (
    <Popup isVisible={isVisible} onClose={onClose}>
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h2>{t('product.keyboardShortcuts')}</h2>
        </div>
        <main className={styles.main}>
          <ShortcutItem
            symbols="&crarr;"
            description={t('product.selectDateInFocus')}
          />
          <ShortcutItem
            symbols={['\u2190', '\u2192']}
            description={t('product.moveBackwardDay')}
          />
          <ShortcutItem
            symbols={['\u2191', '\u2193']}
            description={t('product.moveBackwardWeek')}
          />
          <ShortcutItem symbols="PGUP/PGDN" description={t('product.switchMonths')} />
          <ShortcutItem
            symbols="HOME/END"
            description={t('product.goToFirstLastDay')}
          />
          <ShortcutItem symbols="?" description={t('product.openThisPanel')} />
        </main>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={onClose}>
            {t('product.backToCalendar')}
          </button>
        </div>
      </div>
    </Popup>
  )
}

export default ShortcutsPopUp