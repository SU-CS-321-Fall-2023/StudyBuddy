"use client"
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  if (user === null || user === '') {
    const storedUser = localStorage.getItem('loggedStudyBuddyUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const { user, setUser } = useContext(AuthContext);
  return { user, setUser };
};
