import secureAxios from "./api";

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

function findLunch(ACCESS_TOKEN, maxParticipants = 2) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/lunches/find",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ maxParticipants }),
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

function cancelLunch(ACCESS_TOKEN, roomId) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: `/api/lunches/cancel/${roomId}`,
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

function completeLunch(ACCESS_TOKEN, roomId) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: `/api/lunches/complete/${roomId}`,
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

function fetchOnline(ACCESS_TOKEN) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/users/online",
      method: "GET",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err.response));
  });
}

function submitFeedback(ACCESS_TOKEN, feedbackObj) {
  return new Promise((resolve, reject) => {
    secureAxios({
      url: "/api/users/feedback",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ feedback: feedbackObj }),
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err.response));
  });
}

export {
  login,
  fetchMe,
  findLunch,
  cancelLunch,
  completeLunch,
  fetchOnline,
  submitFeedback,
};
