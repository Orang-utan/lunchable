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

export { login, fetchMe };
