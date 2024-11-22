import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import Calendar from "../Calendar/Calendar";
import CalendarToggle from "../calendarToggle/CalendarToggle";
import DataIncrementsButtonForTheCalendar from "../DataIncrementsButtonForTheCalendar/DataIncrementsButtonForTheCalendar";
import useOutsideClick from "../../hooks/useOutsideClick";
import { formatDateToMonthDay, formatDateRange, convertStringToDateObject, convertDateObjectToString } from "../../utils/dateUtils";
import { CloseButtonIcon } from "../../icons/CloseButtonIcon";
import AddGuestsPopUp from "../AddGuestsPopUp/AddGuestsPopUp";
import { calculateGuestCounts } from "../../utils/guestCounts";

const SearchBar = ({ searchType, onSearch }) => {
  const [selectedOption, setSelectedOption] = useState('exact');
  const [searchCheckIn, setSearchCheckIn] = useState("Add dates");
  const [searchCheckOut, setSearchCheckOut] = useState("Add dates");
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
  const [hoverStates, setHoverStates] = useState({
    location: false,
    checkIn: false,
    checkOut: false,
    guests: false,
    date: false,
  });
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [focusedSearchBar, setFocusedSearchBar] = useState(false);
  const [isSearchWhoDropdown, setIsSearchWhoDropdown] = useState(true);
  const [guestSearchCounts, setGuestSearchCounts] = useState({
    "adults": 0,
    "children": 0,
    "infants": 0,
    "pets": 0
  });

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
  const closeWhoDropdown = () => setShowWhoDropdown(false)

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
    searchCheckIn && searchCheckIn !== "Add dates" ? setSelectedBlock("checkOut") : setSelectedBlock("checkIn")
  }, [searchCheckIn])

  useEffect(() => {
    searchCheckIn && searchCheckOut && searchType === "experiences" ? setSelectedBlock("date") : null
  }, [searchCheckIn, searchType, searchCheckOut])
  

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
    if (showCalendar || showWhoDropdown) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showCalendar, showWhoDropdown, closing]);


  const handleSearch = () => {
    const adults = adultsCount
    const children = childrenCount
    const infants = infantsCount
    const pets = petsCount
    const validCheckIn = checkInToServer && !isNaN(new Date(checkInToServer).getTime()) ? checkInToServer : null;
    const validCheckOut = checkOutToServer && !isNaN(new Date(checkOutToServer).getTime()) ? checkOutToServer : null;
    const validadultsCount = adults && !isNaN(adults) ? adults : 0;
    const validchildrenCount = children && !isNaN(children) ? children : 0;
    const validinfantsCount = infants && !isNaN(infants) ? infants : 0;
    const validpetsCount = pets && !isNaN(pets) ? pets : 0;
  
    const searchParams = {
      location,
      checkIn: validCheckIn || null,
      checkOut: validCheckOut || null,
      adults: validadultsCount || 0,
      children: validchildrenCount || 0,
      infants: validinfantsCount || 0,
      pets: validpetsCount || 0
    };
  
    onSearch(searchParams);
  };
  
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
          onClick={() => handleBlockClick("where")}  
        >
          <div className={styles.locationContentWrapper}>
            <span className={styles.label}>Where</span>
            <input
              className={styles.inputTextPlaceholder}
              type="text"
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}

            />
          </div>
          {location && selectedBlock === "where" && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setLocation("")
              }}
              className={styles.searchDeleteContentBtn}
            >
              <CloseButtonIcon />
            </button>
          )}
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
                <span className={styles.label}>Check in</span>
                <div className={styles.checkInText}>{formatDateToMonthDay(searchCheckIn)}
                  <span className={styles.additionalDates}>
                    {searchCheckIn && searchCheckIn !== "Add dates" && (
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
              {searchCheckIn && searchCheckIn !== "Add dates" && selectedBlock === "checkIn" && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchCheckIn("Add dates")
                  setSearchCheckOut("Add dates")
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
                <span className={styles.label}>Check out</span>
                <div className={styles.checkOutText}>{formatDateToMonthDay(searchCheckOut)}
                  <span className={styles.additionalDates}>
                    {searchCheckOut && searchCheckOut !== "Add dates" && (
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
              {searchCheckOut && searchCheckOut !== "Add dates" && selectedBlock === "checkOut" && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchCheckIn("Add dates")
                  setSearchCheckOut("Add dates")
                }}
                className={styles.searchDeleteContentBtn}
              >
                <CloseButtonIcon />
              </button> 
              )}
            </div>
            {showCalendar && (
              <div className={`${styles.calendarWrapper} ${closing ? styles.close : styles.open}`}>
                <div className={styles.calendarToggleWrapper}>
                  <CalendarToggle />
                </div>
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
                <span className={styles.label}>Date</span>
                <div className={styles.experienceDatesWrapper}>
                  <span className={styles.checkInText}>{formatDateRange(searchCheckIn, searchCheckOut)}</span>
                </div>
              </div>
              {searchCheckIn && searchCheckIn !== "Add dates" && selectedBlock === "date" && ( 
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchCheckIn("Add dates")
                  setSearchCheckOut("Add dates")
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
            <span className={styles.label}>Who</span>
            <span className={styles.guestsText}>
              {adultsAndChildrenCount ? `${adultsAndChildrenCount <=15 ? adultsAndChildrenCount :
                 adultsAndChildrenCount + '+'} guest${adultsAndChildrenCount !== 1 ? 's' : ''}` : ''}
              {infantsCount ? `, ${infantsCount} infant${infantsCount !== 1 ? 's' : ''}` : ''}
              {petsCount ? `, ${petsCount} pet${petsCount !== 1 ? 's' : ''}` : ''}
              {!adultsAndChildrenCount && !infantsCount && !petsCount && 'Add guests'}
            </span>
          </div>
          {guests && guests !== "Add guests" && selectedBlock === "guests" && ( 
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setGuests("Add guests")
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
                isSearchWhoDropdown={isSearchWhoDropdown}
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
