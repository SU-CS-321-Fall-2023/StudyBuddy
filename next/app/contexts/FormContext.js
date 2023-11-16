'use client'

import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {  
    const [email, setEmail] = useState('agamal@stetson.edu')
    const [password, setPassword] = useState('password')
    const [name, setName] = useState('')

  return (
    <FormContext.Provider
      value={{
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  return useContext(FormContext);
};