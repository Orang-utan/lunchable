import { useState } from "react";
import { Router } from "react-chrome-extension-router";
import Login from "./Login";
import Main from "./Main";
import LoadingSkeleton from "./LoadingSkeleton";
import _ from "lodash";

const AppRouter = () => {
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  // popup state (make sure types consistent with background!)
  const [pState, setPState] = useState({
    matchStatus: "rest",
    loggedIn: false,
    roomUrl: null,
    roomId: null,
  });
=======
  const [searchState, setSearchState] = useState("rest");
>>>>>>> 96d1129... merged main

  // hydrating popup state
  chrome.runtime.sendMessage({ type: "popupInit" }, (res) => {
    setLoading(false);
<<<<<<< HEAD
    // TODO: handle error on UI
    if (res.error) {
      console.log(res.error);
      return;
=======
    if (response && response.success) {
      setLoggedIn(true);
      // set default status

      if (response.searching) {
        setSearchState("searching");
      } else {
        setSearchState("rest");
      }
>>>>>>> 96d1129... merged main
    }

    // set loading done
    // only update if state differs
    if (!_.isEqual(res.state, pState)) setPState(res.state);
  });

  return (
    <Router>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div>
<<<<<<< HEAD
          {pState.loggedIn ? (
            <Main setPState={setPState} pState={pState} />
=======
          {loggedIn ? (
            <Main
              setLoggedIn={setLoggedIn}
              searchState={searchState}
              setSearchState={setSearchState}
            />
>>>>>>> 96d1129... merged main
          ) : (
            <Login setPState={setPState} />
          )}
        </div>
      )}
    </Router>
  );
};

export default AppRouter;
