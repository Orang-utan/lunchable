import { useState } from "react";
import { Router } from "react-chrome-extension-router";
import Login from "./Login";
import Main from "./Main";
import LoadingSkeleton from "./LoadingSkeleton";

const AppRouter = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchState, setSearchState] = useState("rest");

  // initialize ui state
  chrome.runtime.sendMessage({ type: "popupInit" }, (state) => {
    if (state) {
      setLoggedIn(state.loggedIn);
      setSearchState(state.matchStatus);
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
          {loggedIn ? (
            <Main
              setLoggedIn={setLoggedIn}
              searchState={searchState}
              setSearchState={setSearchState}
            />
          ) : (
            <Login setLoggedIn={setLoggedIn} />
          )}
        </div>
      )}
    </Router>
  );
};

export default AppRouter;
