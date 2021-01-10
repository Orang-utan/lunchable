import React, { useState, createContext, useEffect } from "react";
import api from "../api";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userData, setUserData] = useState({
    isLoading: null,
    userInfo: { matchStatus: "rest" },
    stats: { minutesSpent: null, matches: null },
  });

  useEffect(() => {
    const onMount = async () => {
      setUserData({ ...userData, isLoading: true });
      const res = await api.get("/api/users/me");
      const stats = await api.get("/api/users/statistics");

      if (res.data.success === true) {
        setUserData({
          ...userData,
          isLoading: false,
          userInfo: res.data.data,
          stats: stats.data,
        });
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
