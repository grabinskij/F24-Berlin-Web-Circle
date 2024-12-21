import styles from "./MeetYourHostLeft.module.css";
// import ArrowRightIcon from "../../../icons/ArrowRightIcon";
import {
  BusinessIcon,
  LanguageIcon,
  ReviewsNumberIcon,
  RoleIcon,
  VerifiedIcon
} from "../../../icons";
import { useTranslation } from "react-i18next";

const MeetYourHostLeft = ({
  image,
  name,
  role,
  verified,
  reviews,
  rating,
  yearsHosting,
  profileText,
}) => {

  const { t } = useTranslation();
 
  const languagesAndBusinessData = [
    { icon: LanguageIcon, text: t('product.speaksLanguages') },
    { icon: BusinessIcon, text: t('product.business') }
  ];

  const capitalize = (str) => {
    if (!str || typeof str !== 'string') return ''; 
    return str.trim().charAt(0).toUpperCase() + str.slice(2).toLowerCase();
  };


  return (
    <div className={styles.hostInfoContainer}>
      <div className={styles.mainContainer}>
        <div className={styles.leafSide}>
          <div className={styles.roundPhotoComponent}>
            <img className={styles.personImg} src={image} alt={name} />
          </div>
          {verified && (
            <div className={styles.verifiedContainer}>
              <VerifiedIcon />
            </div>
          )}
          <div className={styles.personRoleContainer}>
            <h2 className={styles.personInfo}>{name}</h2>
            <div className={styles.roleContainer}>
              {role === "Superhost" ? <RoleIcon /> : ""}
              <span className={styles.role}>{t('product.superhosts', role)}</span>
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.reviewsContainer}>
            <span className={styles.reviewsNumbers}>{reviews}</span>
            <span className={styles.reviewsText}>{capitalize(t('product.reviews', { count: reviews}))}</span>
          </div>
          <hr className={styles.borders} />
          <div className={styles.reviewsContainer}>
            <div className={styles.reviewsAndStar}>
              <span className={styles.reviewsNumbers}>{rating}</span>
              <ReviewsNumberIcon />
            </div>
            <span className={styles.reviewsText}>{t('product.rating')}</span>
          </div>
          <hr className={styles.borders} />
          <div className={styles.reviewsContainer}>
            <span className={styles.reviewsNumbers}>{yearsHosting}</span>
            <span className={styles.reviewsText}>{capitalize(t('product.years', {count: yearsHosting}))} {t('product.hosting')}</span>
          </div>
        </div>
      </div>
      <div className={styles.personTextContainer}>
        <div className={styles.personText}>
          <div className={styles.languagesAndBusiness}>
            {languagesAndBusinessData.map((item, index) => (
              <div key={index} className={styles.lgAndBsText}>
                <div className={styles.lgIcon}>
                  <item.icon />
                </div>
                <div className={styles.lgText}>{item.text}</div>
              </div>
            ))}
          </div>
          <div className={styles.profileText}>{profileText}</div>
        </div>
        {/* <div className={styles.arrowRightContainer}>
          <span className={styles.showMore}>{t('product.showMore')}</span>  
          <ArrowRightIcon />
        </div> */}
      </div>
    </div>
  );
};

export default MeetYourHostLeft;
