import React, { useState } from 'react'
import styles from './Calendar.module.css'
import { CalendarLeftArrowIcon, CalendarRightArrowIcon } from '../../icons'

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const goToNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    )
  const goToPrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    )

  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(
        <div key={`empty-${i}`} className={styles.emptySlot}></div>
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).setHours(0, 0, 0, 0)
      const isPastDate = isCurrentMonth && date < today

      daysArray.push(
        <div
          key={day}
          className={`${styles.date} ${isPastDate ? styles.pastDate : ''}`}
        >
          {day}
        </div>
      )
    }
    return daysArray
  }

  const renderCalendarForMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const monthName = date.toLocaleString('default', { month: 'long' })
    const isCurrentMonth =
      currentMonth.getFullYear() === year && currentMonth.getMonth() === month

    return (
      <div className={styles.monthContainer}>
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
        <div className={styles.calendarRow}>
          <button
            className={styles.prevButton}
            onClick={goToPrevMonth}
            disabled={currentMonth <= new Date()}
          >
            <CalendarLeftArrowIcon />
          </button>

          {renderCalendarForMonth(currentMonth)}
          {renderCalendarForMonth(getNextMonth())}

          <button 
            className={styles.nextButton} 
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
