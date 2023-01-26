import axios, { AxiosError } from "axios";

const LogRequestError = (error: Error | AxiosError): void => {
  if (process.env.NEXT_PUBLIC_APP_ENV === "TEST") {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response);
        // console.error(error.response.data)
        // console.log(error.response.status)
        // console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Generic Axios request error", error.message);
      }
    } else {
      console.error("Non-Axios request error:", error);
    }
  }
};

export { LogRequestError };
