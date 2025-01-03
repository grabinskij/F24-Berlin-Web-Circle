import { useState } from "react";
import styles from "./ProductGallery.module.css";
import ProductGalleryPopup from "../ProductGalleryPopup/ProductGalleryPopup";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";

const ProductGallery = ({
  bigImage,
  smallTopLeftImage,
  smallTopRightImage,
  smallBottomLeftImage,
  smallBottomRightImage,
}) => {
  const [showPopupProductGallery, setShowPopupProductGallery] = useState(false);
  const showPopupHandler = () => {
    setShowPopupProductGallery((prevState) => !prevState);
  };

  const { t } = useTranslation();

  const windowWidth = useWindowSize();

  const roomsData = [
    {
      id: 1,
      name: t('product.livingArea'),
      image: bigImage
    },
    {
      id: 2,
      name: t('product.kitchen'),
      image: smallTopLeftImage
    },
    {
      id: 3,
      name: t('product.fullBathroom'),
      image: smallTopRightImage
    },
    {
      id: 4,
      name: t('product.exterior'),
      image: smallBottomLeftImage
    },
    {
      id: 5,
      name: t('product.bedroomArea'),
      image: smallBottomRightImage
    },
  ];

  return (
    <div className={styles.productGalleryMain}>
      <div className={styles.bigImgContainer}>
        <img
          onClick={showPopupHandler}
          src={bigImage}
          alt="bigImage"
          className={styles.bigImage}
        />
        { windowWidth < 768 && (
          <div className={styles.smallScreenShowPhotosBtn} onClick={showPopupHandler}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              className={styles.showPhotosBtnSvg}
            >
              <path
                fillRule="evenodd"
                d="M3 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
              ></path>
            </svg>
            <span>{t('product.showAllPhotos')}</span>
          </div>
        )}
      </div>
      { windowWidth > 768 && (
      <div className={styles.smallImgsContainer}>
        <img
          onClick={showPopupHandler}
          src={smallTopLeftImage}
          alt="small top left image"
          className={styles.smallImgLeft}
        />
        <img
          onClick={showPopupHandler}
          src={smallTopRightImage}
          alt="small top right image"
          className={styles.smallImgRightTop}
        />
        <img
          onClick={showPopupHandler}
          src={smallBottomLeftImage}
          alt="small bottom left image"
          className={styles.smallImgLeft}
        />
        <div className={styles.showPhotosBtnContainer}>
          <img
            onClick={showPopupHandler}
            src={smallBottomRightImage}
            alt="small bottom right image"
            className={styles.smallImgRightBottom}
          />
          <div className={styles.showPhotosBtn} onClick={showPopupHandler}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              className={styles.showPhotosBtnSvg}
            >
              <path
                fillRule="evenodd"
                d="M3 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
              ></path>
            </svg>
            <span>{t('product.showAllPhotos')}</span>
          </div>
        </div>
      </div>
      )}
      {showPopupProductGallery && (
        <ProductGalleryPopup
          showPopupHandler={showPopupHandler}
          rooms={roomsData}
        />
      )}
    </div>
  );
};

export default ProductGallery;
