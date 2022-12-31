import React, { useContext } from 'react';

const AuthContext = React.createContext();

const AuthProvider = ({ children, value }) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthValue = () => {
  return useContext(AuthContext);
};

export { useAuthValue, AuthProvider };
