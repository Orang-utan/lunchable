import axios from "axios";
import { API_ENDPOINT } from "./config";
import { setAccToken, setRefToken, getRefreshToken } from "./storageClient";

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

const secureAxios = axios.create({
  baseURL: API_ENDPOINT,
});

secureAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const errorResponse = error.response;

    if (errorResponse && isTokenExpiredError(errorResponse)) {
      return refreshTokenAndReattemptRequest(errorResponse);
    }

    return Promise.reject(error);
  }
);

function isTokenExpiredError(error) {
  return error.status === 401;
}

async function refreshTokenAndReattemptRequest(errorResponse) {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(new Error("Invalid refresh token"));
    }
    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber((accessToken) => {
        errorResponse.config.headers.Authorization = `Bearer ${accessToken}`;
        resolve(axios(errorResponse.config));
      });
    });
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      const response = await axios({
        method: "POST",
        url: `${API_ENDPOINT}/api/users/refreshToken`,
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ refreshToken }),
      });
      if (!response.data) {
        return Promise.reject(new Error("Failed to fetch refresh token"));
      }
      const newAccessToken = response.data.accessToken;
      await setAccToken(newAccessToken);
      isAlreadyFetchingAccessToken = false;
      onAccessTokenFetched(newAccessToken);
    }
    return retryOriginalRequest;
  } catch (err) {
    await setAccToken("");
    await setRefToken("");
    return Promise.reject(err);
  }
}

function onAccessTokenFetched(accessToken) {
  subscribers.forEach((callback) => callback(accessToken));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

export default secureAxios;
