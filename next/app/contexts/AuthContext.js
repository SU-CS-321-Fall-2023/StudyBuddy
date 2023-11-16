"use client"
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  if ((user === null || user === '') && typeof window !== 'undefined') {
    const storedUser = window.localStorage.getItem('loggedStudyBuddyUser')
    if (typeof storedUser !== 'undefined' && storedUser !== null) {
      setUser(JSON.parse(storedUser))
    }
  }
  if ((token === null || token === '') && typeof window !== 'undefined') {
    const storedToken = window.localStorage.getItem('loggedStudyBuddyUserToken')
    if (typeof storedToken !== 'undefined' && storedToken !== null) {
      setToken(storedToken)
    }
  }
  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
