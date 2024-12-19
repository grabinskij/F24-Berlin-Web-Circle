import styles from "./ButtonBeAHost.module.css"
import { useTranslation } from 'react-i18next';

const ButtonBeAHost = () => {
  const { t } = useTranslation();
  return (
    <div >
      <button className={styles.hostButton}>
      {t('search.airbnbYourHome')}
      </button>
    </div>
  )
}

export default ButtonBeAHost
