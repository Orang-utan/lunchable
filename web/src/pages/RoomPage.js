import React from "react";
import VideoCallFrame from "../components/VideoCallFrame";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 100vw;
`;

const VideoCall = styled(VideoCallFrame)`
  margin: 50px;
`;

const RoomPage = (props) => {
  const roomID = props.match.params.roomID;

  // see if room id exists in daily.co
  // if not create a room, else return the room id
  return (
    <Container>
      <h1 className="title is-h1">Meet your lunch date!</h1>
      <VideoCall url={`https://lunchable.daily.co/${roomID}`} />
    </Container>
  );
};

export default RoomPage;
