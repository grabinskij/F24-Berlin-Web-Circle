import styles from "./MeetYourHostRight.module.css";
import paymentWarningIcon from "../../../assets/PaymentWarningIcon.png";
import { useTranslation } from "react-i18next";

const MeetYourHostRight = ({ name, responseRate, responseTime }) => {

  const { t } = useTranslation();

  return (
    <div className={styles.rightContainer}>
      <div className={styles.superHost}>
        <div className={styles.superHostTitle}>
          <h3>{`${name} ${t('product.superhost')}`}</h3>
        </div>
        <div className={styles.superHostText}>
          {t('product.superhostsDescription')}
        </div>
      </div>
      <div className={styles.hostDetails}>
        <div className={styles.hostDetailsTitle}>
          <h3>{t('product.hostDetails')}</h3>
        </div>
        <div className={styles.hostDetailsText}>
          <div>{`${t('product.responseRate')}: ${responseRate}`}</div>
          <div>{`${t('product.respondsWithin')} ${responseTime}`}</div>
        </div>
      </div>
      <div className={styles.messageHost}>
        <button>{t('product.messageHost')}</button>
      </div>
      <div className={styles.paymentInfo}>
        <div className={styles.paymentWarningIcon}>
          <img src={paymentWarningIcon} alt="payment-warning-icon" />
        </div>
        <div className={styles.paymentInfoText}>
          {t('product.paymentProtection')}
        </div>
      </div>
    </div>
  );
};

export default MeetYourHostRight;
