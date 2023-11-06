"use client"
import { createContext, useContext, useState } from 'react';

const RenderContext = createContext();

export const RenderProvider = ({ children }) => {
  const [render, setRender] = useState('default');

  return (
    <RenderContext.Provider value={{ render, setRender }}>
      {children}
    </RenderContext.Provider>
  );
};

export const useRender = () => {
  const { render, setRender } = useContext(RenderContext);
  return { render, setRender };
};
