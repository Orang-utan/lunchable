import axios from "axios";
import io from "socket.io-client";
import { fetchMe, findLunch, cancelLunch } from "../services/apiFactory";
import { API_ENDPOINT } from "../services/config";
import {
  getAccessToken,
  getNotifyCount,
  getRefreshToken,
  setNotifyCount,
  setTokens,
} from "../services/storageClient";

/** socket stuff below  */
let socket = io.connect(API_ENDPOINT);
let uid = null;

socket.on("notifyNewLink", (payload) => {
  getNotifyCount((count) => {
    console.log(count);
    const newCount = count + 1 || 1;
    setNotifyCount(newCount, () => {
      if (newCount > 9) {
        chrome.browserAction.setBadgeText({ text: "10+" });
      } else {
        chrome.browserAction.setBadgeText({ text: String(newCount) });
      }
      chrome.notifications.create("", {
        title: payload.title,
        message: payload.message,
        iconUrl: "img/icons/icon@128.png",
        type: "basic",
      });
    });
  });
});

function bindSocketToUID() {
  getAccessToken()
    .then((token) => {
      fetchMe(token).then((user) => {
        socket.emit("bindUID", user);
        uid = user._id;
      });
    })
    .catch(() => {
      console.error("Failed to bind user id with socket");
    });
}

function unbindSocketToUID() {
  if (uid) {
    socket.emit("unbindUID");
  }
}

/** interval fetching logic */
let statusInterval = null;
let matched = false;
function setIntervalAndExecute(fn, t) {
  fn();
  return setInterval(fn, t);
}

/** background state, similar to redux */
let state = {
  matchStatus: "rest",
  loggedIn: false,
};

/** background script message passing core logic */
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case "findMatch":
      getAccessToken().then((accessToken) => {
        findLunch(accessToken, 2).then((res) => {
          const { roomUrl, message, roomId } = res;
          if (roomUrl) {
            matched = true;
            response({ roomUrl, message, status: "matched" });
          } else {
            if (!statusInterval) {
              statusInterval = setIntervalAndExecute(
                () => console.log("hello"),
                1000
              );
            }
            response({ roomId, message, status: "searching" });
          }
        });
      });
      break;
    case "cancelMatch":
      clearInterval(statusInterval);
      statusInterval = null;

      break;
    case "endCall":
      // TODO: need some API endpoint here
      matched = false;
      break;
    case "popupInit":
      getRefreshToken()
        .then(() => {
          // bind socket
          bindSocketToUID();
          // clear notification
          setNotifyCount(0, () => {
            chrome.browserAction.setBadgeText({ text: "" });
            getAccessToken().then((accessToken) => {
              // initialize state
              fetchMe(accessToken)
                .then((user) => {
                  const { matchStatus } = user;
                  state.matchStatus = matchStatus;
                  state.loggedIn = true;
                  console.log(state);
                  response(state);
                })
                .catch((error) => response(state, error));
            });
          });
        })
        .catch((error) => response({ state, error }));
      break;
    case "login":
      const { newRefreshToken } = msg.payload;
      axios({
        method: "POST",
        url: `${API_ENDPOINT}/api/users/refreshToken`,
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ refreshToken: newRefreshToken }),
      })
        .then((res) => {
          const newAccessToken = res.data.accessToken;
          setTokens(newAccessToken, newRefreshToken)
            .then(() => response({ success: true }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case "logout":
      setTokens("", "")
        .then(() => {
          // clean up
          matched = false;
          unbindSocketToUID();
          clearInterval(statusInterval);
          statusInterval = null;
          response({ success: true });
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    default:
      response({ success: false, error: "Unknown request" });
      break;
  }
  return true;
});
