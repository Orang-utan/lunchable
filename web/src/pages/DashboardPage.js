import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../components/UserContext";

import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/animation.css";
import { PageSpinner } from "../components/other/LoadingSpinner";
import Phone from "../assets/phone.svg";

const DashboardPage = (props) => {
  const history = useHistory();

  const [userData] = useContext(UserContext);

  const startMatching = () => {
    // Trigger popup somehow lol
  };

  const joinCall = () => {
    window.open(userData.userInfo.roomUrl);
  };

  return userData.isLoading === true ? (
    <div className="dash-container">
      <PageSpinner />
    </div>
  ) : (
    <div className="dash-container fade-in">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          className="buttonStandard primary-button"
          onClick={
            userData.userInfo.matchStatus === "matched"
              ? joinCall
              : startMatching
          }
        >
          {userData.userInfo.matchStatus === "rest"
            ? "Start matching"
            : userData.userInfo.matchStatus === "matched"
            ? "Join call"
            : null}
          <img
            src={Phone}
            style={{ marginLeft: "8px", height: "14px" }}
            alt="hero"
          />
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
              <div className="header4">{userData.stats.matches}</div>
              <div className="caption">Matches </div>
            </div>
            <div className="stat-single">
              <div className="header4">{userData.stats.minutesSpent}</div>
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
        {userData.pastLunches.map((lunch) => (
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
                <div className="body">{lunch.participants[0].firstName}</div>
                <div className="body">{lunch.participants[1].firstName}</div>
                <div className="caption">{lunch.duration}x min</div>
              </div>
              <div className="caption">{lunch.timestamp.substring(0, 10)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
