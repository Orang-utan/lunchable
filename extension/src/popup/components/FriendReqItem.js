import { useEffect } from "react";
import styled from "styled-components";

const Subtitle = styled.h3`
  font-size: 16px;
  font-family: "Avenir";
  font-weight: 600;
  color: rgb(72, 72, 72, 0.8);
  margin: 10px 0 0 0;
  padding: 0px;
`;

const StyledButton = styled.button`
  border: none;
  background-color: #f5f5f5;
  padding: 5px 15px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  font-family: "Avenir";
  font-size: 12px;
  font-weight: 600px;
  margin: 5px 10px 5px 0px;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 10px;
    opacity: 0.9;
    background-color: rgba(231, 84, 128, 1);
  }
  &:active {
    opacity: 0.6;
  }
`;

const FriendReqItem = ({ data, handleAccept, handleReject }) => {
  useEffect(() => {
    console.log(data);
  }, []);

  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  return (
    <div key={data._id}>
      <Subtitle>{data.requesterName}</Subtitle>
      <StyledButton
        onClick={() => {
          handleAccept(data._id);
        }}
      >
        Accept
      </StyledButton>
      <StyledButton
        onClick={() => {
          handleReject(data._id);
        }}
      >
        Reject
      </StyledButton>
    </div>
  );
};

export default FriendReqItem;
