import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; 
import { onAuthStateChanged } from "firebase/auth";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
      setLoading(false); 
    });

    return () => unsubscribe(); 
  }, []);


  const logout = async () => {
    await auth.signOut(); 
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};