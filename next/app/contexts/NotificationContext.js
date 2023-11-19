'use client'

import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [message, setMessage] = useState(null)
    const [messageType, setMessageType] = useState('')

  return (
    <NotificationContext.Provider
      value={{
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

export const useNotification = () => {
  const { setMessage, setMessageType } = useNotificationContext();

  const setNotification = (message, type, duration = 5000) => {
    setMessage(message);
    setMessageType(type);

    setTimeout(() => {
      setMessage(null);
    }, duration);
  };

  return { setNotification };
};
