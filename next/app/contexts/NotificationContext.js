'use client'

import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [message, setMessage] = useState(null)
    const [messageType, setMessageType] = useState('')

  return (
    <NotificationContext.Provider
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
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};