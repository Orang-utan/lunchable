import styled from "styled-components";

const PopupContainer = styled.div`
  text-align: left;
  width: 100%;
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-diction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingSkeleton = () => {
  return (
    <PopupContainer>
      <div>
        <div className="rotate" style={{ fontSize: "53px" }}>
          🍙
        </div>
        <br />
        <div className="body">Loading</div>
      </div>
    </PopupContainer>
  );
};

export default LoadingSkeleton;
