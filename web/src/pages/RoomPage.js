import React from "react";
import VideoCallFrame from "../components/VideoCallFrame";
import styled from "styled-components";

import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
  width: 100vw;
`;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70%;
  width: 70%;
`;

const RoomPage = (props) => {
  const roomID = props.match.params.roomID;

  // see if room id exists in daily.co
  // if not create a room, else return the room id
  return (
    <Container>
      <br />
      <div style={{ margin: "10px 0px", width: "50%", textAlign: "center" }}>
        <div className="header3">🌟 Say hi to your lunch date!</div>
        <div className="body body-main">
          Feel free to close this window once you're done with lunch.
        </div>
      </div>
      <VideoContainer>
        <VideoCallFrame url={`https://lunchable.daily.co/${roomID}`} />
      </VideoContainer>
    </Container>
  );
};

export default RoomPage;
