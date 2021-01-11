import axios from "axios";
import secureAxios from "../services/api";
import io from "socket.io-client";
import {
  fetchMe,
  findLunch,
  cancelLunch,
  completeLunch,
  fetchOnline,
  submitFeedback,
} from "../services/apiFactory";
import { API_ENDPOINT } from "../services/config";
import {
  getAccessToken,
  getNotifyCount,
  getRefreshToken,
  setNotifyCount,
  setTokens,
} from "../services/storageClient";
import { AMPLITUDE_URL, sendAmplitudeData } from "../popup/util/amplitude";

/****** background state, similar to redux ******/
let socket = io.connect(API_ENDPOINT);
let state = {
  socketBinded: false,
  matchStatus: "rest",
  loggedIn: false,
  roomUrl: null,
  roomId: null,
  online: 0,
};

/****** notification utility ******/
function createNotification(title, message) {
  console.log("notificaiton creating...");
  chrome.notifications.create("", {
    title: title,
    message: message,
    iconUrl: "img/favicon/icon@128.png",
    type: "basic",
  });
}

/****** websocket infrastructure ******/
/** socket listeners below */
// new notificaiton listener
socket.on("newNotification", (payload) => {
  console.log("new notification received");
  getNotifyCount((count) => {
    const newCount = count + 1 || 1;
    setNotifyCount(newCount, () => {
      if (newCount > 9) {
        chrome.browserAction.setBadgeText({ text: "10+" });
      } else {
        chrome.browserAction.setBadgeText({ text: String(newCount) });
      }
      createNotification(payload.title, payload.message);
    });
  });
});

/** socket emitters below */
// socket binding on startup
function bindSocketToUID() {
  getAccessToken()
    .then((token) =>
      fetchMe(token).then((user) => socket.emit("bindUID", user))
    )
    .catch(() => console.error("Failed to bind user id with socket"));
}

// socket unbind on logout
function unbindSocketToUID() {
  socket.emit("unbindUID");
}

/****** interval fetching logic ******/
let statusInterval = null;
let isFetching = false;
function dispatchWorker(fn, t) {
  fn();
  return setInterval(fn, t);
}

function fetchStatus(roomId) {
  if (isFetching) return;
  // TODO: add expire timeout
  isFetching = true;
  getAccessToken().then((accessToken) => {
    secureAxios({
      url: `/api/lunches/status/${roomId}`,
      method: "GET",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        const data = res.data;
        isFetching = false;

        // match found
        if (data.fulfilled) {
          createNotification("Match Found!", "Open Lunchable to join call.");
          state.roomUrl = data.roomUrl;
          state.matchStatus = "matched";
          chrome.runtime.sendMessage({ type: "matchFound", state });
          clearInterval(statusInterval);
          statusInterval = null;
        }
      })
      .catch((err) => console.error(err));
  });
}

/**
 * background script initialization below
 * note: this is different from popup initialization
 */
bindSocketToUID();

/****** background script message passing core logic ******/
chrome.runtime.onMessage.addListener((msg, _, response) => {
  switch (msg.type) {
    case "findMatch":
      getAccessToken()
        .then((accessToken) => {
          findLunch(accessToken, 2).then((res) => {
            const { roomUrl, roomId } = res;
            if (roomUrl) {
              // update state
              state.matchStatus = "matched";
              state.roomUrl = roomUrl;
              state.roomId = roomId;
              response({ state });
            } else {
              // running worker asynchronously
              if (!statusInterval) {
                statusInterval = dispatchWorker(
                  () => fetchStatus(roomId),
                  1000
                );
              }
              state.matchStatus = "searching";
              state.roomUrl = null;
              state.roomId = roomId;
              response({ state });
            }
          });
        })
        .catch((error) => response({ state, error }));
      break;
    case "cancelMatch":
      getAccessToken().then((accessToken) => {
        cancelLunch(accessToken, state.roomId)
          .then(() => {
            state.matchStatus = "rest";
            state.roomId = null;
            state.roomUrl = null;
            response({ state });
          })
          .catch((error) => response({ state, error }));
      });
      break;
    case "completeMatch":
      getAccessToken().then((accessToken) => {
        completeLunch(accessToken, state.roomId)
          .then(() => {
            state.matchStatus = "rest";
            state.roomId = null;
            state.roomUrl = null;
            response({ state });
          })
          .catch((error) => response({ state, error }));
      });
      break;
    case "submitFeedback":
      getAccessToken()
        .then((accessToken) => {
          submitFeedback(accessToken, msg.payload).then((res) => {
            response(res);
          });
        })
        .catch((error) => response(error));

    case "popupInit":
      sendAmplitudeData("POPUP_OPENED");
      bindSocketToUID();
      getRefreshToken()
        .then(() => {
          getAccessToken().then((accessToken) => {
            // initialize user state
            fetchMe(accessToken)
              .then((user) => {
                // set state
                const { matchStatus, roomId, roomUrl } = user;
                state.matchStatus = matchStatus;
                state.roomId = roomId;
                state.roomUrl = roomUrl;
                state.loggedIn = true;

                // clear notification
                setNotifyCount(0, () =>
                  chrome.browserAction.setBadgeText({ text: "" })
                );

                // dispatch worker if none & user is still searching
                if (!statusInterval && matchStatus === "searching") {
                  statusInterval = dispatchWorker(
                    () => fetchStatus(roomId),
                    1000
                  );
                }

                // fetch online users
                fetchOnline(accessToken)
                  .then((res) => {
                    state.online = res.onlineUsers;
                    response({ state });
                  })
                  .catch((error) => response({ state, error }));
              })
              .catch((error) => response({ state, error }));
          });
        })
        .catch((error) => response({ state, error }));
      break;
    case "login":
      const { newRefreshToken } = msg.payload;
      axios
        .post(`${API_ENDPOINT}/api/users/refreshToken`, {
          refreshToken: newRefreshToken,
        })
        .then((res) => {
          console.log("success");
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
          unbindSocketToUID();
          clearInterval(statusInterval);
          statusInterval = null;
          // reset background state
          state = {
            matchStatus: "rest",
            loggedIn: false,
            roomUrl: null,
            roomId: null,
            online: 0,
          };
          response({ state });
        })
        .catch((error) => {
          response({ state, error });
        });
      break;
    case "checkLoggedIn":
      console.log(state.loggedIn);
      response(state);
      break;
    default:
      response({ success: false, error: "Unknown request" });
      break;
  }
  return true;
});
