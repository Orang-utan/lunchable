import React, { useState, createContext, useEffect } from "react";
import api from "../api";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userData, setUserData] = useState({
    isLoading: null,
    userInfo: { matchStatus: "rest" },
  });

  useEffect(() => {
    const onMount = async () => {
      setUserData({ ...userData, isLoading: true });
      const res = await api.get("/api/users/me");

      if (res.data.success === true) {
        setUserData({ ...userData, isLoading: false, userInfo: res.data.data });
      }
    };
    onMount();
  }, []);

  return (
    <UserContext.Provider value={[userData, setUserData]}>
      {props.children}
    </UserContext.Provider>
  );
};
