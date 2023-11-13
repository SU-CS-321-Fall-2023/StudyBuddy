// REMOVE THIS LATER AFTER DESTRUCTURING
'use client'

import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([])
  
    const [user, setUser]= useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [registerName, setRegisterName] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [message, setMessage] = useState(null)
    const [messageType, setMessageType] = useState('')

  return (
    <AppContext.Provider
      value={{
        blogs,
        setBlogs,
        email,
        setEmail,
        password,
        setPassword,
        registerName,
        setRegisterName,
        registerEmail,
        setRegisterEmail,
        registerPassword,
        setRegisterPassword,
        message,
        setMessage,
        messageType,
        setMessageType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  return useContext(AppContext);
};