import amplitude from "amplitude-js";
import { AMPLITUDE_URL } from "../../services/config";

export const initAmplitude = () => {
  amplitude.getInstance().init(AMPLITUDE_URL);
};

export const setAmplitudeUserDevice = (installationToken) => {
  amplitude.getInstance().setDeviceId(installationToken);
};

export const setAmplitudeUserId = (userId) => {
  amplitude.getInstance().setUserId(userId);
};

export const setAmplitudeUserProperties = (properties) => {
  amplitude.getInstance().setUserProperties(properties);
};

export const sendAmplitudeData = (eventType) => {
  amplitude.getInstance().logEvent(eventType);
};
