import { useState } from 'react'
import styles from './HeaderUserMenu.module.css'
import useOutsideClick from '../../hooks/useOutsideClick'
import { useTranslation } from 'react-i18next'
import Authentification from '../Authentification/Authentification'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const HeaderUserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [verifiedName, setVerifiedName] = useState(localStorage.getItem('verifiedName') || '')
  const { user, loading, logout } = useAuth()

  const navigate = useNavigate()

  const showAuthPopupHandler = () => {
    setShowAuthPopup((prevState) => !prevState)
  }

  const handleClick = () => {
    setIsOpen((prevState) => !prevState)
  }

  const { t } = useTranslation()

  const userMenuRef = useOutsideClick(() => setIsOpen(false))

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    setVerifiedName('')
    localStorage.removeItem('verifiedName')
    navigate('/')
  }


  const firstLetterOfName = verifiedName?.charAt(0).toUpperCase();


  return (
    <div className={styles.headerContainer} ref={userMenuRef}>
      <button
        type="button"
        className={styles.headerButton}
        aria-expanded={isOpen}
        label="Main navigation menu"
        onClick={handleClick}
      >
        <div className={styles.iconContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className={styles.hamburgerIcon}
          >
            <path
              d="M2 8h28M2 16h28M2 24h28"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>
        { !verifiedName ? (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className={styles.profileIcon}
          >
            <path
              d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.5 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"
              fill="currentColor"
            />
          </svg>
        </div>
        ) : (
          <span className={styles.verifiedName}>{firstLetterOfName}</span> 
        )}
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <ul>
            {!user && !loading ? (
              <>
                <li
                  onClick={() => {
                    showAuthPopupHandler()
                    setIsOpen(false)
                  }}
                  className={styles.signUp}
                >
                  {t('search.signUp')}
                </li>
                <li
                  onClick={() => {
                    showAuthPopupHandler()
                    setIsOpen(false)
                  }}
                >
                  {t('search.logIn')}
                </li>
              </>
            ) : (
              <li onClick={() => handleLogout()}>{t('authentication.logOut')}</li>
            )}
            <hr className={styles.menuSeperator} />
            <li>{t('search.giftCards')}</li>
            {user && !loading && (
            <li onClick={() => navigate('/bookings')}>{t('search.bookings')}</li>
            )}
            <li>{t('search.hostAnExperience')}</li>
            <li>{t('search.helpCenter')}</li>
          </ul>
        </div>
      )}
      <Authentification
        showAuthPopupHandler={showAuthPopupHandler}
        showAuthPopup={showAuthPopup}
        setShowAuthPopup={setShowAuthPopup}
        setVerifiedName={setVerifiedName}
      />
    </div>
  )
}

export default HeaderUserMenu
