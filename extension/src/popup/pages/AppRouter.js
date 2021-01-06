import { useState } from "react";
import { Router } from "react-chrome-extension-router";
import Login from "./Login";
import Main from "./Main";
import LoadingSkeleton from "./LoadingSkeleton";

const AppRouter = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  chrome.runtime.sendMessage({ type: "popupInit" }, (response) => {
    setLoading(false);
    if (response && response.success) {
      setLoggedIn(true);
    }
  });

  return (
    <Router>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div>
          {loggedIn ? (
            <Main setLoggedIn={setLoggedIn} />
          ) : (
            <Login setLoggedIn={setLoggedIn} />
          )}
        </div>
      )}
    </Router>
  );
};

export default AppRouter;
