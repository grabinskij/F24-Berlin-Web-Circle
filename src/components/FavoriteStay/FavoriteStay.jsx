import StarRating from "../StarRating/StarRating";
import "./FavoriteStay.css"
import Left from "../../assets/fav-badge-left.png";
import Right from "../../assets/fav-badge-right.png";
import { useTranslation } from "react-i18next";

const FavoriteStay = ({ rating = 5, reviews = 71 }) => {

  const { t } = useTranslation();

  return (
    <div className="fav-stay-container">
      <div className="fav-stay-grid-container">
        {/* badge */}
        <div></div>
        <div className="host-badge-container">
          <div className="host-badge-left">
            <img className="left" src={Left} 
            alt="fav-badge-left" />
          </div>

          <div className="host-badge-text">{t('product.guestFavorite')}</div> 

          <div className="host-badge-right">
          <img className="right" src={Right}
            alt="fav-badge-right" />
          </div>
        </div>

        <div></div>
        <div className="fav-stay-seperator"></div>

        {/* Start ratings */}
        <div></div>
        <div className="ratings-container">
          <span className="space-above"></span>
          <div className="rating-value">{rating}</div>
          <div className="rating-stars">
            <StarRating rating={rating} />
          </div>
        </div>

        <div></div>
        <div className="fav-stay-seperator"></div>

        {/* reviews */}
        <div></div>
        <div className="reviews-container">
        <span className="space-above"></span>
          <div className="review-value">{reviews}</div>
          <div className="reviews-link">
            <a href="#"></a>{t('product.reviews', { count: reviews })}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default FavoriteStay;
