import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import { UserContext } from "../components/UserContext";
import api from "../api";
import { PageSpinner } from "../components/LoadingSpinner";
import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";

// import Phone from "../assets/phone.svg";

const DashboardPage = (props) => {
  const history = useHistory();

  // const [userData] = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [pastLunches, setPastLunches] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const onMount = async () => {
      setIsLoading(true);
      const pastLunches = await api.get("/api/users/past-lunches");
      const user = await api.get("/api/users/me");
      setUserInfo(user.data.data);
      console.log(user.data.data.firstName);
      setPastLunches(pastLunches.data.lunches);
      setIsLoading(false);
    };

    onMount();
  }, []);

  // const joinCall = () => {
  //   window.open(userData.userInfo.roomUrl);
  // };

  return isLoading === true ? (
    <div className="dash-container">
      <PageSpinner />
    </div>
  ) : (
    <div className="dash-container fade-in">
      <div className="info-card">
        <div className="header5 blue-text">How it works 🌟</div>
        <div className="body blue-text">
          1) When it's lunch time, open the chrome extension
        </div>
        <div className="body blue-text">
          2) Hit "match" to find other friends
        </div>
        <div className="body blue-text">
          3) Eat and hang out, just like the way we used to vibe
        </div>
      </div>
      <br />
      <div className="title-container">
        <div className="header3">Past lunches</div>
      </div>
      <div className="history-container">
        {pastLunches.map((lunch) => (
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
                <div className="body body-main">
                  {lunch.participants[0].firstName === userInfo.firstName
                    ? lunch.participants[1].firstName
                    : lunch.participants[0].firstName}
                </div>
              </div>
              <div className="caption">{lunch.timestamp.substring(0, 10)}</div>
            </div>
          </div>
        ))}
      </div>
      <br />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          className="buttonStandard secondary-button"
          onClick={() => history.push("/setting")}
        >
          Settings
        </button>
      </div>
      <br />
    </div>
  );
};

export default DashboardPage;

// <button
//   className="buttonStandard primary-button"
//   onClick={
//     userData.userInfo.matchStatus === "matched" ? joinCall : startMatching
//   }
// >
//   {userData.userInfo.matchStatus === "rest"
//     ? "Start matching"
//     : userData.userInfo.matchStatus === "matched"
//     ? "Join call"
//     : null}
//   <img src={Phone} style={{ marginLeft: "8px", height: "14px" }} alt="hero" />
// </button>;

// <div className="title-container">
//   <div className="header3">Week in review</div>
// </div>;
// <div style={{ display: "inline-block" }}>
//   <div className="outlineCardContainer">
//     <div style={{ display: "flex", flexDirection: "row" }}>
//       <div className="stat-single">
//         <div className="header4">{userData.stats.matches}</div>
//         <div className="caption">Matches </div>
//       </div>
//       <div className="stat-single">
//         <div className="header4">{userData.stats.minutesSpent}</div>
//         <div className="caption">Minutes spent</div>
//       </div>
//     </div>
//   </div>
// </div>;
