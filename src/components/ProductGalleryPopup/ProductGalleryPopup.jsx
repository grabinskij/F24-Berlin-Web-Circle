import styles from "./ProductGalleryPopup.module.css";
import LeftArrowIcon from "../../icons/LeftArrowIcon";
import ShareIcon from "../../icons/ShareIcon";
import HeartIcon from "../../icons/HeartIcon";
import { useTranslation } from "react-i18next";

const ProductGalleryPopup = ({ showPopupHandler, rooms }) => {

  const { t } = useTranslation();

  function handleShare() {
    alert("Share this experience");
  }

  function handleSave() {
    alert("Save this experience");
  }

  return (
    <div className={styles.popupMainContainer}>
      <div className={styles.header}>
        <LeftArrowIcon showPopupHandler={showPopupHandler} />
        <div className={styles.saveShareIconContainer}>
          <div className={styles.shareContainer} onClick={handleShare}>
            <ShareIcon height={30} width={30} fill="black" />
            <span className={styles.shareSaveText}>{t('product.share')}</span>
          </div>
          <div className={styles.SaveContainer} onClick={handleSave}>
            <HeartIcon />
            <span className={styles.shareSaveText}>{t('product.save')}</span>
          </div>
        </div>
      </div>
      <div className={styles.subheaderContainer}>
        <div className={styles.smallTopImgsContainer}>
          <span className={styles.photoTourText}>{t('product.photoTour')}</span>
          <div className={styles.smallTopImgsAllContainers}>
            {rooms.map((room) => (
              <a
                href={`#${room.name}`}
                key={room.id}
                className={styles.smallTopImgsMain}
              >
                <img
                  src={room.image}
                  alt={room.name}
                  className={styles.smallTopImgs}
                />
                <span className={styles.smallTopImgsName}>{room.name}</span>
              </a>
            ))}
          </div>
          {rooms.map((room) => (
            <a
              id={room.name}
              key={room.id}
              className={styles.bottomImagesContainer}
            >
              <span className={styles.photoTourText}>{room.name}</span>
              <img
                src={room.image}
                alt={room.name}
                className={styles.bottomImages}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGalleryPopup;
