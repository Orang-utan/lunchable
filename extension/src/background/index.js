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

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
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
    case "fetchMyFeed":
      getAccessToken()
        .then((token) => {
          const { limit, archive, author, like } = msg.payload;
          fetchMyFeed(token, limit, archive, author, like)
            .then((data) => response({ success: true, links: data }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case "fetchCurrentFriend":
      getAccessToken()
        .then((token) => {
          fetchCurrentFriend(token)
            .then((data) => response({ success: true, friend: data }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case "sendLink":
      getAccessToken()
        .then((token) => {
          const { linkUrl, recipientEmail, message } = msg.payload;
          sendLink(token, linkUrl, recipientEmail, message)
            .then(() => {
              emitLinkSent(recipientEmail);
              response({ success: true });
            })
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case "fetchPendingFriends":
      getAccessToken()
        .then((token) => {
          fetchPendingFriend(token)
            .then((data) => response({ success: true, request: data }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case "acceptRequest":
      getAccessToken()
        .then((token) => {
          const { friendReqId } = msg.payload;
          acceptRequest(friendReqId, token)
            .then(() => response({ success: true }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case "rejectRequest":
      getAccessToken()
        .then((token) => {
          const { friendReqId } = msg.payload;
          rejectRequest(friendReqId, token)
            .then(() => response({ success: true }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case "sendFriendRequest":
      getAccessToken()
        .then((token) => {
          const { email } = msg.payload;
          sendFriendRequest(email, token)
            .then(() => response({ success: true }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case "fetchLinkPreview":
      const { url } = msg.payload;
      fetchLinkPreview("", url)
        .then((data) => response({ success: true, data }))
        .catch((err) => response({ success: false, error: err }));
      break;
    case "archiveLink":
      getAccessToken()
        .then((token) => {
          const { linkId } = msg.payload;
          archiveLink(token, linkId)
            .then(() => response({ success: true }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case "likeLink":
      getAccessToken()
        .then((token) => {
          const { linkId, currentLikeStatus } = msg.payload;
          likeLink(token, linkId)
            .then(() => {
              emitLinkLiked(linkId, currentLikeStatus);
              response({ success: true });
            })
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case "fetchLikeStatus":
      getAccessToken()
        .then((token) => {
          const { linkId } = msg.payload;
          fetchLikeStatus(token, linkId)
            .then((status) => response({ success: true, status }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    default:
      response({ success: false, error: "Unknown request" });
      break;
  }
  return true;
});
