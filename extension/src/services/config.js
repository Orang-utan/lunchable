let API_ENDPOINT;
let WEB_ENDPOINT;
let SIGNUP_URL;
let LOGIN_URL;
let AMPLITUDE_URL;

switch (process.env.NODE_ENV) {
  case "development":
    console.log("Environment is 'development'");
    API_ENDPOINT = "http://localhost:5000";
    WEB_ENDPOINT = "http://localhost:3000";
    AMPLITUDE_URL = "f1a3c4ad6492ae81eb9122abafd3dbf6";

    break;
  case "production":
    console.log("Environment is 'production'");
    API_ENDPOINT = "https://pigeon-webapp.herokuapp.com";
    WEB_ENDPOINT = "http://joinpigeon.me";
    AMPLITUDE_URL = "f1a3c4ad6492ae81eb9122abafd3dbf6";
    break;
  default:
    throw new Error(`'NODE_ENV' ${process.env.NODE_ENV} is not handled!`);
}

SIGNUP_URL = `${WEB_ENDPOINT}/register`;
LOGIN_URL = `${WEB_ENDPOINT}/login`;

export { API_ENDPOINT, SIGNUP_URL, LOGIN_URL, AMPLITUDE_URL };
