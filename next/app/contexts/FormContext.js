'use client'

import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {  
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [registerName, setRegisterName] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')

  return (
    <FormContext.Provider
      value={{
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
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  return useContext(FormContext);
};