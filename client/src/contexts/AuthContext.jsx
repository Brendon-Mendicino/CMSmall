import { useContext } from "react";
import { createContext } from "react";
import User from "../models/user";
import { useState } from "react";

const AuthContext = createContext();

/**
 *
 * @returns {{user:User, setUser:(value:User)=>void}}
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState();

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
