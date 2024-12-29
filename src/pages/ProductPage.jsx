import ReservationCard from "../components/ReservationCard/ReservationCard";
import FavoriteStay from "../components/FavoriteStay/FavoriteStay";
import HostSummary from "../components/HostSummary/HostSummary";
import MapView from "../components/MapView/MapView";
import ProductGallery from "../components/ProductGallery/ProductGallery";
import ProductHighlight from "../components/ProductHighlight/ProductHighlight";
import ProductSummary from "../components/ProductSummary/ProductSummary";
import ProductDescription from "../components/ProductDescription/ProductDescription";
import IconButton from "../components/IconButton/IconButton";
import {
  faArrowUpFromBracket,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ProductPage.module.css";
import AboveProductTitle from "../components/AboveProductTitle/AboveProductTitle";
import ReviewSummary from "../components/ReviewSummary/ReviewSummary";
import ReviewsSection from "../components/ReviewsSection/ReviewsSection";
import MeetYourHostSection from "../components/MeetYourhostSection/MeetYourHostSection";
import Amenities from "../components/Amenities/Amenities";
import { useEffect, useRef, useState } from "react";
import ShortcutsPopUp from '../components/ReservationCard/ShortcutsPopUp/ShortcutsPopUp'
import GuestCountPopUp from '../components/ReservationCard/GuestCountPopUp/GuestCountPopUp'
import { useOutletContext, useParams } from "react-router-dom";
import CalendarBlock from "../components/CalendarBlock/CalendarBlock";
import CalendarBlockPopUp from "../components/CalendarBlock/CalendarBlockPopUp/CalendarBlockPopUp";
import { fetchData } from "../api/fetchProductData";
import { useTranslation } from "react-i18next";


const ProductPage = () => {
  const [isShortcutsPopupVisible, setIsShortcutsPopupVisible] = useState(false)
  const [isGuestCountPopupVisible, setIsGuestCountPopupVisible] = useState(false)
  const [isKeybordPopupVisible, setIsKeybordPopupVisible] = useState(false)
  const [showGuests, setShowGuests] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [place, setPlace] = useState(null);
  const [booking, setBooking] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const {exchangeRateUSD, exchangeRateUAH, selectedCurrency} = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const isInitializedRef = useRef(false)

  const { productId } = useParams();

  const { t } = useTranslation();

  const rateEURUSD = parseFloat(localStorage.getItem('exchangeRateUSD')) || exchangeRateUSD || 1;
  const rateEURUAH = parseFloat(localStorage.getItem('exchangeRateUAH')) || exchangeRateUAH || 1;
  const currency = localStorage.getItem('selectedCurrency') || selectedCurrency || 'EUR';

  useEffect(() => {
    fetchData(setLoading, setError, setPlace, setBooking, productId);
  }, [productId]);

console.log('place', place)
  const toggleShortcutsPopup = () => {
    setIsShortcutsPopupVisible((prevState) => !prevState)
  }

  const toggleGuestCountPopup = () => {
    setIsGuestCountPopupVisible((prevState) => !prevState)
  }

  const toggleKeyboardPopup = () => {
    setIsKeybordPopupVisible((prevState) => !prevState)
  }


  function handleShare() {
    alert("Share this experience");
  }
  function handleSave() {
    alert("Save this experience");
  }

  function handleShowAmenities() {
    alert("Here is the list of all amenities!");
  }

  return (
    <>
    {!!place && <div className={styles.MainProductPage}>
      <div className={styles.ProductPageContainer}>
        <div className={styles.titlePage}>
          {!!place.title && <AboveProductTitle
            title={place.title}
          />}
          <div className={styles.IconButton}>
            <IconButton
              faIcon={faArrowUpFromBracket}
              label={t('product.share')}
              onClick={handleShare}
            />
            <IconButton faIcon={faHeart} label={t('product.save')} onClick={handleSave} />
          </div>
        </div>
        {!!place.images && <ProductGallery
          bigImage={place.images[0]}
          smallTopLeftImage={place.images[1]}
          smallTopRightImage={place.images[2]}
          smallBottomLeftImage={place.images[3]}
          smallBottomRightImage={place.images[4]}
        />}
         <div className={styles.ProductDescriptionContainer}>
          <div className={styles.ProductDescription}>
            {!!place.productSummary && <ProductSummary
              accommodation={place.productSummary.accommodation}
              address={place.productSummary.address}
              guests={{ key: place.productSummary.guests.key, value: place.productSummary.guests.value}}
              bedrooms={{ key: place.productSummary.bedrooms.key, value: place.productSummary.bedrooms.value }}
              beds={{ key: place.productSummary.beds.key, value: place.productSummary.beds.value}}
              baths={{ key: place.productSummary.baths.key, value: place.productSummary.baths.value}}
              starGrade={place.reviewSummary.totalAvgRating}
              reviews={place.reviewSummary.totalReviewsCount}
            />}
            <FavoriteStay />
            {!!place.hostSummary && <HostSummary
              hostName={place.hostSummary.hostName}
              hostingDuration={place.hostSummary.hostingDuration}
              role={place.hostSummary.role}
              profilePicUrl={place.hostSummary.profilePicUrl}
            />}
            {!!place.highlights && <ProductHighlight highlights={place.highlights} />}
            <hr className={styles.separator} />
            {!!place.productDescription && <ProductDescription
                descriptionPlace = {place.productDescription.descriptionPlace}
                descriptionSpace={place.productDescription.descriptionSpace}
                guestAccess={place.productDescription.guestAccess}
                otherThings={place.productDescription.otherThings}
              />}
            <hr className={styles.separator} />
            {
              !!place.amenities && <Amenities
                amenities={place.amenities}
                title={t('product.whatThisPlaceOffers')}
                onClick={handleShowAmenities}
              />
            }
            {booking.bookingData.isBookingOpen && <hr className={styles.separator} />}
            {!!booking && booking.bookingData.isBookingOpen && <CalendarBlock 
              booking={booking}
              toggleKeyboardPopup={toggleKeyboardPopup}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              setCheckInDate={setCheckInDate}
              setCheckOutDate={setCheckOutDate}
              isInitializedRef={isInitializedRef}
            />  
            }
          </div>
          <div className={styles.ReservationCard}>
          {!!booking && <ReservationCard
              booking={booking}
              toggleShortcutsPopup={toggleShortcutsPopup}
              toggleGuestCountPopup={toggleGuestCountPopup}
              setShowGuests={setShowGuests}
              showGuests={showGuests}
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              setCheckInDate={setCheckInDate}
              setCheckOutDate={setCheckOutDate}
              isInitializedRef={isInitializedRef}
              exchangeRateUSD={rateEURUSD}
              exchangeRateUAH={rateEURUAH}
              selectedCurrency={currency} 
            />
          }
          </div>
          {isShortcutsPopupVisible && (
              <ShortcutsPopUp
                isVisible={isShortcutsPopupVisible}
                onClose={toggleShortcutsPopup}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
              />
            )}
          {isGuestCountPopupVisible && (
              <GuestCountPopUp
                isVisible={isGuestCountPopupVisible}
                onClose={toggleGuestCountPopup}
                showGuests={showGuests}
                setShowGuests={setShowGuests}
              />
            )}
          {isKeybordPopupVisible && (
              <CalendarBlockPopUp
                isVisible={isKeybordPopupVisible}
                onClose={toggleKeyboardPopup}
              />
            )}
        </div>
        <hr className={styles.separator} />
        {!!place.reviewSummary && <ReviewSummary
          totalAvgRating={place.reviewSummary.totalAvgRating}
          totalReviewsCount={place.reviewSummary.totalReviewsCount}
          ratings={{
            cleanlinessAvgRating: place.reviewSummary.ratings.cleanlinessAvgRating,
            accuracyAvgRating: place.reviewSummary.ratings.accuracyAvgRating,
            checkInAvgRating: place.reviewSummary.ratings.checkInAvgRating,
            communicationAvgRating: place.reviewSummary.ratings.communicationAvgRating,
            locationAvgRating: place.reviewSummary.ratings.locationAvgRating,
            valueAvgRating: place.reviewSummary.ratings.valueAvgRating,
            starTotals: {
              fiveStar: place.reviewSummary.ratings.starTotals.fiveStar,
              fourStar: place.reviewSummary.ratings.starTotals.fourStar,
              threeStar: place.reviewSummary.ratings.starTotals.threeStar,
              twoStar: place.reviewSummary.ratings.starTotals.twoStar,
              oneStar: place.reviewSummary.ratings.starTotals.oneStar,
            },
          }}
        />}
        {!!place.reviews && (
          <div className={styles.reviews}>
            <ReviewsSection reviews={place.reviews}/>
          </div>
          )
        }
        {!!place.mapView && <MapView
            lat={place.mapView.lat}
            lon={place.mapView.lon}
            address={place.mapView.address}
            addressDescription={place.mapView.addressDescription}
          /> 
        }
        {!!place.hostSummary && <MeetYourHostSection 
            name={place.hostSummary.hostName} 
            image={place.hostSummary.profilePicUrl} 
            role={place.hostSummary.role}
            verified={true}
            reviews={place.reviewSummary.totalReviewsCount}
            rating={place.reviewSummary.totalAvgRating}
            yearsHosting={place.hostSummary.hostingDuration}
            profileText={place.productDescription.descriptionPlace}
          />
        }
      </div>
    </div>
  }
  </>);
};
export default ProductPage;
