import styles from "./MapView.module.css";
import MapDisplay from "../MapDisplay/MapDisplay";
// import ArrowRightIcon from "../../icons/ArrowRightIcon";
import { useTranslation } from "react-i18next";

const MapView = ({ address, addressDescription, lat, lon }) => {

  const { t } = useTranslation();

  return (
    <div className={styles.mapWiewContainer}>
      <h2 className={styles.whereYouBe}>{t('product.whereYoullBe')}</h2>
      <div className={styles.mapContainer}>
        <MapDisplay lat={lat} lng={lon} address={address} addressDescription={addressDescription} />
      </div>
      <div className={styles.addressContainer}>
        <h4 className={styles.addressLocation}>{address}</h4>
        <span className={styles.addressDescription}>{addressDescription}</span>
      </div>
      {/* <div className={styles.arrowRightContainer}>
        <span className={styles.showMore}>Show more</span>
        <ArrowRightIcon />
      </div> */}
    </div>
  );
};

export default MapView;
