import React from "react";

import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";
import Phone from "../assets/phone.svg";

const lunches = [
  { name: "Kevin", date: "01/02/2020", duration: "32" },
  { name: "Daniel", date: "01/03/2020", duration: "16" },
  { name: "Kevin", date: "01/02/2020", duration: "32" },
  { name: "Daniel", date: "01/03/2020", duration: "16" },
  { name: "Kevin", date: "01/02/2020", duration: "32" },
  { name: "Daniel", date: "01/03/2020", duration: "16" },
];

const DashboardPage = () => {
  return (
    <div className="dash-container">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button className="buttonStandard primary-button">
          Start matching
          <img src={Phone} style={{ marginLeft: "8px", height: "14px" }} />
        </button>
        <button className="buttonStandard secondary-button">Settings</button>
      </div>
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
