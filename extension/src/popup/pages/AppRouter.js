import { useState } from "react";
import { Router } from "react-chrome-extension-router";
import Login from "./Login";
import Main from "./Main";
import LoadingSkeleton from "./LoadingSkeleton";
import _ from "lodash";

const AppRouter = () => {
  const [loading, setLoading] = useState(true);

  // popup state (make sure types consistent with background!)
  const [pState, setPState] = useState({
    matchStatus: "rest",
    loggedIn: false,
    roomUrl: null,
    roomId: null,
  });

  // hydrating popup state
  chrome.runtime.sendMessage({ type: "popupInit" }, (res) => {
    if (res.error) return;

    // set loading done
    // only update if state differs
    if (!_.isEqual(res.state, pState)) {
      setPState(res.state);
    }
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
