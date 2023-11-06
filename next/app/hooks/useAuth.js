"use client"
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Assuming you named your context file AuthContext.js

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  return { user, setUser };
};

export default useAuth;