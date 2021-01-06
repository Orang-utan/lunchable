import { useState } from "react";
import { Router } from "react-chrome-extension-router";
import Login from "./Login";
import Main from "./Main";
import LoadingSkeleton from "./LoadingSkeleton";

const AppRouter = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchState, setSearchState] = useState("rest");

  chrome.runtime.sendMessage({ type: "popupInit" }, (response) => {
    setLoading(false);
    if (response && response.success) {
      setLoggedIn(true);
      // set default status
      if (response.searching) {
        setSearchState("searching");
        return;
      }
      if (response.matched) {
        setSearchState("matched");
        return;
      }
    }
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
