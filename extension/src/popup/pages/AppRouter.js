import { useState, useEffect } from "react";
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

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "popupInit" }, (res) => {
      setLoading(false);
      // TODO: handle error on UI
      if (res.error) {
        console.log(res.error);
        return;
      }

      // set loading done
      // only update if state differs
      if (!_.isEqual(res.state, pState)) setPState(res.state);

      // for testing the complete page
      // setPState({ ...res.state, matchStatus: "complete" });
      // console.log(pState);
    });
  }, []);

  // hydrating popup state

  return (
    <Router>
      <div className="popupContainer">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {pState.loggedIn ? (
              <Main setPState={setPState} pState={pState} />
            ) : (
              <Login setPState={setPState} />
            )}
          </>
        )}
      </div>
    </Router>
  );
};

export default AppRouter;
