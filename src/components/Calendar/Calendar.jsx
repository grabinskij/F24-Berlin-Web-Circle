import { useEffect, useState } from 'react'
import styles from './Calendar.module.css'
import { CalendarLeftArrowIcon, CalendarRightArrowIcon } from '../../icons'
import { 
  convertStringToDateObject, 
  isBooked, 
  isDayBeforeBooked, 
  minStayBeforeBooked, 
  isWithinMinStay, 
  isBetweenCheckInAndOut,
  isDateDisabled,
  getInitialMonth
} from '../../utils/dateUtils'
import {findNextAvailableDate} from '../../utils/findNextAvailableDate'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useTranslation } from 'react-i18next'

const Calendar = ({ 
  dayItemWidth, 
  dayItemHeight,
  pickedDayWidth,
  pickedDayHeight,
  textDecoration, 
  monthContainerPadding,
  buttonRightMargin,
  buttonLeftMargin,
  setCheckInDate,
  setCheckOutDate,
  checkInDate,
  checkOutDate,
  isSearchBarCalendar,
  minStayNights,
  alreadyBookedDates,
  searchCheckIn,
  searchCheckOut,
  setSearchCheckIn,
  setSearchCheckOut,
  isInitializedRef,
  isCalendarBlock
}) => {

  const [currentMonth, setCurrentMonth] = useState(getInitialMonth(
    checkInDate, alreadyBookedDates, findNextAvailableDate, minStayNights)
  );

  const [animationDirection, setAnimationDirection] = useState("")
  const [pickedCheckIn, setPickedCheckIn] = useState(() => {
    if (checkInDate && !isSearchBarCalendar) {
      return convertStringToDateObject(checkInDate);
    } else if (searchCheckIn && isSearchBarCalendar) {
      return convertStringToDateObject(searchCheckIn);
    }
    return null;
  });

  const [pickedCheckOut, setPickedCheckOut] = useState(() => {
    if (checkOutDate && !isSearchBarCalendar) {
      return convertStringToDateObject(checkOutDate);
    } else if (searchCheckOut && isSearchBarCalendar) {
      return convertStringToDateObject(searchCheckOut);
    }
    return null;
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (!isSearchBarCalendar && checkInDate) {
      const { year, month } = convertStringToDateObject(checkInDate);
      const targetMonth = new Date(year, month, 1);
  
      const nextMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      );
  
      if (
        targetMonth.getTime() !== currentMonth.getTime() &&
        targetMonth.getTime() !== nextMonth.getTime()
      ) {
        setCurrentMonth(targetMonth);
      }
    }
  }, [checkInDate, isSearchBarCalendar]);
  
  useEffect(() => {
    if (!isSearchBarCalendar && !isInitializedRef.current && !checkInDate && !checkOutDate) {
      const { checkIn, checkOut } = findNextAvailableDate(alreadyBookedDates, minStayNights);

      const formatDate = (date) => {
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
      };
      setCheckInDate(formatDate(checkIn));
      setCheckOutDate(formatDate(checkOut));

      isInitializedRef.current = true; 
    }
  }, []);
 
  useEffect(() => {
    if (!isSearchBarCalendar) {
      if (checkInDate) {
        setPickedCheckIn(convertStringToDateObject(checkInDate));
      } else {
        setPickedCheckIn(null);
      }
    }
  }, [checkInDate, isSearchBarCalendar]);

  useEffect(() => {
    if (!isSearchBarCalendar) {
      if (checkOutDate) {
        setPickedCheckOut(convertStringToDateObject(checkOutDate));
      } else {
        setPickedCheckOut(null);
      }
    }
  }, [checkOutDate, isSearchBarCalendar]);

  useEffect(() => {
    if (isSearchBarCalendar) {
      if (searchCheckIn !== "Add dates") {
        setPickedCheckIn(convertStringToDateObject(searchCheckIn));
      } else {
        setPickedCheckIn(null);
      }
    }
  }, [searchCheckIn, isSearchBarCalendar]);

  useEffect(() => {
    if (isSearchBarCalendar) {
      if (searchCheckOut !== "Add dates") {
        setPickedCheckOut(convertStringToDateObject(searchCheckOut));
      } else {
        setPickedCheckOut(null);
      }
    }
  }, [searchCheckOut, isSearchBarCalendar]);

  const windowWidth = useWindowSize();

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const goToNextMonth = () => {
    setAnimationDirection("flip-right")
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    )
    resetAnimation()
  }
  const goToPrevMonth = () => {
    setAnimationDirection("flip-left")
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    )
    resetAnimation()
  }

  const resetAnimation = () => {
    setTimeout(() => setAnimationDirection(""), 300)
  }


  const handleDateClick = (day, month, year) => {
    const selectedDate = { day, month, year }

    function convertDateObjectToString(dateObject) {
      const { day, month, year } = dateObject
      return `${String(month + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`
    }
    

    const dateString = convertDateObjectToString({ day, month, year });

    if (isSearchBarCalendar) {
      if (!pickedCheckIn || (pickedCheckIn && pickedCheckOut)) {
        setSearchCheckIn(dateString)
        setPickedCheckIn(selectedDate)
        setPickedCheckOut(null)
        setSearchCheckOut("Add dates")  
      } else if (pickedCheckIn && !pickedCheckOut) {
        const pickedCheckInDate = new Date(pickedCheckIn.year, pickedCheckIn.month, pickedCheckIn.day).getTime()
        const selectedDateTime = new Date(year, month, day).getTime()
  
        if (selectedDateTime > pickedCheckInDate) {
          setPickedCheckOut(selectedDate)
          setSearchCheckOut(dateString)
        } else  {
          setPickedCheckIn(selectedDate)
          setSearchCheckIn(dateString)
        }
      }
    } else {
      if (!pickedCheckIn || (pickedCheckIn && pickedCheckOut)) {
        setCheckInDate(dateString);
        setPickedCheckIn(selectedDate);
        setPickedCheckOut(null);
        setCheckOutDate(null)
    } else if (pickedCheckIn && !pickedCheckOut) {
      const pickedCheckInDate = new Date(pickedCheckIn.year, pickedCheckIn.month, pickedCheckIn.day).getTime()
      const selectedDateTime = new Date(year, month, day).getTime()

      if (selectedDateTime > pickedCheckInDate) {
        setPickedCheckOut(selectedDate)
        setCheckOutDate(dateString)
      } else {
        setPickedCheckIn(selectedDate)
        setCheckInDate(dateString)
      }
    }
  }
}

  const renderDaysOfWeek = () => {
    const days = [
      t('search.days.sun'),
      t('search.days.mon'),
      t('search.days.tue'),
      t('search.days.wed'),
      t('search.days.thu'),
      t('search.days.fri'),
      t('search.days.sat'),
    ];
    return days.map((day, index) => (
      <div key={index} className={styles.dayHeader}>
        {day}
      </div>
    ))
  }

  const renderDays = (year, month, isCurrentMonth) => {
    const today = new Date().setHours(0, 0, 0, 0)
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const daysArray = []

  const checkInDateTime = pickedCheckIn 
    ? new Date(pickedCheckIn.year, pickedCheckIn.month, pickedCheckIn.day).getTime() 
    : null;

  const dayBeforeBookedDateTime = alreadyBookedDates && alreadyBookedDates.length > 0
  ? alreadyBookedDates
      .map(({ startDate }) => {
        const [startMonth, startDay, startYear] = startDate.split('/').map(Number);
        const previousDay = new Date(startYear, startMonth - 1, startDay - 1);
        return previousDay.getTime();
      })
      .find(time => checkInDateTime && time > checkInDateTime)
  : null;
  
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(
        <div key={`empty-${i}`} className={styles.emptySlot}></div>
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).setHours(0, 0, 0, 0)
      const isPastDate = isCurrentMonth && date < today
      const isCheckInDate = pickedCheckIn && pickedCheckIn.day === day && pickedCheckIn.month === month && pickedCheckIn.year === year
      const isCheckOutDate = pickedCheckOut && pickedCheckOut.day === day && pickedCheckOut.month === month && pickedCheckOut.year === year
      const isBetweenDates = isBetweenCheckInAndOut(day, month, year, pickedCheckIn, pickedCheckOut)
      const isInMinStayRange = isWithinMinStay(day, month, year, pickedCheckIn, pickedCheckOut, minStayNights)
      const isAlreadyBooked = isBooked(day, month, year, alreadyBookedDates, isSearchBarCalendar);
      const isDayBeforeBookedDate = isDayBeforeBooked(day, month, year, alreadyBookedDates, isSearchBarCalendar);
      const isInValidRange = dayBeforeBookedDateTime 
      ? (date >= checkInDateTime && date <= dayBeforeBookedDateTime)
      : (checkInDateTime ? date >= checkInDateTime : true);
      const isMinStayBeforeBooked = minStayBeforeBooked(day, month, year, alreadyBookedDates, minStayNights, isSearchBarCalendar);
      const isBeforeCheckIn = checkInDateTime && date < checkInDateTime
      const isDisabled = isDateDisabled(day, month, year, isSearchBarCalendar, alreadyBookedDates, minStayNights);

      
      const tooltipClass = `${styles.tooltipText}`        
      const minNightsTooltipClass = `${tooltipClass} ${
        (isCheckInDate && !isCheckOutDate && !isBetweenDates && !isMinStayBeforeBooked) || 
        (isMinStayBeforeBooked && !checkOutDate)  
          ? styles.minNightsToolTip 
          : ''
      }`;
       
      const checkInTooltipClass = `${tooltipClass} ${
        isCheckInDate && isBetweenDates 
          ? styles.checkInToolTip 
          : ''
      }`;
      
      const checkOutTooltipClass = `${tooltipClass} ${
        isCheckOutDate && isBetweenDates 
          ? styles.checkOutToolTip 
          : ''
      }`;
      
      const beforeBookedTooltipClass = `${tooltipClass} ${
        isDayBeforeBookedDate && (!checkInDate || (checkInDate && checkOutDate && !isCheckOutDate)) 
          ? styles.checkoutOnlyToolTip 
          : ''
      }`;


      daysArray.push(
        <div
          key={day}
          className={`${styles.date} ${isPastDate || (isBeforeCheckIn && !pickedCheckOut && !isSearchBarCalendar) || isDisabled ? styles.pastDate : ''} 
                      ${isBetweenDates ? styles.betweenDates : ''}
                      ${isCheckInDate ? styles.betweenDatesAndCheckIn : ''}
                      ${isCheckOutDate ? styles.betweenDatesAndCheckOut : ''}
                      ${isInMinStayRange && !isAlreadyBooked ? styles.minStayRange : ''}
                      ${isAlreadyBooked ? styles.pastDate : ''}
                      ${isDayBeforeBookedDate ? styles.dayBeforeBookedDate : ''}
                      ${(!isInValidRange && checkInDateTime && !checkOutDate && !isSearchBarCalendar) ? styles.pastDate : ''}                     
                      ${isMinStayBeforeBooked && !isCheckOutDate && !isCheckInDate ? styles.minStayRange : ''} 
                    `}
          style={{
            "--pastDate-line-through": textDecoration,
          }}
          onClick={() => {
            if (isAlreadyBooked || 
                isPastDate || (
                !checkInDate && isDayBeforeBookedDate) || 
                (checkInDate && checkOutDate && isDayBeforeBookedDate) || 
                (!checkInDate && isMinStayBeforeBooked) ||
                (checkInDate && checkOutDate && isMinStayBeforeBooked) ||
                 isDisabled) {
                  return;
                }  
            if (!isInMinStayRange || (isInMinStayRange && isBetweenDates)) {
              handleDateClick(day, month, year);
              }
            }}
          tabIndex={isInMinStayRange && !isCheckOutDate ? 0 : -1}
          onFocus={(e) => {
            if (isInMinStayRange && !isCheckOutDate && !isAlreadyBooked || isMinStayBeforeBooked) {
              const tooltip = e.currentTarget.querySelector(`.${styles.tooltipText}`);
              tooltip.style.visibility = 'visible';
              e.currentTarget.classList.add(styles.tooltipVisible);
            }
          }}
          onBlur={(e) => {
            if (isInMinStayRange && !isCheckOutDate && !isAlreadyBooked || isMinStayBeforeBooked) {
              const tooltip = e.currentTarget.querySelector(`.${styles.tooltipText}`);
              tooltip.style.visibility = 'hidden';
              e.currentTarget.classList.remove(styles.tooltipVisible);
            }
          }}
          onMouseOver={(e) => {
            if (
              isInMinStayRange &&
              !isCheckOutDate &&
              !isAlreadyBooked ||
              (e.currentTarget === document.activeElement && isMinStayBeforeBooked)
            ) {
              const tooltip = e.currentTarget.querySelector(`.${styles.tooltipText}`);
              tooltip.style.visibility = 'visible';
              e.currentTarget.classList.add(styles.tooltipVisible);
            }
          }}
          onMouseLeave={(e) => {
            if (
              isInMinStayRange &&
              !isCheckOutDate &&
              !isAlreadyBooked ||
              (e.currentTarget === document.activeElement && isMinStayBeforeBooked)
            ) {
              const tooltip = e.currentTarget.querySelector(`.${styles.tooltipText}`);
              tooltip.style.visibility = 'hidden';
              e.currentTarget.classList.remove(styles.tooltipVisible);
            }
          }}
        >
          {<div 
            className={`${styles.pickedDay}
            ${isCheckInDate && !isDayBeforeBookedDate ? styles.pickedCheckIn : ''} 
            ${isCheckOutDate ? styles.pickedCheckOut : ''}
            `}
            style={{
              "--pickedDay-item-width": pickedDayWidth,
              "--pickedDay-item-height": pickedDayHeight,
            }}
          >
            {day}
            {!isSearchBarCalendar && (
              <>
                {(isCheckInDate && !isCheckOutDate && !isBetweenDates && !isMinStayBeforeBooked) || (isMinStayBeforeBooked && !isCheckOutDate) || (isInMinStayRange) ? (
                  <span className={minNightsTooltipClass}>
                    {minStayNights} night{minStayNights > 1 ? 's' : ''} minimum
                  </span>
                ) : null}

                {isCheckInDate && isBetweenDates ? (
                  <span className={checkInTooltipClass}>
                    Check-in day
                  </span>
                ) : null}

                {isCheckOutDate && isBetweenDates ? (
                  <span className={checkOutTooltipClass}>
                    Checkout day
                  </span>
                ) : null}

                {isDayBeforeBookedDate && !checkInDate || 
                (checkInDate && checkOutDate && isDayBeforeBookedDate && !isCheckOutDate) ? (
                  <span className={beforeBookedTooltipClass}>
                    Checkout only
                  </span>
                ) : null}
              </>
            )}
          </div>
          }
        </div>
      )
    }
    return daysArray
  }

  const renderCalendarForMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const monthNames = [
      t('search.months.january'),
      t('search.months.february'),
      t('search.months.march'),
      t('search.months.april'),
      t('search.months.may'),
      t('search.months.june'),
      t('search.months.july'),
      t('search.months.august'),
      t('search.months.september'),
      t('search.months.october'),
      t('search.months.november'),
      t('search.months.december'),
    ];
    const monthName = monthNames[month];

    const isCurrentMonth =
      currentMonth.getFullYear() === year && currentMonth.getMonth() === month

    return (
      <div className={`${styles.monthContainer} ${styles[animationDirection]}`}         
           style={{
             "--day-item-width": dayItemWidth,
             "--day-item-height": dayItemHeight,
             "--month-container-padding": monthContainerPadding
           }}
      >
        <h3>{`${monthName} ${year}`}</h3>
        <div className={styles.calendarGrid}>
          {renderDaysOfWeek()}
          {renderDays(year, month, isCurrentMonth)}
        </div>
      </div>
    )
  }

  const getNextMonth = () =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)


  return (
    <div className={styles.calendarPopUp}>
      <div className={styles.calendar}>
        <div className={`${windowWidth < 1140 && isCalendarBlock ? styles.calendarBlockRow : styles.calendarRow}`}>
          <button
            type='button'
            className={styles.prevButton}
            style={{"--button-right-margin": buttonRightMargin}}
            onClick={goToPrevMonth}
            disabled={currentMonth <= new Date()}
          >
            <CalendarLeftArrowIcon />
          </button>

          {renderCalendarForMonth(currentMonth)}
          {renderCalendarForMonth(getNextMonth())}

          <button 
            type='button'
            className={styles.nextButton} 
            style={{"--button-left-margin": buttonLeftMargin}}
            onClick={goToNextMonth}
          >
            <CalendarRightArrowIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Calendar
