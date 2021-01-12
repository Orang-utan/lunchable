import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getGravatarUrl } from "react-awesome-gravatar";
import { timeAgo } from "../utils/timeUtils";
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
  const [groups, setGroups] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const onMount = async () => {
      setIsLoading(true);
      const pastLunches = await api.get("/api/users/past-lunches");
      const user = await api.get("/api/users/me");
      const groups = await api.get("/api/users/groups");
      setUserInfo(user.data.data);
      setPastLunches(pastLunches.data.lunches);
      setGroups(groups.data.groups);
      setIsLoading(false);
    };

    onMount();
  }, []);

  return isLoading === true ? (
    <div className="dash-container">
      <br />
      <br />
      <PageSpinner />
    </div>
  ) : (
    <div className="dash-container fade-in">
      <br />
      <br />
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
        <div className="header3">My Groups</div>
      </div>
      <div className="history-container">
        {groups.map((group) => {
          const members = group.members;
          const groupName = group.groupName;
          const firstMember = group.members[0];
          return (
            <div className="group-card" key={group._id}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <div>
                  <strong className="body body-main">{groupName}</strong>
                </div>
                <div className="caption">
                  {firstMember.firstName} {firstMember.lastName} +
                  {members.length} more
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <br />
      <div className="title-container">
        <div className="header3">Past lunches</div>
      </div>
      <div className="history-container">
        {pastLunches.map((lunch) => {
          const otherUserIdx =
            lunch.participants[0].email === userInfo.email ? 1 : 0;
          const relativeTime = timeAgo.format(new Date(lunch.timestamp));
          const profileUrl = getGravatarUrl(
            lunch.participants[otherUserIdx].email
          );
          return (
            <div className="history-card" key={lunch._id}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <div>
                  <img src={profileUrl} alt="profile" className="circle-div" />

                  <div className="body body-main">
                    {lunch.participants[otherUserIdx].firstName}{" "}
                    {lunch.participants[otherUserIdx].lastName}
                  </div>
                </div>
                <div className="caption">{relativeTime}</div>
              </div>
            </div>
          );
        })}
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
