import { default as axios } from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatters";

// Initialize an Axios object (authorizedAxiosInstance) for general customization and configuration purposes for the project.
let authorizedAxiosInstance = axios.create();

// Maximum waiting time of 1 request: 10 minutes
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// withCredentials: Will allow axios to automatically send cookies in each request to BE (to serve the purpose of saving JWT tokens (refresh & access) in the browser's httpOnly Cookie)
authorizedAxiosInstance.defaults.withCredentials = true;

/**
 * Configure Interceptors (Interceptors between every Request & Response)
 * https://axios-http.com/docs/interceptors
 */

// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is
    interceptorLoadingElements(true);

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    interceptorLoadingElements(false);

    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    interceptorLoadingElements(false);

    let errorMessage = error?.message;
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }
    // Use toastify to display any error code on the screen to refresh the token. Except for the 410 GONE code which serves to automatically refresh the token
    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
