import styled from "styled-components";

const PopupContainer = styled.div`
  text-align: left;
  width: 310px;
  height: 400px;
  overflow: scroll;
`;

const LoadingSkeleton = () => {
  return <PopupContainer></PopupContainer>;
};

export default LoadingSkeleton;
