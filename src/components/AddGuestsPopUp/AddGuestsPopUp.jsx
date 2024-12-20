import styles from './AddGuestsPopUp.module.css'
import Guest from './Guest/Guest'
import { guestsData } from '../../utils/guestData'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const AddGuestsPopUp = ({
  onGuestChange,
  style,
  toggleShowGuests,
  adultsCount: initialAdultsCount,
  childrenCount,
  infantsCount,
  petsCount,
  allowGuestsNumber = { peopleNumber: 0, petsNumber: 0 },
  setGuestCounts,
  currentTotalPeople,
  toggleGuestCountPopup,
  isSearchWhoDropdown,
  setGuestSearchCounts,
  currentSearchTotalPeople,
  handleGuestSearchClick,
  setGuests,
}) => {
  const { t } = useTranslation()

  const { peopleNumber, petsNumber } = allowGuestsNumber
  const adjustedAdultsCount = initialAdultsCount === 0 && (infantsCount > 0 || petsCount > 0 || childrenCount > 0)
    ? 1
    : initialAdultsCount;

    useEffect(() => {
      if (isSearchWhoDropdown) {
      setGuests((prevGuests) =>
        prevGuests.map((guest) =>
          guest.typeofGuest === 'Adults'
            ? { ...guest, numberOfGuests: adjustedAdultsCount }
            : guest
        )
      );
      }
    }, [adjustedAdultsCount, setGuests, isSearchWhoDropdown]);

    const peopleWord = t('search.guests', {count: peopleNumber}); 
    const petsWord =  t('search.pets', {count: petsNumber}) 

  return (
    <div className={styles.popup} style={style}>
      {guestsData?.map((guest) => {
        let count
        if (guest.title === 'Adults') {
          count = adjustedAdultsCount;
        } else if (guest.title === 'Children') {
          count = childrenCount
        } else if (guest.title === 'Infants') {
          count = infantsCount
        } else if (guest.title === 'Pets') {
          count = petsCount
        }
        return (
          <Guest
            key={guest.index}
            title={guest.title}
            description={guest.description}
            descriptionType={guest.descriptionType}
            onGuestChange={onGuestChange}
            count={count}
            allowGuestsNumber={allowGuestsNumber}
            setGuestCounts={setGuestCounts}
            currentTotalPeople={currentTotalPeople}
            toggleGuestCountPopup={toggleGuestCountPopup}
            isSearchWhoDropdown={isSearchWhoDropdown}
            setGuestSearchCounts={setGuestSearchCounts}
            currentSearchTotalPeople={currentSearchTotalPeople}
            handleGuestSearchClick={handleGuestSearchClick}
            childrenCount={childrenCount}
            infantsCount={infantsCount}
            petsCount={petsCount}
          />
        )
      })}
      {!isSearchWhoDropdown && (
        <>
          <div className={styles.popupText}>
            {t('product.maximumGuests', { peopleNumber, peopleWord })}
            {petsNumber > 0
             ? t('product.petsAllowed', { petsNumber, petsWord })
             : t('product.petsNotAllowed')}
          </div>
          <div className={styles.closePopUp}>
            <button onClick={toggleShowGuests}>{t('product.close')}</button>
          </div>
        </>
      )}
    </div>
  )
}

export default AddGuestsPopUp
