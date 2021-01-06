import { useState } from "react";
import { Router } from "react-chrome-extension-router";
import Login from "./Login";
import Main from "./Main";
import LoadingSkeleton from "./LoadingSkeleton";

const AppRouter = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  chrome.runtime.sendMessage({ type: "popupInit" }, (response) => {
    setLoading(false);
    if (response && response.success) {
      setLoggedIn(true);
      setSearching(response.searching);
    }
  });

  return (
    <Router>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div>
          {loggedIn ? (
            <Main setLoggedIn={setLoggedIn} searching={searching} />
          ) : (
            <Login setLoggedIn={setLoggedIn} />
          )}
        </div>
      )}
    </Router>
  );
};

export default AppRouter;
