import { useEffect, useRef, useState } from 'react'
import { CloseButtonIcon } from '../../../icons/CloseButtonIcon'
import {isDayBeforeBooked, convertStringToDateObject, minStayBeforeBooked} from '../../../utils/dateUtils'
import styles from './DatePicker.module.css'
import { useTranslation } from 'react-i18next'

const DatePicker = ({
  checkInDate,
  checkOutDate,
  minStayNights = 1,
  inputCheckInDate,
  inputCheckOutDate,
  setInputCheckInDate,
  setInputCheckOutDate,
  setCheckInDate,
  setCheckOutDate,
  onToggle,
  renderAsForm = false,
  renderAsButton = false,
  setUserSelectedCheckIn,
  setUserSelectedCheckOut,
  setCheckInError,
  setCheckOutError,
  checkInError,
  checkOutError,
  alreadyBookedDates = [],
}) => {
  const [checkInFocus, setCheckInFocus] = useState(false)
  const [checkOutFocus, setCheckOutFocus] = useState(false)

  const { t } = useTranslation();

  const checkInInputRef = useRef(null)
  const checkOutInputRef = useRef(null)

  const isDateBooked = (date) => {
    const selectedDate = new Date(date);
  
    const isBooked = alreadyBookedDates.some(({ startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return selectedDate >= start && selectedDate <= end;
    });
    return isBooked;
  };

  useEffect(() => {
    if (!checkInDate || checkInError) {
      checkInInputRef?.current?.focus()
      setCheckInFocus(true)
    } else if (checkInDate && !checkInError) {
      checkOutInputRef?.current?.focus()
      setCheckOutFocus(true)
    }
  }, [checkInDate, checkInError])

  const Container = renderAsForm ? 'form' : renderAsButton ? 'button' : 'div'

  const validateDate = (input) => {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/
    return regex.test(input)
  }

  const handleCheckInChange = (date) => {
    setInputCheckInDate(date)
  }

  const handleCheckOutChange = (date) => {
    setInputCheckOutDate(date)
  }

  const handleCheckInFocus = () => {
    setCheckInFocus(true)
    setCheckOutFocus(false)
  }

  const handleCheckOutFocus = () => {
    setCheckOutFocus(true)
    setCheckInFocus(false)
  }

  const checkInDateObj = new Date(checkInDate)
  const checkOutDateObj = new Date(checkOutDate)
  const MS_PER_DAY = 1000 * 60 * 60 * 24
  const today = new Date()

  const handleCheckInBlur = (dataCheckIn) => {
    if (validateDate(dataCheckIn)) {
      const dataCheckInObj = new Date(dataCheckIn)

      let isDayBeforeBookedDate;
        const dateObj = convertStringToDateObject(dataCheckIn);
        if (dateObj) {
          isDayBeforeBookedDate = isDayBeforeBooked(
            dateObj.day,
            dateObj.month,
            dateObj.year,
            alreadyBookedDates,
            false
          );
        }

        let isMinStayBeforeBooked;
        const dateMinStayObj = convertStringToDateObject(dataCheckIn);
        if (dateMinStayObj) {
          isMinStayBeforeBooked = minStayBeforeBooked(
            dateObj.day,
            dateObj.month,
            dateObj.year,
            alreadyBookedDates,
            minStayNights,
            false
          );
        }

      if (isDateBooked(dataCheckIn) || dataCheckInObj < today || isDayBeforeBookedDate || isMinStayBeforeBooked) { 
        setCheckInError('This date is unavailable')
        return
      }

      const chekInOutDiff = (checkOutDateObj - dataCheckInObj) / MS_PER_DAY

      if (checkOutDate && dataCheckInObj >= checkOutDateObj) {
        setCheckInError('Check-in date must be earlier than check-out date')
      } else if (checkOutDate && chekInOutDiff < Number(minStayNights)) {
        setCheckInError(`Minimum stay: ${minStayNights} nights`)
      } else {
        setCheckInError('')
        setCheckInDate(dataCheckIn)
        setUserSelectedCheckIn(true)
      }
    } else if (inputCheckInDate === '') {
      setCheckInError('')
    } else {
      setCheckInError('This date is unavailable')
    }
  }

  const handleCheckOutBlur = (dataCheckOut) => {
    if (validateDate(dataCheckOut)) {
      const dataCheckOutObj = new Date(dataCheckOut)

      if (isDateBooked(dataCheckOut)) {
        setCheckOutError('This date is unavailable')
        return
      } 

      const chekInOutDiff = (dataCheckOutObj - checkInDateObj) / MS_PER_DAY

      if (checkInDate && dataCheckOutObj <= checkInDateObj) {
        setCheckOutError('Check-out date must be later than check-in date')
      } else if (chekInOutDiff < minStayNights) {
        setCheckOutError(`Minimum stay: ${minStayNights} nights`)
      } else {
        setCheckOutError('')
        setCheckOutDate(dataCheckOut)
        setUserSelectedCheckOut(true)
      }
    } else if (inputCheckOutDate === '') {
      setCheckOutError('')
    } else {
      setCheckOutError('This date is unavailable')
    }
  }

  return (
    <Container
      type="button"
      className={`${styles.datesPickerSection} ${
        !checkInDate && !renderAsButton ? styles.checkOutBackground : ''
      }`}
      onClick={!renderAsForm && renderAsButton ? onToggle : undefined}
      onSubmit={renderAsForm ? (e) => e.preventDefault() : undefined}
    >
      <div
        className={`${styles.checkinSection} ${
          checkInError ? styles.checkInError : ''
        } ${!checkInDate && !renderAsButton ? styles.activeCheckIn : ''} ${
          renderAsButton ? styles.buttonTypeActive : ''
        } ${checkInFocus && !renderAsButton ? styles.activeCheckIn : ''}
        ${
          checkInFocus && !renderAsButton && !checkInError
            ? styles.activeCheckIn
            : ''
        }
        `}
        onClick={() => checkInInputRef.current?.focus()}
      >
        <div className={styles.checkinSectionContent}>
          <div className={styles.checkinInputWrapper}>
            <label>{t('search.checkIn')}</label>
            {renderAsForm || !renderAsButton ? (
              <input
                type="text"
                ref={checkInInputRef}
                className={styles.dateField}
                value={
                  checkInFocus || checkInDate !== '' || checkInError
                    ? inputCheckInDate
                    : checkInDate
                }
                placeholder={
                  (!checkInDate && checkInFocus) ||
                  (checkInDate && inputCheckInDate === '') ||
                  (checkInFocus === true && inputCheckInDate !== '')
                    ? 'MM/DD/YYYY'
                    : t('search.addDates')
                }
                onFocus={handleCheckInFocus}
                onBlur={() => {
                  if (inputCheckInDate === '' && !checkInFocus) {
                    setInputCheckInDate('')
                  } else if (checkInDate !== inputCheckInDate) {
                    handleCheckInBlur(inputCheckInDate)
                  } else {
                    if (checkInInputRef.current) {
                      checkInInputRef.current.blur()
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (checkInDate !== inputCheckInDate && e.key === 'Enter') {
                    handleCheckInBlur(inputCheckInDate)
                  }
                }}                
                onChange={(e) => handleCheckInChange(e.target.value)}
                maxLength={10}
                required={checkInFocus}
              />
            ) : (
              <div>{checkInDate ? checkInDate : <span>{t('search.addDates')}</span>}</div>
            )}
          </div>
          {renderAsForm ||
            (!renderAsButton && checkInDate && (
              <button
                className={styles.clearInputDateBtn}
                onClick={() => {
                  setCheckInDate('')
                  setCheckOutDate('')
                  setInputCheckInDate('')
                  setInputCheckOutDate('')
                  setCheckInError('')
                  setCheckOutError('')
                }}
              >
                <CloseButtonIcon />
              </button>
            ))}
        </div>
      </div>
      <div
        className={`${styles.checkoutSection} ${
          checkOutError && !checkInFocus ? styles.checkOutError : ''
        } ${
          checkOutFocus && !renderAsButton && !checkOutError
            ? styles.activeCheckOut
            : ''
        }`}
        onClick={() => checkOutInputRef.current?.focus()}
      >
        <div
          className={`${styles.checkoutSectionContent} ${
            !checkInDate && !renderAsButton ? styles.disabledCheckout : ''
          } ${checkOutError && checkInFocus ? styles.checkOutErrorLabel : ''}`}
        >
          <div className={styles.checkoutInputWrapper}>
            <label>{t('search.checkOut')}</label>
            {renderAsForm || !renderAsButton ? (
              checkInDate !== 0 && (
                <input
                  type="text"
                  ref={checkOutInputRef}
                  className={`${styles.dateField} ${
                    checkOutError && checkInFocus
                      ? styles.checkOutErrorBackground
                      : ''
                  }`}
                  value={
                    checkOutFocus || checkOutDate !== '' || checkOutError
                      ? inputCheckOutDate
                      : checkOutDate
                  }
                  placeholder={
                    (!checkOutDate && checkOutFocus) ||
                    (checkOutDate && inputCheckOutDate === '') ||
                    (checkOutFocus === true && inputCheckOutDate !== '')
                      ? 'MM/DD/YYYY'
                      : t('search.addDates')
                  }
                  onFocus={handleCheckOutFocus}
                  onBlur={() => {
                    if (inputCheckOutDate === '' && !checkOutFocus) {
                      setInputCheckOutDate('')
                    } else if (checkOutDate !== inputCheckOutDate) {
                      handleCheckOutBlur(inputCheckOutDate)
                    } else {
                      if (checkOutInputRef.current) {
                        checkOutInputRef.current.blur()
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      checkOutDate !== inputCheckOutDate &&
                      e.key === 'Enter'
                    ) {
                      handleCheckOutBlur(inputCheckOutDate)
                    }
                  }}                  
                  onChange={(e) => handleCheckOutChange(e.target.value)}
                  maxLength={10}
                  required={checkOutFocus}
                  min={inputCheckInDate}
                  disabled={!checkInDate}
                />
              )
            ) : (
              <div>{checkOutDate ? checkOutDate : <span>{t('search.addDates')}</span>}</div>
            )}
          </div>
          {renderAsForm ||
            (!renderAsButton && checkOutDate && (
              <button
                className={styles.clearInputDateBtn}
                onClick={() => {
                  setCheckOutDate('')
                  setInputCheckOutDate('')
                  setCheckOutError('')
                }}
              >
                <CloseButtonIcon />
              </button>
            ))}
        </div>
      </div>
    </Container>
  )
}

export default DatePicker