import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";

import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/animation.css";
import Phone from "../assets/phone.svg";

const lunches = [
  { name: "Kevin", date: "01/02/2020", duration: "32" },
  { name: "Daniel", date: "01/03/2020", duration: "16" },
  { name: "Kevin", date: "01/02/2020", duration: "32" },
  { name: "Daniel", date: "01/03/2020", duration: "16" },
  { name: "Kevin", date: "01/02/2020", duration: "32" },
  { name: "Daniel", date: "01/03/2020", duration: "16" },
];

const DashboardPage = (props) => {
  const history = useHistory();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const onMount = async () => {
      const res = await api.get("/api/users/me");
      console.log(res.data);
      setUserData(res.data);
    };

    onMount();
  }, []);

  const startMatching = () => {
    // Trigger popup somehow lol
  };

  return (
    <div className="dash-container fade-in">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          className="buttonStandard primary-button"
          onClick={startMatching}
        >
          Start matching
          <img src={Phone} style={{ marginLeft: "8px", height: "14px" }} />
        </button>
        <button
          className="buttonStandard secondary-button"
          onClick={() => history.push("/setting")}
        >
          Settings
        </button>
      </div>
      <br />
      <div className="title-container">
        <div className="header3">Week in review</div>
      </div>
      <div style={{ display: "inline-block" }}>
        <div className="outlineCardContainer">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="stat-single">
              <div className="header4">5</div>
              <div className="caption">Matches </div>
            </div>
            <div className="stat-single">
              <div className="header4">145</div>
              <div className="caption">Minutes spent</div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="title-container">
        <div className="header3">Past lunches</div>
      </div>
      <div className="history-container">
        {lunches.map((lunch) => (
          <div className="history-card">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <div>
                <span className="circle-div"></span>
                <div className="body">{lunch.name}</div>
                <div className="caption">{lunch.duration} min</div>
              </div>
              <div className="caption">{lunch.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
