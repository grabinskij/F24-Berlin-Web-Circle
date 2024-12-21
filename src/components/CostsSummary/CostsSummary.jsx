import { useTranslation } from 'react-i18next';
import styles from './CostsSummary.module.css'

const CostsSummary = ({
  pricePerNight,
  airbnbServiceFee,
  cleaningFee,
  longStayDiscount,
  nights,
  basePrice,
  isDiscount,
  totalPrice
}) => {

  const { t } = useTranslation();

  return (
    <div className={styles.priceSummary}>
      <div className={styles.infoSection}>
        <div>{t('product.noChargeYet')}</div> 
        <div>{t('product.priceIncludes')}.</div>
      </div>
      <div className={styles.pricingDetails}>
        <div className={styles.priceItemsContainer}>
          <div className={styles.priceItem}>
            <span>{`€ ${pricePerNight} x ${nights} ${t('product.nights', {count: nights})}`}</span>
            <span>{`€ ${basePrice}`}</span>
          </div>
          {longStayDiscount > 0 && isDiscount && (
            <div className={styles.priceItem}>
              <span>{t('product.long_stay_discount')}</span>
              <span
                className={styles.discountPriceItem}
              >{`-€ ${longStayDiscount}`}</span>
            </div>
          )}
          {cleaningFee > 0 && (
            <div className={styles.priceItem}>
              <span>{t('product.cleaning_fee')}</span>
              <span>{`€ ${cleaningFee}`}</span>
            </div>
          )}
          {airbnbServiceFee > 0 && (
            <div className={styles.priceItem}>
              <span>{t('product.airbnb_service_fee')}</span>
              <span>{`€ ${airbnbServiceFee}`}</span>
            </div>
          )}
        </div>
        <div className={styles.totalPrice}>
          <strong>{t('product.total')}</strong>
          <strong>{`€ ${totalPrice}`}</strong>
        </div>
      </div>
    </div>
  )
}

export default CostsSummary
