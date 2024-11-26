// import React, { createContext, useState, useContext } from "react";

// // Create AuthContext
// export const AuthContext = createContext();

// // AuthProvider component
// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const login = (token) => {
//     setIsAuthenticated(true);
//     localStorage.setItem("accessToken", token);
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem("accessToken");
//   };

//   return (
//     <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
