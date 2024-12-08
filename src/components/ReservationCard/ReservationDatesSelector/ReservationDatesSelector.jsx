import useOutsideClick from '../../../hooks/useOutsideClick'
import DatePicker from '../DatePicker/DatePicker'
import { KeyboardIcon } from '../../../icons/KeyboardIcon'
import styles from './ReservationDatesSelector.module.css'
import { useEffect, useState } from 'react'
import WarningMessage from '../WarningMessage/WarningMessage'
import { calculateNights, getStayPeriod } from '../../../utils/dateUtils'
import Calendar from '../../Calendar/Calendar'
import { useWindowSize } from '../../../hooks/useWindowSize'

const ReservationDatesSelector = ({
  setCheckInDate,
  setCheckOutDate,
  checkInDate,
  checkOutDate,
  toggleShowCalendar,
  minStayNights,
  toggleShortcutsPopup,
  alreadyBookedDates,
  isInitializedRef
}) => {
  const calendarRef = useOutsideClick(() => toggleShowCalendar(false))

  const windowWidth = useWindowSize();

  const [userSelectedCheckIn, setUserSelectedCheckIn] = useState(false)
  const [userSelectedCheckOut, setUserSelectedCheckOut] = useState(false)
  const [inputCheckInDate, setInputCheckInDate] = useState(
    checkInDate ? checkInDate : ''
  )
  const [inputCheckOutDate, setInputCheckOutDate] = useState(
    checkOutDate ? checkOutDate : ''
  )
  const [checkInError, setCheckInError] = useState('')
  const [checkOutError, setCheckOutError] = useState('')

  useEffect(() => {
      if (checkInDate) {
        setInputCheckInDate(checkInDate);
      } else {
        setInputCheckInDate('');
      }
  }, [checkInDate]);

  useEffect(() => {
      if (checkOutDate) {
        setInputCheckOutDate(checkOutDate);
      } else {
        setInputCheckOutDate('');
      }
  }, [checkOutDate]);


  useEffect(() => {
    if (
      userSelectedCheckOut &&
      checkInDate &&
      checkOutDate &&
      checkInDate < checkOutDate
    ) {
      toggleShowCalendar(false)
    }
  }, [
    checkInDate,
    checkOutDate,
    toggleShowCalendar,
    userSelectedCheckIn,
    userSelectedCheckOut,
  ])

  const nightsCount =
    checkInDate && checkOutDate ? calculateNights(checkInDate, checkOutDate) : 0

  const stayPeriod =
    checkInDate && checkOutDate ? getStayPeriod(checkInDate, checkOutDate) : ''

  return (
    <div className={styles.selectorContainer} ref={calendarRef}>
      <div className={styles.datePickerWrapper}>
        <div className={styles.selectorTitle}>
          <h2>
            {nightsCount > 0
              ? `${nightsCount} ${nightsCount > 1 ? 'nights' : 'night'}`
              : 'Select dates'}
          </h2>
          <span>
            {stayPeriod ? (
              <span>{stayPeriod}</span>
            ) : minStayNights ? (
              `Minimum stay: ${minStayNights} ${
                minStayNights > 1 ? 'nights' : 'night'
              }`
            ) : (
              'Add your travel dates for exact pricing'
            )}
          </span>
        </div>
        <div className={styles.datePickerContainer}>
          <DatePicker
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            setCheckInDate={setCheckInDate}
            setCheckOutDate={setCheckOutDate}
            setUserSelectedCheckIn={setUserSelectedCheckIn}
            setUserSelectedCheckOut={setUserSelectedCheckOut}
            setCheckInError={setCheckInError}
            setCheckOutError={setCheckOutError}
            checkInError={checkInError}
            checkOutError={checkOutError}
            inputCheckInDate={inputCheckInDate}
            inputCheckOutDate={inputCheckOutDate}
            setInputCheckInDate={setInputCheckInDate}
            setInputCheckOutDate={setInputCheckOutDate}
            minStayNights={minStayNights}
            alreadyBookedDates={alreadyBookedDates}
          />
          <WarningMessage message={checkInError || checkOutError} />
        </div>
      </div>
      {windowWidth > 768 && (
        <div className={styles.calendarWrapper}>
          <Calendar 
            dayItemWidth="42px" 
            dayItemHeight="40px"
            pickedDayWidth="40px"
            pickedDayHeight="40px" 
            monthContainerPadding="13px" 
            textDecoration="line-through" 
            buttonRightMargin="-46px"
            buttonLeftMargin="-46px"
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            setCheckInDate={setCheckInDate}
            setCheckOutDate={setCheckOutDate}
            minStayNights={minStayNights}
            alreadyBookedDates={alreadyBookedDates}
            isInitializedRef={isInitializedRef}
          />
        </div>
      )}
      <div className={styles.buttonsContainer}>
        <button
          className={styles.shortcutsPopupButton}
          onClick={toggleShortcutsPopup}
        >
          <KeyboardIcon />
        </button>
        <div className={styles.clearToggleBtnWrapper}>
          <div className={styles.clearDatesButton}>
            <button
              className={styles.clearDatesButton}
              onClick={() => {
                setCheckInDate('')
                setCheckOutDate('')
                setInputCheckInDate('')
                setInputCheckOutDate('')
                setCheckInError('')
                setCheckOutError('')
              }}
            >
              Clear dates
            </button>
          </div>
          <div className={styles.cancelButton}>
            <button type="button" onClick={() => toggleShowCalendar(false)}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationDatesSelector