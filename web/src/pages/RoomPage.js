import React from "react";

const RoomPage = () => {
  // Create the DailyIframe, passing styling properties to make it fullscreen
  window.callFrame = window.DailyIframe.createFrame({
    iframeStyle: {
      position: "fixed",
      border: 0,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
  });

  return (
    <>
      <script crossorigin src="https://unpkg.com/@daily-co/daily-js"></script>
    </>
  );
};

export default RoomPage;
