declare global {
  interface Window {
    GLOBAL_ENV: any
  }
}

const getValue = (variable: string) => {
  if (!window.GLOBAL_ENV || !window.GLOBAL_ENV[variable]) {
    console.error(`Variable ${variable} not found in window.GLOBAL_ENV`);
    throw new Error(`Variable ${variable} not found in window.GLOBAL_ENV`);
  }
  return window.GLOBAL_ENV[variable];
}

export default {
  API_ENDPOINT: getValue("API_ENDPOINT"),
  GATEWAY_ENDPOINT: getValue("GATEWAY_ENDPOINT"),
  IMAGE_ENDPOINT: getValue("IMAGE_ENDPOINT"),
};
