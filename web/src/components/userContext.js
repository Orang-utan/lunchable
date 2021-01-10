import React, { useState, createContext, useEffect } from "react";
import api from "../api";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userData, setUserData] = useState({
    isLoading: null,
    userInfo: { matchStatus: "rest" },
    stats: { minutesSpent: null, matches: null },
    pastLunches: [],
  });

  useEffect(() => {
    const onMount = async () => {
      setUserData({ ...userData, isLoading: true });
      const userInfo = await api.get("/api/users/me");
      const stats = await api.get("/api/users/statistics");
      const pastLunches = await api.get("/api/users/past-lunches");

      if (userInfo.data.success) {
        setUserData({
          ...userData,
          isLoading: false,
          userInfo: userInfo.data.data,
          stats: stats.data,
          pastLunches: pastLunches.data.lunches,
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
