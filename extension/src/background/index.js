import {
  fetchCurrentFriend,
  fetchMyFeed,
  sendLink,
  fetchPendingFriend,
  acceptRequest,
  rejectRequest,
  fetchMe,
  sendFriendRequest,
  fetchLinkPreview,
  archiveLink,
  likeLink,
  fetchLikeStatus,
} from "../services/apiRequests";
import {
  setTokens,
  getRefreshToken,
  getAccessToken,
  setNotifyCount,
  getNotifyCount,
} from "../services/storageClient";
import { API_ENDPOINT } from "../services/config";
import axios from "axios";
import io from "socket.io-client";
import { isAfter } from "date-fns";

let socket = io.connect(API_ENDPOINT);
let uid = null;

getRefreshToken().then((token) => {
  console.log(token);
});

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

socket.on("notifyNewLike", (payload) => {
  console.log("notify new link");

  const { title, message } = payload;
  chrome.notifications.create("", {
    title,
    message,
    iconUrl: "img/icons/icon@128.png",
    type: "basic",
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

function emitLinkSent(recipientEmail) {
  if (uid) {
    const payload = { senderId: uid, recipientEmail };
    socket.emit("linkSent", payload);
  }
}

function emitLinkLiked(linkId, currentLikeStatus) {
  // user id exists and post is currently not liked
  if (uid && !currentLikeStatus) {
    const payload = { senderId: uid, linkId };
    socket.emit("linkLiked", payload);
  }
}

// function getRefreshToken() {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get("refreshToken", (tokenPair) => {
//       const refreshToken = tokenPair["refreshToken"];

//       if (refreshToken) {
//         resolve(refreshToken);
//       } else {
//         reject(new Error("refreshToken not found"));
//       }
//     });
//   });
// }

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case "findmatch":
      let counter = 0;
      console.log("Finding match");

      function fetchStatus() {
        return new Promise((resolveMain, reject) => {
          function fetchHelper() {
            var networkPromise = fetch(
              "https://jsonplaceholder.typicode.com/todos/1"
            );

            var timeOutPromise = new Promise(function (resolve, reject) {
              setTimeout(resolve, 2000, "Timeout Done");
            });

            Promise.all([networkPromise, timeOutPromise]).then(function (
              values
            ) {
              counter += 1;
              console.log("At least 2 sec", counter);
              if (counter !== 3) {
                fetchStatus();
              }
            });
          }

          fetchHelper().then(() => resolveMain());
        });
      }

      fetchStatus()
        .then(() => {
          console.log("bruh");
          response({ success: true });
        })
        .catch((err) => response({ success: false, error: err }));
      break;

    case "popupInit":
      getRefreshToken()
        .then(() => {
          bindSocketToUID();
          // clear notification
          setNotifyCount(0, () => {
            chrome.browserAction.setBadgeText({ text: "" });
            response({ success: true });
          });
        })
        .catch((err) => {
          response({ success: false, error: err });
        });
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
          unbindSocketToUID();
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
