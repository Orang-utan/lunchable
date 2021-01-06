let interval = null;

function fetchToken() {
  const newRefreshToken = localStorage.getItem("authRefreshToken");
  if (newRefreshToken) {
    const payload = { newRefreshToken };
    chrome.runtime.sendMessage({ type: "login", payload }, (response) => {
      clearInterval(interval);
    });
  }
}

async function main() {
  interval = setInterval(fetchToken, 500);
}

main();
