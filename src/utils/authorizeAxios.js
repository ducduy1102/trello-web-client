import { default as axios } from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatters";
import { refreshTokenAPI } from "@/apis";

/** https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */

let axiosReduxStore;
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore;
};

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

// Initialize a promise for calling the refresh_token api
// The purpose of creating this Promise is to retry many previously failed apis when the refresh_token api is finished.
let refreshTokenPromise = null;

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

    /** Important: - Process Refresh Token - automatically */
    // Case 1: If you receive code - 401 - from BE, then call api to log out immediately
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false));
    }

    // Case 2: If you receive a 410 code from BE, call the api refresh token to refresh the accessToken
    // First, get the API requests that are having errors through error.config
    const originalRequests = error.config;
    // console.log("🚀 ~ originalRequests:", originalRequests);
    if (error.response?.status === 410 && originalRequests) {
      // Check if there is no refreshTokenPromise then assign the call to the refresh_token api and assign it to the refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // At the same time, accessToken is already in httpOnly cookie (processed from BE side)
            return data?.accessToken;
          })
          .catch((_error) => {
            // If you get any error from the refresh_token api => logout
            axiosReduxStore.dispatch(logoutUserAPI(false));
            return Promise.reject(_error);
          })
          .finally(() => {
            // Regardless of API success or failure, still reassign refreshToken
            refreshTokenPromise = null;
          });
      }

      // Need to return case refreshTokenPromise runs successfully and do more processing here
      return refreshTokenPromise.then((accessToken) => {
        /**
         * Step 1: In case the project needs to save accessToken to localstorage or somewhere else, we will write more code to handle it here.
         * ex: axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
         * Currently, this step 1 is not needed because we have put accessToken into cookie (processed from BE side) after the refreshToken api is successfully called.
         */

        // Step 2: (important) return our axios instance and combine the originalRequests to call back the first api that failed
        return authorizedAxiosInstance(originalRequests);
      });
    }

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
