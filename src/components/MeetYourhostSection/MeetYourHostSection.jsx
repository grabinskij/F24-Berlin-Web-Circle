import MeetYourHostRight from "./MeetYourHostRight/MeetYourHostRight";
import styles from "./MeetYourHostSection.module.css";
import MeetYourHostLeft from "./MeetYourHostLeft/MeetYourHostLeft";
import { useTranslation } from "react-i18next";

const MeetYourHostSection = ({
  name,
  image,
  role,
  verified,
  reviews,
  rating,
  yearsHosting,
  profileText
}) => {

  const { t } = useTranslation();

  return (
    <div className={styles.meetYourHostSection}>
      <div className={styles.meetYourHostSectionContainer}>
        <div className={styles.meetYourHostTitle}>
          <h2>{t('product.meetYourHost')}</h2>
        </div>
        <div className={styles.meetYourHostSectionInnerContainer}>
          <MeetYourHostLeft
            name={name}
            image={image}
            role={role}
            verified={verified}
            reviews={reviews}
            rating={rating}
            yearsHosting={yearsHosting}
            profileText={profileText}
          />
          <MeetYourHostRight
            name={name}
            responseRate="100%"
            responseTime={t('product.hour')}
          />
        </div>
      </div>
    </div>
  );
};

export default MeetYourHostSection;
