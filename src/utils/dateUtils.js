
export const calculateNights = (checkIn, checkOut) => {
  return ((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) | 0
}

export const formatDate = (date, language) => {
  const locale = language === 'de' ? 'de-DE' : language === 'ukr' ? 'uk-UA' : 'en-US';

  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return new Date(date).toLocaleDateString(locale, options)
}

export const getStayPeriod = (checkIn, checkOut, language) => {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  if (isNaN(checkInDate) || isNaN(checkOutDate)) {
    return ''
  }

  const formattedCheckIn = formatDate(checkInDate, language)
  const formattedCheckOut = formatDate(checkOutDate, language)

  return `${formattedCheckIn} - ${formattedCheckOut}`
}

export const convertStringToDateObject = (dateString) => {
  if (!dateString) return null;
  const [month, day, year] = dateString.split('/').map(Number)
  return { day, month: month - 1, year }
}

export const isBooked = (
  day,
  month,
  year,
  alreadyBookedDates,
  isSearchBarCalendar
) => {
  if (isSearchBarCalendar) return
  if (!Array.isArray(alreadyBookedDates)) {
    return false
  }
  const currentDateString = `${String(month + 1).padStart(2, '0')}/${String(
    day
  ).padStart(2, '0')}/${year}`

  return alreadyBookedDates.some(({ startDate, endDate }) => {
    const [startMonth, startDay, startYear] = startDate.split('/').map(Number)
    const [endMonth, endDay, endYear] = endDate.split('/').map(Number)
    const [currMonth, currDay, currYear] = currentDateString
      .split('/')
      .map(Number)

    const start = new Date(startYear, startMonth - 1, startDay)
    const end = new Date(endYear, endMonth - 1, endDay)
    const current = new Date(currYear, currMonth - 1, currDay)

    return current >= start && current <= end
  })
}

export const isDayBeforeBooked = (
  day,
  month,
  year,
  alreadyBookedDates,
  isSearchBarCalendar
) => {
  if (isSearchBarCalendar) return
  const currentDate = new Date(year, month, day).getTime()

  return alreadyBookedDates.some(({ startDate }) => {
    const [startMonth, startDay, startYear] = startDate.split('/').map(Number)
    const previousDay = new Date(startYear, startMonth - 1, startDay - 1)

    return currentDate === previousDay.getTime()
  })
}

export const minStayBeforeBooked = (
  day,
  month,
  year,
  alreadyBookedDates,
  minStayNights,
  isSearchBarCalendar
) => {
  if (isSearchBarCalendar) return
  const currentDate = new Date(year, month, day).getTime()

  return alreadyBookedDates.some(({ startDate }) => {
    const [startMonth, startDay, startYear] = startDate.split('/').map(Number)
    const bookedDate = new Date(startYear, startMonth - 1, startDay)
    const previousDay = new Date(bookedDate)
    previousDay.setDate(bookedDate.getDate() - 1)
    const minStayRangeStartDate = new Date(previousDay)
    minStayRangeStartDate.setDate(previousDay.getDate() - minStayNights)

    return (
      currentDate > minStayRangeStartDate.getTime() &&
      currentDate < previousDay.getTime()
    )
  })
}

export const isBetweenCheckInAndOut = (
  day,
  month,
  year,
  pickedCheckIn,
  pickedCheckOut
) => {
  if (pickedCheckIn && pickedCheckOut) {
    const currentDate = new Date(year, month, day).getTime()
    const checkInDate = new Date(
      pickedCheckIn.year,
      pickedCheckIn.month,
      pickedCheckIn.day
    ).getTime()
    const checkOutDate = new Date(
      pickedCheckOut.year,
      pickedCheckOut.month,
      pickedCheckOut.day
    ).getTime()

    return currentDate >= checkInDate && currentDate <= checkOutDate
  }
  return false
}

export const isWithinMinStay = (
  day,
  month,
  year,
  pickedCheckIn,
  pickedCheckOut,
  minStayNights
) => {
  if (pickedCheckIn && minStayNights && !pickedCheckOut) {
    const checkInDate = new Date(
      pickedCheckIn.year,
      pickedCheckIn.month,
      pickedCheckIn.day
    )
    const minStayEndDate = new Date(checkInDate)
    minStayEndDate.setDate(checkInDate.getDate() + minStayNights)

    const currentDate = new Date(year, month, day)

    return currentDate > checkInDate && currentDate < minStayEndDate
  }
  return false
}


// export function formatDateToMonthDay(dateString, language) {
  
//   // const languagePlaceholder = language === 'de' ? 'Datum' : language === 'ukr' ? 'Дата' : 'Add dates';
  
//   const placeholder = ["Add dates", "Datum", "Дата"];
//   if (!dateString || typeof dateString !== "string") {
//     throw new Error("Invalid dateString provided");
//   }

//   if (placeholder.includes(dateString)) {
//     return dateString;
//   }

//   const parts = dateString.split("/"); 
//   if (!placeholder.includes(dateString) && parts.length !== 3) {
//     throw new Error("dateString must be in MM/DD/YYYY format");
//   }
//   const [month, day, year] = parts.map(Number);
//   if (isNaN(month) && !placeholder.includes(dateString) || 
//       isNaN(day) && !placeholder.includes(dateString) ||
//       isNaN(year) && !placeholder.includes(dateString)) {
//     throw new Error("dateString contains invalid numbers");
//   }
//   const date = new Date(year, month - 1, day); 
//   if (!placeholder.includes(dateString) && isNaN(date.getTime())) {
//     throw new Error("Invalid date created from dateString");
//   } else if (placeholder.includes(dateString)) {
//     return dateString;
//   }
//   const locale = language === 'de' ? 'de-DE' : language === 'ukr' ? 'uk-UA' : 'en-US';

//   return new Intl.DateTimeFormat(locale, { month: "short", day: "2-digit" }).format(date);
// }

export function formatDateToMonthDay(dateString, language, monthTranslations) {
  const placeholder = ["Add dates", "Datum", "Дата"];

  if (!dateString || placeholder.includes(dateString)) {
    return monthTranslations.addDates;
  }

  try {
    const parts = dateString.split("/");
    if (parts.length !== 3) {
      throw new Error("dateString must be in MM/DD/YYYY format");
    }

    const [month, day, year] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    const locale = language === 'de' ? 'de-DE' : 
                  language === 'ukr' ? 'uk-UA' : 'en-US';

    return new Intl.DateTimeFormat(locale, { 
      month: "short", 
      day: "2-digit" 
    }).format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString; 
  }
}


export function formatDateRange(checkIn, checkOut, monthTranslations, language) {
  
  const parseDate = (dateString) => {    
    const placeholder = ["Add dates", "Datum", "Дата"];
    if (!dateString || placeholder.includes(dateString)) {
      return null;
    }
    const [month, day, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day); 
  };

  const checkInDate = parseDate(checkIn);
  const checkOutDate = parseDate(checkOut);

  if (!checkInDate && !checkOutDate) {
    return monthTranslations.addDates;
  }

  const locale = language === 'de' ? 'de-DE' : language === 'ukr' ? 'uk-UA' : 'en-US';

  if (checkInDate && !checkOutDate) {
    const optionsMonthDay = { month: "short", day: "numeric" };
    return checkInDate.toLocaleDateString(locale, optionsMonthDay);
  }

  const optionsMonthDay = { month: "short", day: "numeric" };
  const optionsDayOnly = { day: "numeric" };

  const checkInMonthIndex = checkInDate.getMonth();
  const checkOutMonthIndex = checkOutDate ? checkOutDate.getMonth() : null;

  const checkInMonth = monthTranslations[checkInMonthIndex];
  const checkOutMonth = checkOutMonthIndex !== null ? monthTranslations[checkOutMonthIndex] : null;

  if (checkInMonth === checkOutMonth) {
    return `${checkInDate.toLocaleDateString(locale, optionsMonthDay)} - ${checkOutDate.toLocaleDateString(locale, optionsDayOnly)}`;
  }

  return `${checkInDate.toLocaleDateString(locale, optionsMonthDay)} - ${checkOutDate ? checkOutDate.toLocaleDateString(locale, optionsMonthDay) : ''}`;
}



export function convertDateObjectToString(dateObject) {
  const day = dateObject.getDate();
  const month = dateObject.getMonth();
  const year = dateObject.getFullYear();
  return `${String(month + 1).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`;
};


export const getInitialMonth = (checkInDate, alreadyBookedDates, findNextAvailableDate, minStayNights) => {
  if (checkInDate) {
    const { year, month } = convertStringToDateObject(checkInDate);
    return new Date(year, month, 1);
  }

  if (alreadyBookedDates && alreadyBookedDates.length > 0) {
    const { checkIn } = findNextAvailableDate(alreadyBookedDates, minStayNights);
    return new Date(checkIn.getFullYear(), checkIn.getMonth(), 1);
  }

  return new Date();
};


export const isDateDisabled = (day, month, year, isSearchBarCalendar, alreadyBookedDates, minStayNights) => {
  if (isSearchBarCalendar) {
    return false;
  }

  const today = new Date();
  const yearObject = today.getFullYear();
  const monthObject = today.getMonth() + 1;
  const dayObject = 1;
  
  const currentMonthDate = `${monthObject.toString().padStart(2, '0')}/${dayObject.toString().padStart(2, '0')}/${yearObject}`;


  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.getDate();
 
  const formattedYesterdayDate = `${monthObject.toString().padStart(2, '0')}/${yesterdayDate.toString().padStart(2, '0')}/${yearObject}`;


const beforeTodayDates = {
  startDate: currentMonthDate,
  endDate: formattedYesterdayDate
}

const bookedDatesPlusBeforeTodayDates = [ beforeTodayDates , ...alreadyBookedDates]


  const currentDate = new Date(year, month, day).getTime();

  const getTimestamp = (dateStr) => {
    const [month, day, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
  };

  const bookingPeriods = bookedDatesPlusBeforeTodayDates
    .map((booking) => ({
      start: getTimestamp(booking.startDate),
      end: getTimestamp(booking.endDate) + 24 * 60 * 60 * 1000 - 1,
    }))
    .sort((a, b) => a.start - b.start);

  const nextBooking = bookingPeriods.find((period) => period.start > currentDate);
  const previousBooking = [...bookingPeriods]
    .reverse()
    .find((period) => period.end < currentDate);
  
  if (previousBooking && nextBooking) {
    const gapFromPreviousBooking = Math.floor(
      (currentDate - previousBooking.end) / (1000 * 60 * 60 * 24)
    );
    const gapUntilNextBooking = Math.floor(
      (nextBooking.start - currentDate) / (1000 * 60 * 60 * 24)
    );

    if (gapFromPreviousBooking + gapUntilNextBooking + 1 < minStayNights) {
      return true;
    }

    const totalGap = Math.floor(
      (nextBooking.start - previousBooking.end) / (1000 * 60 * 60 * 24)
    );
    if (totalGap <= minStayNights && currentDate > previousBooking.end && currentDate < nextBooking.start) {
      return true;
    }
  }

  if (isBooked(day, month, year, bookedDatesPlusBeforeTodayDates, false)) {
    return true;
  }

  return false;
};