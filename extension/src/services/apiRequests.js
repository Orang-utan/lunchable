import secureAxios from "./apiClient";

function login(email, password) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/users/login",
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => {
        const { refreshToken, accessToken } = res.data;
        resolve({ refreshToken, accessToken });
      })
      .catch((err) => reject(err));
  });
}

function fetchMyFeed(
  ACCESS_TOKEN,
  limit = "",
  archive = "false",
  author = "",
  like = "false"
) {
  return new Promise((resolve, reject) => {
    let url = `/api/links/me?limit=${limit}&archive=${archive}&author=${author}&like=${like}`;

    secureAxios({
      url,
      method: "GET",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        const links = res.data.links;
        resolve(links);
      })
      .catch((err) => reject(err.response));
  });
}

function sendLink(ACCESS_TOKEN, linkUrl, recipientEmail, message) {
  const data = {
    linkUrl,
    recipientEmail,
  };

  if (message) data.message = message;

  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/links/create",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    })
      .then(() => resolve())
      .catch((err) => reject(err.response));
  });
}

function fetchCurrentFriend(ACCESS_TOKEN) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/friends/current",
      method: "GET",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        const friends = res.data.data;
        resolve(friends);
      })
      .catch((err) => reject(err));
  });
}

function fetchPendingFriend(ACCESS_TOKEN) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/friends/pending",
      method: "GET",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        const requests = res.data.data;
        resolve(requests);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
}
function acceptRequest(ACCESS_TOKEN, friendReqId) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/friends/accept",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ friendReqId }),
    })
      .then(() => resolve())
      .catch((err) => reject(err.response));
  });
}

function rejectRequest(ACCESS_TOKEN, friendReqId) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/friends/reject",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ friendReqId }),
    })
      .then(() => resolve())
      .catch((err) => reject(err.response));
  });
}

function fetchMe(ACCESS_TOKEN) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/users/me",
      method: "GET",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        const me = res.data.data;
        resolve(me);
      })
      .catch((err) => reject(err.response));
  });
}

function sendFriendRequest(ACCESS_TOKEN, email) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/friends/request",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ recipientEmail: email }),
    })
      .then(() => resolve())
      .catch((err) => reject(err.response));
  });
}

function fetchLinkPreview(ACCESS_TOKEN, previewUrl) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/links/preview",
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        previewUrl,
      }),
    })
      .then((res) => {
        const preview = res.data.data;
        resolve(preview);
      })
      .catch((err) => reject(err.response));
  });
}

function archiveLink(ACCESS_TOKEN, linkId) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: `/api/links/archive/${linkId}`,
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then(() => resolve())
      .catch((err) => reject(err.response));
  });
}

function likeLink(ACCESS_TOKEN, linkId) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: `/api/links/like/${linkId}`,
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then(() => resolve())
      .catch((err) => reject(err.response));
  });
}

function fetchLikeStatus(ACCESS_TOKEN, linkId) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: `/api/links/like/${linkId}`,
      method: "GET",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        const status = res.data.liked;
        resolve(status);
      })
      .catch((err) => reject(err.response));
  });
}

export {
  login,
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
};
