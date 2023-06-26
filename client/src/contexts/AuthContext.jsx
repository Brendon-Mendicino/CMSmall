import { useContext, useEffect } from "react";
import { createContext } from "react";
import User from "../models/user";
import { useState } from "react";
import API from "../API";

const AuthContext = createContext({ user: /** @type {User?} */(null), setUser: () => {} });

/**
 *
 * @returns {{user:User?, setUser: React.Dispatch<React.SetStateAction<User?>>}}
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(/** @type {User?} */(null));

  // Check if we are already logged in, if true
  // set the current user
  useEffect(() => {
    API.isLoggedIn().then((user) => {
      if (!user) return;
      setUser(user);
    });
  }, []);

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
