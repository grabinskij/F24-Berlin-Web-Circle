import { useEffect, useState } from "react";
import styles from "./ProductDescription.module.css";
import ProductDescriptionPopup from "./ProductDescriptionPopup";
import { useTranslation } from "react-i18next";

const ProductDescription = ({
  descriptionPlace,
  descriptionSpace,
  guestAccess,
  otherThings,
}) => {
  const maxTxtLength = 174;
  const [limitedText, setLimitedText] = useState(descriptionPlace || "");

  const { t } = useTranslation();

  useEffect(() => {
    if (descriptionPlace.length > maxTxtLength) {
      setLimitedText(descriptionPlace.slice(0, maxTxtLength) + "...");
    } else {
      setLimitedText(descriptionPlace);
    }
  }, [descriptionPlace]);

  const [showPopup, setShowPopup] = useState(false);


  const showPopupHandler = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className={styles.productDescription}>
      <div className={styles.productDescriptionText}>
        <span>{descriptionSpace}</span>
        <span className={styles.spaceTitle}>{t('product.theSpace')} </span>
        <span>{limitedText}</span>
      </div>
      <div className={styles.arrowRightContainer} onClick={showPopupHandler}>
        <span className={styles.showMore}>
          {t('product.showMore')} 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            aria-label="arrow-right"
            className={styles.arrowRight}
          >
            <path d="M9.29 15.88L13.17 12 9.29 8.12a.996.996 0 1 1 1.41-1.41l4.59 4.59a.996.996 0 0 1 0 1.41l-4.59 4.59a.996.996 0 1 1-1.41-1.41z" />
          </svg>
        </span>
      </div>
      {showPopup && (
        <ProductDescriptionPopup
          showPopupHandler={showPopupHandler}
          descriptionPlace={descriptionPlace}
          descriptionSpace={descriptionSpace}
          guestAccess={guestAccess}
          otherThings={otherThings}
          showPopup={showPopup}
        />
      )}
    </div>
  );
};

export default ProductDescription;
