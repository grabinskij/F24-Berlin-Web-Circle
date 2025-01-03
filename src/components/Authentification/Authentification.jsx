import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from 'firebase/auth'
import axios from 'axios'
import Popup from '../ReservationCard/PopUp/PopUp'
import { AuthForm } from './AuthForm/AuthForm'
import { auth } from '../../firebase'
import { BASE_URL } from '../../constants/constants'

const Authentification = ({
  showAuthPopup,
  setShowAuthPopup,
  showAuthPopupHandler,
  setVerifiedName
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [formValid, setFormValid] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleFormError = () => {
    setSubmitError(true)
    setTimeout(() => {
      setSubmitError(false)
    }, 5000)
  }


  const handleLogin = async () => {
    if (!formValid || !email || !password || !name || !surname) {
      console.error('All fields are required.')
      handleFormError()
      return
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email)
      
      try {
        let userCredential;
        
        if (methods.length > 0) {
          userCredential = await signInWithEmailAndPassword(auth, email, password)
        } else {
          userCredential = await createUserWithEmailAndPassword(auth, email, password)
        }
  
        await auth.authStateReady()
        
        const idToken = await userCredential.user.getIdToken()
        const response = await axios.post(
          `${BASE_URL}users/register`,
          {name, surname},
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        )

        const verifiedName = response.data?.name || ''

        if (verifiedName) {
          setVerifiedName(verifiedName)
          localStorage.setItem('verifiedName', verifiedName)
        }
        if(response.status === 201) {
          setShowAuthPopup(false)
        }
      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          console.error('Incorrect password')
        } else if (error.code === 'auth/weak-password') {
          console.error('Password should be at least 6 characters')
        } else {
          console.error('Authentication error:', error.message)
        }
      }
  
    } catch (error) {
      console.error('Error checking email:', error.message)
    }
  }
  
  return (
    <Popup isVisible={showAuthPopup} onClose={showAuthPopupHandler}>
      <AuthForm
        setEmail={setEmail}
        email={email}
        setPass={setPassword}
        pass={password}
        handleClick={handleLogin}
        setShowAuthPopup={setShowAuthPopup}
        name={name}
        setName={setName}
        surname={surname}
        setSurname={setSurname}
        formValid={formValid}
        setFormValid={setFormValid}
        submitError={submitError}
        setSubmitError={setSubmitError}
      />
    </Popup>
  )
}

export default Authentification
