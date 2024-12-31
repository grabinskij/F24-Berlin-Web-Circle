import { useEffect, useState } from 'react'
import styles from './AuthForm.module.css'
import { CloseIcon } from '../../../icons'

export const AuthForm = ({ 
    handleClick, 
    setShowAuthPopup,
    setEmail,
    email,
    setPass,
    pass
  }) => {
  const [emailDirty, setEmailDirty] = useState(false)
  const [emailError, setEmailError] = useState('Email can not be empty')
  const [passDirty, setPassDirty] = useState(false)
  const [passError, setPassError] = useState('Password can not be empty')
  const [formValid, setFormValid] = useState(false)

  useEffect(() => {
    if (emailError || passError) {
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [emailError, passError])

  const emailHandler = (e) => {
    setEmail(e.target.value)
    const valEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!valEmail.test(String(e.target.value).toLowerCase())) {
      setEmailError('Email is not correct')
    } else {
      setEmailError('')
    }
  }
  const passHandler = (e) => {
    setPass(e.target.value)
    if (e.target.value.length < 5 || e.target.value.length > 20) {
      setPassError('Password should be longer than 3 and shorter than 20')
      if (!e.target.value) {
        setPassError('Password can not be empty')
      }
    } else {
      setPassError('')
    }
  }

  const blurHandler = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmailDirty(true)
        break
      case 'pass':
        setPassDirty(true)
        break
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
          <h3>Login or register</h3>
        </div>
        <div className={styles.formContent}>
          {emailDirty && emailError && (
            <div className={styles.error}>{emailError}</div>
          )}
          <input
            onBlur={(e) => blurHandler(e)}
            name="email"
            type="email"
            value={email}
            onChange={(e) => emailHandler(e)}
            placeholder="email"
          />
          {passDirty && passError && (
            <div className={styles.error}>{passError}</div>
          )}
          <input
            onBlur={(e) => blurHandler(e)}
            name="pass"
            type="password"
            value={pass}
            onChange={(e) => passHandler(e)}
            placeholder="password"
          />
        </div>
        <div className={styles.confirmButtonContainer}>
          <button
            disabled={!formValid}
            className={styles.confirmButton}
            onClick={() => handleClick(email, pass)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
