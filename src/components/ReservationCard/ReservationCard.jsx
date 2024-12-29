import styles from './ReservationCard.module.css'
import CostsSummary from '../CostsSummary/CostsSummary'
import AddGuestsPopUp from '../AddGuestsPopUp/AddGuestsPopUp'
import ReservationDatesSelector from './ReservationDatesSelector/ReservationDatesSelector'
import DatePicker from './DatePicker/DatePicker'
import GuestCountDisplay from './GuestCountDisplay/GuestCountDisplay'
import useOutsideClick from '../../hooks/useOutsideClick'
import { calculateGuestCounts } from '../../utils/guestCounts'
import { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { calculateNights } from '../../utils/dateUtils'
import Swal from 'react-sweetalert2'
import { useNavigate } from 'react-router-dom';
import { getSuccessHtml } from '../../utils/displayHelpers';
import { useTranslation } from 'react-i18next'
import { convertCurrency } from '../../utils/currencyConvertation'


function ReservationCard({
  toggleShortcutsPopup,
  toggleGuestCountPopup,
  setShowGuests,
  showGuests,
  showCalendar,
  setShowCalendar,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  booking,
  isInitializedRef,
  exchangeRateUSD,
  exchangeRateUAH,
  selectedCurrency
}) {

  const navigate = useNavigate();

  const { t } = useTranslation();

  const {
    bookingData: {
      pricePerNight,
      cleaningFee,
      airbnbServiceFee,
      longStayDiscount,
      nightsCountForLongStayDiscount,
      allowGuestsNumber,
      minStayNights,
      isBookingOpen,
    },
    guestCounts: defaultGuestCounts,
    alreadyBookedDates,
  } = booking || {};

  const [guestCounts, setGuestCounts] = useState(defaultGuestCounts || {});
  const [guestsList, setGuestsList] = useState([
    { typeofGuest: 'Adults', numberOfGuests: 1 },
    { typeofGuest: 'Children', numberOfGuests: 0 },
    { typeofGuest: 'Infants', numberOfGuests: 0 },
    { typeofGuest: 'Pets', numberOfGuests: 0 },
  ])
  const [successData, setSuccessData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('');
  const { productId } = useParams();

  const currentTotalPeople = guestCounts.adults + guestCounts.children;

  const toggleShowGuests = () => {
    setShowGuests((prevState) => !prevState)
  }

  const toggleShowCalendar = (show) => {
    setShowCalendar(show)
  }

  const {
    adultsCount,
    childrenCount,
    infantsCount,
    petsCount,
    adultsAndChildrenCount,
  } = calculateGuestCounts(guestsList)

  const handleGuestClick = (updatedGuest) => {
    setGuestsList((prevList) =>
      prevList.map((guest) =>
        guest.typeofGuest === updatedGuest.typeofGuest
          ? { ...guest, numberOfGuests: updatedGuest.numberOfGuests }
          : guest
      )
    )
  }

  const checkInOut = checkInDate && checkOutDate

  const usd = exchangeRateUSD 
  const uah = exchangeRateUAH

  let pricePerNightCurrency;
  let airbnbServiceFeeCurrency; 
  let cleaningFeeCurrency; 
  let longStayDiscountCurrency; 

  if (selectedCurrency === 'USD') {
    pricePerNightCurrency = convertCurrency(pricePerNight, usd);
    airbnbServiceFeeCurrency = convertCurrency(airbnbServiceFee, usd);
    cleaningFeeCurrency = convertCurrency(cleaningFee, usd);
    longStayDiscountCurrency = convertCurrency(longStayDiscount, usd);
  } else if (selectedCurrency === 'UAH') {
    pricePerNightCurrency = convertCurrency(pricePerNight, uah);
    airbnbServiceFeeCurrency = convertCurrency(airbnbServiceFee, uah);
    cleaningFeeCurrency = convertCurrency(cleaningFee, uah);
    longStayDiscountCurrency = convertCurrency(longStayDiscount, uah);
  } else {
    pricePerNightCurrency = pricePerNight;
    airbnbServiceFeeCurrency = airbnbServiceFee;
    cleaningFeeCurrency = cleaningFee;
    longStayDiscountCurrency = longStayDiscount;
  }

  const nights =
  checkInDate && checkOutDate ? calculateNights(checkInDate, checkOutDate) : 0
  const isDiscount = nights >= nightsCountForLongStayDiscount

  const basePrice = nights * pricePerNightCurrency
  const totalPrice =
    basePrice +
    airbnbServiceFeeCurrency +
    cleaningFeeCurrency -
    (isDiscount ? longStayDiscountCurrency : 0)

  
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!checkInOut || adultsCount === 0) {
      setError('Please select valid dates and at least one adult.')
      return
    }

    const reservationData = {
      checkInDate,
      checkOutDate,
      guests: {
        adults: adultsCount,
        children: childrenCount,
        infants: infantsCount,
        pets: petsCount,
      },
      totalPrice,
      exchangeRateUSD,
      exchangeRateUAH,
      selectedCurrency
    };

    try {
      setLoading(true);

      const response = await axios.post(
        (`http://localhost:8800/bookings/reservations/${productId}`),
        reservationData
      );

      setSuccessMessage('Reservation submitted successfully!');
      setSuccessData(response.data.newBookingToClient);
    } catch (err) {
      console.error('Error submitting reservation:', err);
      setError('Failed to submit the reservation. Please try again later.');
    } finally {
      setLoading(false);
    }    
  }

  const closeGuestsPopup = () => setShowGuests(false)
  const guestsRef = useOutsideClick(closeGuestsPopup)

  const addGuestPopUpStyles = {
    borderRadius: '4px',
    width: '100% !important',
    position: 'absolute !important',
    border: '1px solid var(--palette-deco)',
    zIndex: '99 !important',
  }

  return (
    <div className={styles.reservationCard}>
      <Swal
        show={!!successData}
        title={t('product.reservationSuccessful')}
        html={getSuccessHtml(successData, t)}
        icon="success"
        confirmButtonText={t('product.ok')}
        onConfirm={() => {
          setSuccessData(null)
          navigate('/')
        }}
      />
      <div className={styles.reservationSection}>
        <div>
          {isBookingOpen ? (
            <div className={styles.pricingGuestSection}>
              {checkInOut && !loading ? (
                <>
                  <strong>{`${selectedCurrency === 'USD' ? '$' : selectedCurrency === 'UAH' ? '₴' : "€"}${pricePerNightCurrency}`}</strong>
                  {t('product.nights', {count: 1})}
                </>
              ) : (
                <span>{t('product.add_dates_for_prices')}</span>
              )}
            </div>
          ) : (
            <h1 className={styles.soldOutGuestSection}>{t('product.booking_closed')}</h1>
          )}
          {isBookingOpen && (
            <div 
              className={styles.reservationForm} 
              ref={guestsRef}
            >
              <DatePicker
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onToggle={toggleShowCalendar}
                setCheckInDate={setCheckInDate}
                setCheckOutDate={setCheckOutDate}
                renderAsButton={true}
                alreadyBookedDates={alreadyBookedDates}
              />
              {showCalendar && (
                <ReservationDatesSelector
                  setCheckInDate={setCheckInDate}
                  setCheckOutDate={setCheckOutDate}
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  toggleShowCalendar={toggleShowCalendar}
                  minStayNights={minStayNights}
                  toggleShortcutsPopup={toggleShortcutsPopup}
                  alreadyBookedDates={alreadyBookedDates}
                  isInitializedRef={isInitializedRef}
                />
              )}
              <button
                type="button"
                className={styles.guestsNumberPickerSection}
                ref={guestsRef}
                onClick={() => toggleShowGuests()}
              >
                <GuestCountDisplay
                  showGuests={showGuests}
                  adultsAndChildrenCount={adultsAndChildrenCount}
                  infantsCount={infantsCount}
                  petsCount={petsCount}
                />
              </button>
              <div className={styles.guestDropdown}>
                {showGuests && (
                  <AddGuestsPopUp
                    onGuestChange={handleGuestClick}
                    style={addGuestPopUpStyles}
                    allowGuestsNumber={allowGuestsNumber}
                    toggleShowGuests={toggleShowGuests}
                    adultsCount={adultsCount}
                    childrenCount={childrenCount}
                    infantsCount={infantsCount}
                    petsCount={petsCount}
                    setGuestCounts={setGuestCounts}
                    currentTotalPeople={currentTotalPeople}
                    toggleGuestCountPopup={toggleGuestCountPopup}
                  />
                )}
              </div>
            </div>
          )}
          {isBookingOpen ? (
          <form onSubmit={handleFormSubmit}>
            <div className="buttonContainer">
              <button
                type={checkInOut && !loading ? 'submit' : 'button'}
                onClick={
                  !checkInOut && !loading
                    ? () => toggleShowCalendar(true)
                    : undefined
                }
                className={styles.reserveButton}
              >
                {loading ? `${t('product.submitting')}...` : checkInOut ? t('product.reserve') : t('product.check_availability')}
              </button>
            </div>
          </form>
          ) : (
            <div className="buttonContainer">
              <button className={styles.soldOutButton} disabled>
              {t('product.sold_out')}
              </button>
            </div>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        </div>
        {isBookingOpen && (
          <div className={styles.noDatesMessage}>
            {!checkInOut && (
              <p>{t('product.enter_travel_dates_for_total_price')}.</p> 
            )}
          </div>
        )}
      </div>

      {checkInOut && !loading && isBookingOpen && (
        <CostsSummary
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          pricePerNight={pricePerNightCurrency}
          cleaningFee={cleaningFeeCurrency}
          airbnbServiceFee={airbnbServiceFeeCurrency}
          longStayDiscount={longStayDiscountCurrency}
          nightsCountForDiscount={nightsCountForLongStayDiscount}
          nights={nights}
          basePrice={basePrice}
          isDiscount={isDiscount}
          totalPrice={totalPrice}
          selectedCurrency={selectedCurrency}
        />
      )}
    </div>
  )
}

export default ReservationCard
