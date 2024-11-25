// console.log("import.meta.env", import.meta.env);
// console.log("process.env", process.env);

let apiRoot = "";
// C1: Dùng import.meta.env của vite
if (import.meta.env.MODE === "development" || import.meta.env.DEV) {
  apiRoot = "http://localhost:8888";
} else if (import.meta.env.BUILD_MODE === "production") {
  apiRoot = "https://trello-web-server.onrender.com/";
}

// C2: Config lại process.env trong vite.config.js
// if (process.env.BUILD_MODE === "dev") {
//   apiRoot = "http://localhost:8888";
// } else if (process.env.BUILD_MODE === "production") {
//   apiRoot = "https://trello-web-server.onrender.com/";
// }

export const API_ROOT = apiRoot;
