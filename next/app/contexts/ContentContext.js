// REMOVE THIS LATER AFTER DESTRUCTURING
'use client'

import { createContext, useContext, useState } from 'react';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([])
  return (
    <ContentContext.Provider
      value={{
        blogs,
        setBlogs
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => {
  return useContext(ContentContext);
};