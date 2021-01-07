import { useState } from "react";
import { Router } from "react-chrome-extension-router";
import Login from "./Login";
import Main from "./Main";
import LoadingSkeleton from "./LoadingSkeleton";

const AppRouter = () => {
  const [loading, setLoading] = useState(true);

  // popup state
  const [pState, setPState] = useState({
    matchStatus: "rest",
    loggedIn: false,
    roomUrl: null,
    roomId: null,
  });

  // hydrating popup state
  chrome.runtime.sendMessage({ type: "popupInit" }, (state) => {
    if (state) {
      // set popup state from background state
      setPState(state);
    }
    // set loading done
    setLoading(false);
  });

  return (
    <Router>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div>
          {pState.loggedIn ? (
            <Main setPState={setPState} pState={pState} />
          ) : (
            <Login setPState={setPState} />
          )}
        </div>
      )}
    </Router>
  );
};

export default AppRouter;
