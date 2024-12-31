import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import Popup from '../ReservationCard/PopUp/PopUp';
import { AuthForm } from './AuthForm/AuthForm';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

const Authentification = ({showAuthPopup, setShowAuthPopup, showAuthPopupHandler}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      console.error("Email and password are required.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);  
      const idToken = await userCredential.user.getIdToken();
      const response = await axios.post(
        'http://localhost:8800/users/register',
        {},
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      localStorage.setItem('loginInfo', JSON.stringify(response.data));
      navigate("/");
  
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const idToken = await userCredential.user.getIdToken();
          const response = await axios.post(
            'http://localhost:8800/users/register',
            {},
            {
              headers: { Authorization: `Bearer ${idToken}` },
            }
          );
          localStorage.setItem('loginInfo', JSON.stringify(response.data));
          navigate("/");
        } catch (registerError) {
          console.error('Error registering user:', registerError.message);
        }
      } else {
        console.error('Error logging in:', error.message);
      }
    }
  };

  return (
    <Popup isVisible={showAuthPopup} onClose={showAuthPopupHandler}>
        <AuthForm
          setEmail={setEmail}
          email={email}
          setPass={setPassword}
          pass={password}
          handleClick={handleLogin}
          setShowAuthPopup={setShowAuthPopup}
        />
    </Popup>
  );
};

export default Authentification;

