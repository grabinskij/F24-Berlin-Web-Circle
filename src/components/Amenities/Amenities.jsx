import { useTranslation } from "react-i18next";
import {
  WifiIcon,
  KitchenIcon,
  BalconyIcon,
  BackyardIcon,
  FirepitIcon,
  WorkspaceIcon,
  SaunaIcon,
  FireplaceIcon,
  ParkingIcon,
  PetsIcon,
} from "../../icons";
import styles from "./Amenities.module.css";
import { useState } from "react";
import Popup from "../ReservationCard/PopUp/PopUp";

const ICONS_MAP = {
  kitchen: <KitchenIcon />,
  workspace: <WorkspaceIcon />,
  sauna: <SaunaIcon />,
  balcony: <BalconyIcon />,
  fireplace: <FireplaceIcon />,
  wifi: <WifiIcon />,
  parking: <ParkingIcon />,
  pets: <PetsIcon />,
  backyard: <BackyardIcon />,
  firepit: <FirepitIcon />,
};

function Amenities({ title, amenities }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const { t } = useTranslation();

  const renderIcon = (type) => {
    return ICONS_MAP[type] || <SaunaIcon />;
  };

  const showAllAmenities = amenities.length > 9;

  const handleModalToggle = () => {
    setModalOpen(!isModalOpen);
  };
  
  return (
    <div className={styles.amenitiesSection}>
      <h2 className={styles.amenitiesSectionTitle}>{title}</h2>
      <ul className={styles.amenitiesContainer}>
        {amenities.slice(0, 10).map((amenity, index) => (
          <li key={index} className={styles.amenitiesList}>
            {renderIcon(amenity.type)}
            <span className={styles.amenitiesDescription}>
              {amenity?.text}
            </span>
          </li>
        ))}
      </ul>
      {showAllAmenities && (
        <button className={styles.showAmenitiesButton} onClick={handleModalToggle}>
          {t('product.showAllAmenities')} 
        </button>
      )}

      {isModalOpen && (
       <Popup isVisible={isModalOpen} onClose={handleModalToggle} className={styles.amenitiesContainer}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleModalToggle}>
              x
            </button>
            <h2 className={styles.ModalTitle}>{t('product.whatThisPlaceOffers')}</h2>
            <ul className={styles.modalAmenitiesContainer}>
              {amenities.map((amenity, index) => (
                <li key={index} className={styles.amenitiesList}>
                  {renderIcon(amenity.type)}
                  <span className={styles.amenitiesDescription}>
                    {amenity?.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Popup>
      )}
    </div>
  );
}

export default Amenities;
