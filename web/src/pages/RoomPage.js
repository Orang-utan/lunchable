import React, { useEffect, useState } from "react";
import VideoCallFrame from "../components/VideoCallFrame";
import { PageSpinner } from "../components/LoadingSpinner";
import styled from "styled-components";
import api from "../api";
import { useHistory } from "react-router-dom";

import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  width: 100vw;
`;

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
  const history = useHistory();
  const roomID = props.match.params.roomID;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onMount = async () => {
      setIsLoading(true);
      try {
        const status = await api.get(`/api/lunches/status/${roomID}`);
        if (!status.data.fulfilled) {
          setError("Room not ready yet");
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    onMount();
  }, [roomID]);

  // see if room id exists in daily.co
  // if not create a room, else return the room id
  return isLoading === true ? (
    <div className="dash-container">
      <br />
      <br />
      <PageSpinner />
    </div>
  ) : error ? (
    <ErrorContainer>
      <div style={{ margin: "10px 0px", width: "50%", textAlign: "center" }}>
        <div className="header3">
          🛑 Oops... This room is not available yet.
        </div>
      </div>
      <button
        className="buttonStandard"
        onClick={() => history.push("/dashboard")}
      >
        Go back to Dashboard.
      </button>
    </ErrorContainer>
  ) : (
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
