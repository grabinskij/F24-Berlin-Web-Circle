import { useState } from "react";
import styles from "./PriceRangeModal.module.css";
import PriceRangeFilter from "../priceRange/PriceRangeFilter";
import { CloseIcon } from "../../icons/CloseIcon";
import { useTranslation } from "react-i18next";

const PriceRangeModal = ({ isOpen, onClose, histogramData, className, priceRangeRef }) => {
  const [bedrooms, setBedrooms] = useState(0); 
  const [beds, setBeds] = useState(0); 
  const [bathrooms, setBathrooms] = useState(0); 

  const { t } = useTranslation();

  // Increment and Decrement Handlers
  const increment = (setter, value) => setter(value + 1);
  const decrement = (setter, value) => {
    if (value > 0) setter(value - 1);
  };

  if (!isOpen) return null;

  return (
    <div className={className}>
      <div className={styles.priceModal} ref={priceRangeRef}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.customCloseWrapper} onClick={onClose}>
            <CloseIcon />
          </div>
          <h4>{t("categories.filters")}</h4>
        </div>

       <div className={styles.range}>
        <PriceRangeFilter histogramData={histogramData} />
        </div>

        {/* Rooms and Beds Section */}
        <div className={styles.roomsSection}>
          <h4 className={styles.title}>{t("priceRangeModal.roomsBeds")}</h4>

          {/* Bedrooms Section */}
          <div className={styles.section}>
            <div className={styles.label}>
              <h4 className={styles.subtitle}>{t("priceRangeModal.bedrooms")}</h4>
            </div>
            <div className={styles.increment}>
              <button className={styles.button} onClick={() => decrement(setBedrooms, bedrooms)}>-</button>
              <h4 className={styles.sub}>{bedrooms || t("priceRangeModal.any")}</h4>
              <button className={styles.button} onClick={() => increment(setBedrooms, bedrooms)}>+</button>
            </div>
          </div>

          {/* Beds Section */}
          <div className={styles.section}>
            <div className={styles.label}>
              <h4 className={styles.subtitle}>{t("priceRangeModal.beds")}</h4>
            </div>
            <div className={styles.increment}>
              <button className={styles.button} onClick={() => decrement(setBeds, beds)}>-</button>
              <h4 className={styles.sub}>{beds || t("priceRangeModal.any")}</h4>
              <button className={styles.button} onClick={() => increment(setBeds, beds)}>+</button>
            </div>
          </div>

          {/* Bathrooms Section */}
          <div className={styles.section}>
            <div className={styles.label}>
              <h4 className={styles.subtitle}>{t("priceRangeModal.bathrooms")}</h4>
            </div>
            <div className={styles.increment}>
              <button className={styles.button} onClick={() => decrement(setBathrooms, bathrooms)}>-</button>
              <h4 className={styles.sub}>{bathrooms || t("priceRangeModal.any")}</h4>
              <button className={styles.button} onClick={() => increment(setBathrooms, bathrooms)}>+</button>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className={styles.submitSection}>
          <button className={styles.clearAll} onClick={() => {
            setBedrooms(0);
            setBeds(0);
            setBathrooms(0);
          }}>
            {t("priceRangeModal.clearAll")}
          </button>
          <button className={styles.buttonModal}>{t("priceRangeModal.showPlaces")}</button>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeModal;
