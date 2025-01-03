import { useEffect, useState } from 'react'
import styles from './AuthForm.module.css'
import { CloseIcon } from '../../../icons'
import { useTranslation } from 'react-i18next'

export const AuthForm = ({ 
    handleClick, 
    setShowAuthPopup,
    setEmail,
    email,
    setPass,
    pass,
    name,
    setName,
    surname,
    setSurname,
    formValid,
    setFormValid,
    submitError
  }) => {
  const [emailError, setEmailError] = useState('')
  const [passError, setPassError] = useState('')
  const [nameError, setNameError] = useState('')
  const [surnameError, setSurnameError] = useState('')
  const [focusedField, setFocusedField] = useState(null);

  const { t } = useTranslation()

  useEffect(() => {
    if ( !emailError && !passError && !nameError && !surnameError &&
      !email && !pass && !name && !surname) {
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [emailError,
     passError, 
     nameError, 
     surnameError, 
     setFormValid,
     email, 
     pass, 
     name,  
     surname
    ])
  

  const nameHandler = (e) => {
    const value = e.target.value;
    setName(value); 
    if (!value.trim()) {
      setNameError(t('authentication.name_cannot_be_empty'));
    } else if (value.length > 40) {
      setNameError(t('authentication.name_cannot_be_longer_than_40'));
    } else {
      setNameError('');
    }
  };
  
  const surnameHandler = (e) => {
    const value = e.target.value;
    setSurname(value); 
    if (!value.trim()) {
      setSurnameError(t('authentication.surname_cannot_be_empty'));
    } else if (value.length > 40) {
      setSurnameError(t('authentication.surname_cannot_be_longer_than_40'));
    } else {
      setSurnameError(''); 
    }
  };

  const emailHandler = (e) => {
    setEmail(e.target.value)
    const valEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!valEmail.test(String(e.target.value).toLowerCase())) {
      setEmailError(t('authentication.email_is_not_correct'))
    } else {
      setEmailError('')
    }
  }
  const passHandler = (e) => {
    setPass(e.target.value)
    if (e.target.value.length <= 6 || e.target.value.length > 50) {
      setPassError(t('authentication.password_length_error'))
      if (!e.target.value) {
        setPassError(t('authentication.password_cannot_be_empty'))
      }
    } else {
      setPassError('')
    }
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formInner}>
        <div className={styles.formHeader}>
          <button
            className={styles.closeButton}
            onClick={() => setShowAuthPopup(false)}
          >
            <CloseIcon />
          </button>
          <h3>{t('authentication.login_or_register')}</h3>
        </div>
        <div className={styles.formContent}>
        {focusedField === 'name' && nameError && (
            <div className={styles.error}>{nameError}</div>
          )}
        <input
            name="name"
            type="text"
            value={name}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => nameHandler(e)}
            placeholder={t('authentication.first_name')}
            required
          />
        {focusedField === 'surname' && surnameError && (
            <div className={styles.error}>{surnameError}</div>
          )}
        <input
            name="surname"
            type="text"
            value={surname}
            onFocus={() => setFocusedField('surname')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => surnameHandler(e)}
            placeholder={t('authentication.last_name')}
            required
          />
          {focusedField === 'email' && emailError && (
            <div className={styles.error}>{emailError}</div>
          )}
          <input
            name="email"
            type="email"
            value={email}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => emailHandler(e)}
            placeholder={t('authentication.email')}
            required
          />
          {focusedField === 'pass' && passError && (
            <div className={styles.error}>{passError}</div>
          )}
          <input
            name="pass"
            type="password"
            value={pass}
            onFocus={() => setFocusedField('pass')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => passHandler(e)}
            placeholder={t('authentication.password')}
            required
          />
        </div>
        <div>
          {submitError && <div className={styles.error}>{t('authentication.please_fill_all_fields')}</div>}
        </div>
        <div className={styles.confirmButtonContainer}>
          <button
            disabled={!formValid}
            className={styles.confirmButton}
            onClick={() => handleClick()}
          >
            {t('search.logIn')}
          </button>
        </div>
      </div>
    </div>
  )
}
