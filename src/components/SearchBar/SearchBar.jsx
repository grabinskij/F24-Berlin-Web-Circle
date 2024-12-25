import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import Calendar from "../Calendar/Calendar";
// import CalendarToggle from "../calendarToggle/CalendarToggle";
import DataIncrementsButtonForTheCalendar from "../DataIncrementsButtonForTheCalendar/DataIncrementsButtonForTheCalendar";
import useOutsideClick from "../../hooks/useOutsideClick";
import { formatDateToMonthDay, formatDateRange, convertStringToDateObject, convertDateObjectToString } from "../../utils/dateUtils";
import { CloseButtonIcon } from "../../icons/CloseButtonIcon";
import AddGuestsPopUp from "../AddGuestsPopUp/AddGuestsPopUp";
import DestinationPopUp from "../DestinationPopUp/DestinationPopUp";
import { calculateGuestCounts } from "../../utils/guestCounts";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";


const SearchBar = ({ searchType, onSearch }) => {
  const { t, i18n } = useTranslation();
  const languagePlaceholder = i18n.language === 'de' ? 'Datum' : i18n.language === 'ukr' ? 'Дата' : 'Add dates';

  const [selectedOption, setSelectedOption] = useState('exact');
  const [searchCheckIn, setSearchCheckIn] = useState(languagePlaceholder);
  const [searchCheckOut, setSearchCheckOut] = useState(languagePlaceholder);
  const [checkInToServer, setCheckInToServer] = useState('');
  const [checkOutToServer, setCheckOutToServer] = useState('');
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState([
    { typeofGuest: 'Adults', numberOfGuests: 0 },
    { typeofGuest: 'Children', numberOfGuests: 0 },
    { typeofGuest: 'Infants', numberOfGuests: 0 },
    { typeofGuest: 'Pets', numberOfGuests: 0 },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showWhoDropdown, setShowWhoDropdown] = useState(false);
  const [closing, setClosing] = useState(false);
  const [handelDestinationPopUp, setHandelDestinationPopUp] = useState(false);
  const [hoverStates, setHoverStates] = useState({
    location: false,
    checkIn: false,
    checkOut: false,
    guests: false,
    date: false,
  });
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [focusedSearchBar, setFocusedSearchBar] = useState(false);
  const [guestSearchCounts, setGuestSearchCounts] = useState({
    "adults": 0,
    "children": 0,
    "infants": 0,
    "pets": 0
  });

  const placeholder = ["Add dates", "Datum", "Дата"];
  
  function languageInput() {
    const isCheckInPlaceholder = placeholder.includes(searchCheckIn);
    const isCheckOutPlaceholder = placeholder.includes(searchCheckOut);
  
    if (isCheckInPlaceholder || isCheckOutPlaceholder) {
      if (!isCheckInPlaceholder && isCheckOutPlaceholder) {
        setSearchCheckOut(languagePlaceholder);
      } else {
        setSearchCheckIn(languagePlaceholder);
        setSearchCheckOut(languagePlaceholder);
      }
    }
  }

  useEffect(() => {
      languageInput()
  },[languagePlaceholder])

  useEffect(() => {
    setLocation("")
  },[i18n.language])


  const monthTranslations = {
    january: t('search.months.january'),
    february: t('search.months.february'),
    march: t('search.months.march'),
    april: t('search.months.april'),
    may: t('search.months.may'),
    june: t('search.months.june'),
    july: t('search.months.july'),
    august: t('search.months.august'),
    september: t('search.months.september'),
    october: t('search.months.october'),
    november: t('search.months.november'),
    december: t('search.months.december'),
    addDates: t('search.addDates'),
  };

  const currentSearchTotalPeople = guestSearchCounts.adults + guestSearchCounts.children;

  const {
    adultsCount,
    childrenCount,
    infantsCount,
    petsCount,
    adultsAndChildrenCount,
  } = calculateGuestCounts(guests)

  const handleGuestSearchClick = (updatedGuest) => {
    setGuests((prevList) =>
      prevList.map((guest) =>
        guest.typeofGuest === updatedGuest.typeofGuest
          ? { ...guest, numberOfGuests: updatedGuest.numberOfGuests }
          : guest
      )
    )
  }


  useEffect(() => {
    const createAdjustedDate = (baseDate, daysAdjustment) => {
      const adjustedDate = new Date(baseDate);
      adjustedDate.setDate(adjustedDate.getDate() + daysAdjustment);
      return adjustedDate;
    };
  
    if (!searchCheckIn || !searchCheckOut) {
      setCheckInToServer('');
      setCheckOutToServer('');
      return;
    }
  
    const searchCheckInObj = convertStringToDateObject(searchCheckIn);
    const searchCheckOutObj = convertStringToDateObject(searchCheckOut);
  
    const checkInBaseDate = new Date(searchCheckInObj.year, searchCheckInObj.month, searchCheckInObj.day);
    const checkOutBaseDate = new Date(searchCheckOutObj.year, searchCheckOutObj.month, searchCheckOutObj.day);
  
    const checkInDateObject = (() => {
      switch (selectedOption) {
        case "exact": return checkInBaseDate;
        case "1-day": return createAdjustedDate(checkInBaseDate, -1);
        case "2-days": return createAdjustedDate(checkInBaseDate, -2);
        case "3-days": return createAdjustedDate(checkInBaseDate, -3);
        case "7-days": return createAdjustedDate(checkInBaseDate, -7);
        case "14-days": return createAdjustedDate(checkInBaseDate, -14);
        default: throw new Error("Invalid option selected");
      }
    })();
  
    const checkOutDateObject = (() => {
      switch (selectedOption) {
        case "exact": return checkOutBaseDate;
        case "1-day": return createAdjustedDate(checkOutBaseDate, 1);
        case "2-days": return createAdjustedDate(checkOutBaseDate, 2);
        case "3-days": return createAdjustedDate(checkOutBaseDate, 3);
        case "7-days": return createAdjustedDate(checkOutBaseDate, 7);
        case "14-days": return createAdjustedDate(checkOutBaseDate, 14);
        default: throw new Error("Invalid option selected");
      }
    })();
  
    setCheckInToServer(convertDateObjectToString(checkInDateObject));
    setCheckOutToServer(convertDateObjectToString(checkOutDateObject));
  }, [searchCheckIn, searchCheckOut, selectedOption]);


  const prevSelectedBlock = useRef(null);

  const disableSearchBarFocus = () => { 
    setFocusedSearchBar(false);
    setSelectedBlock(null);
  }

  const closeCalendarPopup = () => setShowCalendar(false)
  const closeDestinationPopup = () => setHandelDestinationPopUp(false)
  const closeWhoDropdown = () => setShowWhoDropdown(false)

  const destinationRef = useOutsideClick(closeDestinationPopup)
  const searchBarRef = useOutsideClick(disableSearchBarFocus);
  const calendarRef = useOutsideClick(closeCalendarPopup)
  const whoRef = useOutsideClick(closeWhoDropdown)


  useEffect(() => {
    prevSelectedBlock.current = selectedBlock;
  }, [selectedBlock]);

  const handleBlockClick = (block) => {
    setSelectedBlock((prevBlock) => (prevBlock === block && selectedBlock !== 'where' ? null : block));
    setFocusedSearchBar(true);
  };

  const handleMouseHover = (block, isHovering) => {
    setHoverStates((prev) => ({
      ...prev,
      [block]: isHovering,
    }));
  };


  const toggleCalendar = () => {
    setShowCalendar((prevState) => !prevState);
  }

  const toggleWhoDropdown = () => {
    setShowWhoDropdown((prevState) => !prevState);
  }

  useEffect(() => {
    searchCheckIn && searchCheckIn !== "Add dates" ||
    searchCheckIn && searchCheckIn !== 'Datum' ||
    searchCheckIn && searchCheckIn !== 'Дата' ? 
    setSelectedBlock("checkOut") : setSelectedBlock("checkIn")
  }, [searchCheckIn])

  useEffect(() => {
    searchCheckIn && searchCheckOut && searchType === "experiences" ? setSelectedBlock("date") : null
  }, [searchCheckIn, searchType, searchCheckOut])
  

  const windowWidth = useWindowSize();

  useEffect(() => {
    const handleScroll = () => {
      if ((showCalendar && !closing) || (showWhoDropdown && !closing)) {
        setClosing(true);
        setFocusedSearchBar(false);
        setSelectedBlock(null);
        setTimeout(() => {
          setShowCalendar(false);
          setShowWhoDropdown(false);
          setClosing(false);
        }, 300);
      }
    };
    const handleScrollDefault = () => {
      if ((showCalendar && !closing) || (showWhoDropdown && !closing)) {
        setClosing(false);
        setFocusedSearchBar(true);
      }
    };

    if (windowWidth > 1200 && (showCalendar || showWhoDropdown)) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScrollDefault);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScrollDefault);
    };
  }, [showCalendar, showWhoDropdown, closing, windowWidth]);

  useEffect(() => {
    if (location && showCalendar) {
      setSelectedBlock("checkIn");
    }
  }, [location, showCalendar]);

  const handleSearch = () => {
    const validateCount = (count) => (count && !isNaN(count) ? count : 0);
    const validateDate = (date) => (date && !isNaN(new Date(date).getTime()) ? date : null);
  
    const transformLocation = (location) => {
      if (location === t('search.unitedStates')) return 'USA';
      if (location === t('search.middleEast')) return 'Jordan';
      if (location === t('search.southeastAsia')) return 'Thailand'; 
      if (location === t('search.spain')) return 'Spain';
      if (location === t('search.italy')) return 'Italy';
      if (location === t('search.imFlexible')) return '';
      return location;
    };

    const searchParams = {
      location: transformLocation(location),
      checkIn: validateDate(checkInToServer),
      checkOut: validateDate(checkOutToServer),
      adults: validateCount(adultsCount),
      children: validateCount(childrenCount),
      infants: validateCount(infantsCount),
      pets: validateCount(petsCount),
    };
  
    onSearch(searchParams);
  };

  const handelDestinationClick = () =>{
    setHandelDestinationPopUp(true);
  }
  const handelDestination = (destination) =>{
    setLocation(destination);
    setShowCalendar(true);
  }

  return (
    <>
      <div className={`${styles.searchBar} ${focusedSearchBar ? styles.focused : ''}`} ref={searchBarRef}>
        <div 
          className={`${styles.inputContainerWhere} 
                      ${selectedBlock === "where" ? styles.selected : ''}
                      ${selectedBlock === "checkIn" || selectedBlock === "date" ? styles.hoveredWhereBlock : ''}
                    `}
          onMouseEnter={() => handleMouseHover("location", true)}
          onMouseLeave={() => handleMouseHover("location", false)}
          onClick={() => {
            handleBlockClick("where")
            handelDestinationClick()
          }}
          ref={destinationRef}
        >
          <div className={styles.locationContentWrapper} onClick={handelDestinationClick}>
            <span className={styles.label}>{t('search.where')}</span>
            <input
              className={styles.inputTextPlaceholder}
              type="text"
              placeholder={t('search.searchDestinations')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => {
                // handleSearch(); //Uncomment in case we want autosearch
                if (e.key === 'Enter') {
                  setHandelDestinationPopUp(false);
                  setShowCalendar(true);
                }
              }}    
            />
          </div>
          { handelDestinationPopUp && 
            <div className={styles.popupContainer}>
              <DestinationPopUp title={t('search.searchByRegion')} onClick={(e)=>handelDestination(e)}/>
            </div>
          }
        </div>
        <div className={styles.separatorWrapper}
             style={{ opacity: hoverStates.location ||
              hoverStates.checkIn ||
              hoverStates.date ||
               (selectedBlock === "where" && focusedSearchBar) ||
               (selectedBlock === "checkIn" && focusedSearchBar) ||
               (selectedBlock === "date" && focusedSearchBar) ?
               0 : 1 }}
        >
          <div className={styles.separator}></div>
        </div>
        {searchType === "stays" ? (
          <div className={styles.checkInOutWrapper} ref={calendarRef}>
            <div className={`${styles.inputContainerCheckIn} 
                             ${selectedBlock === "checkIn" ? styles.selected : ''}
                             ${selectedBlock === "where" ? styles.hoveredCheckInBlock : ''}
                             ${selectedBlock === "checkOut" ? styles.hoveredReversedCheckInBlock : ''}
                           `}
              onClick={() => {
                handleBlockClick("checkIn");
                if((prevSelectedBlock.current !== "checkOut" && showCalendar) ||
                  (!showCalendar)) {
                  toggleCalendar();
                }
              }}
              onMouseEnter={() => handleMouseHover("checkIn", true)}
              onMouseLeave={() => handleMouseHover("checkIn", false)}
            >
              <div className={styles.checkInTextWrapper}>
                <span className={styles.label}>{t('search.checkIn')}</span>
                <div className={styles.checkInText}>{languagePlaceholder && formatDateToMonthDay(searchCheckIn, i18n.language, monthTranslations)}
                  <span className={styles.additionalDates}>
                    {searchCheckIn && searchCheckIn !== t('search.addDates') && (
                      <>
                        {selectedOption === "1-day" && "±1"}
                        {selectedOption === "2-days" && "±2"}
                        {selectedOption === "3-days" && "±3"}
                        {selectedOption === "7-days" && "±7"}
                        {selectedOption === "14-days" && "±14"}
                      </>
                    )}
                  </span>
                </div>
              </div>
              {searchCheckIn && searchCheckIn !== t('search.addDates') && selectedBlock === "checkIn" && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchCheckIn(t('search.addDates'))
                  setSearchCheckOut(t('search.addDates'))
                }}
                className={styles.searchDeleteContentBtn}
              >
                <CloseButtonIcon />
              </button>
              )}
            </div>

            <div className={styles.separatorWrapper} 
                 style={{ opacity: hoverStates.checkIn ||
                   hoverStates.checkOut ||
                   (selectedBlock === "checkIn" && focusedSearchBar) ||
                   (selectedBlock === "checkOut" && focusedSearchBar) ? 
                   0 : 1 }}
            >
              <div className={styles.separator}></div>
            </div>

            <div className={`${styles.inputContainerCheckOut} 
                             ${selectedBlock === "checkOut" ? styles.selected : ''}
                             ${selectedBlock === "who" ? styles.hoveredCheckOutBlock : ''}
                             ${selectedBlock === "checkIn" ? styles.hoveredReversedCheckOutBlock : ''}
                           `}
                 onMouseEnter={() => handleMouseHover("checkOut", true)}
                 onMouseLeave={() => handleMouseHover("checkOut", false)}
                 onClick={() => {
                  handleBlockClick("checkOut")
                  if((prevSelectedBlock.current !== "checkIn" && showCalendar) ||
                  (!showCalendar)) {
                    toggleCalendar();
                  }
                }}
            >
              <div className={styles.checkOutTextWrapper}>
                <span className={styles.label}>{t('search.checkOut')}</span>
                <div className={styles.checkOutText}>{languagePlaceholder && formatDateToMonthDay(searchCheckOut, i18n.language, monthTranslations)}
                  <span className={styles.additionalDates}>
                    {searchCheckOut && searchCheckOut !== t('search.addDates') && (
                      <>
                        {selectedOption === "1-day" && "±1"}
                        {selectedOption === "2-days" && "±2"}
                        {selectedOption === "3-days" && "±3"}
                        {selectedOption === "7-days" && "±7"}
                        {selectedOption === "14-days" && "±14"}
                      </>
                    )}
                  </span>
                </div>
              </div>
              {searchCheckOut && searchCheckOut !== t('search.addDates') && selectedBlock === "checkOut" && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchCheckIn(t('search.addDates'))
                  setSearchCheckOut(t('search.addDates'))
                }}
                className={styles.searchDeleteContentBtn}
              >
                <CloseButtonIcon />
              </button> 
              )}
            </div>
            {showCalendar && (
              <div className={`${styles.calendarWrapper} ${closing ? styles.close : styles.open}`}>
                {/* <div className={styles.calendarToggleWrapper}>
                  <CalendarToggle />
                </div> */}
                <div className={styles.calendarContentWrapper}>
                  <Calendar 
                    dayItemWidth="48px" 
                    dayItemHeight="48px"
                    pickedDayWidth="46px"
                    pickedDayHeight="46px"
                    isSearchBarCalendar={true}
                    searchCheckIn={searchCheckIn}
                    searchCheckOut={searchCheckOut}
                    setSearchCheckIn={setSearchCheckIn}
                    setSearchCheckOut={setSearchCheckOut}
                  />
                </div>
                <div className={styles.incrementButtonWrapper}>
                  <DataIncrementsButtonForTheCalendar 
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                  />
                </div>
              </div>
            )}
            </div>
        ) : (
          <div className={styles.checkInOutExperiencesWrapper} ref={calendarRef}>
            <div className={`${styles.inputContainerDate} 
                              ${selectedBlock === "date" ? styles.selected : ''}
                              ${selectedBlock === "where" ? styles.hoveredDateBlock : ''}
                              ${selectedBlock === "who" ? styles.hoveredReversedDateBlock : ''}
                            `}
              onClick={() => {
                handleBlockClick("date")
                toggleCalendar()
              }}
              onMouseEnter={() => handleMouseHover("date", true)}
              onMouseLeave={() => handleMouseHover("date", false)}
            >
              <div className={styles.dateTextWrapper}>
                <span className={styles.label}>{t('search.date')}</span>
                <div className={styles.experienceDatesWrapper}>
                  <span className={styles.checkInText}>{formatDateRange(searchCheckIn, searchCheckOut, monthTranslations, i18n.language)}</span>
                </div>
              </div>
              {searchCheckIn && searchCheckIn !== t('search.addDates') && selectedBlock === "date" && ( 
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchCheckIn(t('search.addDates'))
                  setSearchCheckOut(t('search.addDates'))
                }}
                className={styles.searchDeleteContentBtn}
              >
                <CloseButtonIcon />
              </button> 
              )}
            </div>
            {showCalendar && (
              <div className={`${styles.calendarWrapper} ${closing ? styles.close : styles.open}`}>
                <div className={styles.calendarExperiencesWrapper}>
                  <Calendar 
                    dayItemWidth="48px" 
                    dayItemHeight="48px" 
                    pickedDayWidth="46px"
                    pickedDayHeight="46px"
                    isSearchBarCalendar={true}
                    searchCheckIn={searchCheckIn}
                    searchCheckOut={searchCheckOut}
                    setSearchCheckIn={setSearchCheckIn}
                    setSearchCheckOut={setSearchCheckOut}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <div className={styles.separatorWrapper}
             style={{ opacity: hoverStates.guests ||
              hoverStates.checkOut ||
              (selectedBlock === "who" && focusedSearchBar) ||
              (selectedBlock === "checkOut" && focusedSearchBar) ||
              (selectedBlock === "date" && focusedSearchBar) ||
              hoverStates.date ? 0 : 1 }}
        >
          <div className={styles.separator}></div>
        </div>
      <div className={styles.inputContainerWhoWrapper} ref={whoRef}>
        <div className={`${styles.inputContainerWho} 
                         ${selectedBlock === "who" ? styles.selected : ''}
                         ${selectedBlock === "checkOut" || selectedBlock === "date" ? styles.hoveredWhoBlock : ''}
                       `}
          onMouseEnter={() => handleMouseHover("guests", true)}
          onMouseLeave={() => handleMouseHover("guests", false)}
          onClick={() => {
            handleBlockClick("who")
            toggleWhoDropdown()
          }} 
        >
          <div className={styles.inputContainerWhoInner}>
            <span className={styles.label}>{t('search.who')}</span>
            <span className={styles.guestsText}>
              {adultsAndChildrenCount ? `${adultsAndChildrenCount <=15 ? adultsAndChildrenCount :
               adultsAndChildrenCount + '+'} ${t('search.guests', { count: adultsAndChildrenCount })}` : ''}
              {infantsCount ? `, ${infantsCount} ${t('search.infants', { count: infantsCount })}` : ''}
              {petsCount ? `, ${petsCount} ${t('search.pets', { count: petsCount })}` : ''}
              {!adultsAndChildrenCount && !infantsCount && !petsCount && t('search.addGuests')}
            </span>
          </div>
          {guests && guests !== t('search.addGuests') && selectedBlock === "guests" && ( 
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setGuests(t('search.addGuests'))
            }}
            className={styles.searchDeleteContentBtn}
          >
            <CloseButtonIcon />
          </button> 
          )}
          <div>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleSearch()
                setShowWhoDropdown(false)
              }}
              className={styles.circleButton}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
        {showWhoDropdown && (
            <div className={`${styles.whoDropdownWrapper} ${closing ? styles.close : styles.open}`}>
              <AddGuestsPopUp 
                isSearchWhoDropdown={true}
                adultsCount={adultsCount}
                childrenCount={childrenCount}
                infantsCount={infantsCount}
                petsCount={petsCount}
                setGuestSearchCounts={setGuestSearchCounts}
                currentSearchTotalPeople={currentSearchTotalPeople}
                handleGuestSearchClick={handleGuestSearchClick}
                setGuests={setGuests}
              />
            </div>
          )}
      </div>
    </div>
    </>
  );
};

export default SearchBar;
