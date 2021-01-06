function setNotifyCount(count, callback) {
  chrome.storage.local.set({ notifyCount: count }, () => {
    callback();
  });
}

function getNotifyCount(callback) {
  chrome.storage.local.get("notifyCount", (keyVal) => {
    const count = keyVal["notifyCount"];
    callback(count);
  });
}

function setRefreshToken(refreshToken, callback) {
  chrome.storage.local.set({ refreshToken }, () => {
    callback({ success: true });
  });
}

function setAccessToken(accessToken, callback) {
  chrome.storage.local.set({ accessToken }, () => {
    callback({ success: true });
  });
}

function setTokens(accessToken, refreshToken) {
  return new Promise((resolve, reject) => {
    setRefreshToken(refreshToken, (res1) => {
      setAccessToken(accessToken, (res2) => {
        if (res1 && res1.success && res2 && res2.success) {
          resolve();
        }
        reject(new Error("Set token failure"));
      });
    });
  });
}

function setAccToken(accessToken) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ accessToken }, () => {
      resolve();
    });
  });
}

function setRefToken(refreshToken) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ refreshToken }, () => {
      resolve();
    });
  });
}

function getRefreshToken() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("refreshToken", (tokenPair) => {
      const refreshToken = tokenPair["refreshToken"];

      if (refreshToken) {
        resolve(refreshToken);
      } else {
        reject(new Error("refreshToken not found"));
      }
    });
  });
}

function getAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("accessToken", (tokenPair) => {
      const accessToken = tokenPair["accessToken"];

      if (accessToken) {
        resolve(accessToken);
      } else {
        reject(new Error("accessToken not found"));
      }
    });
  });
}

export {
  setAccToken,
  setRefToken,
  setRefreshToken,
  setAccessToken,
  setTokens,
  getRefreshToken,
  getAccessToken,
  setNotifyCount,
  getNotifyCount,
};
