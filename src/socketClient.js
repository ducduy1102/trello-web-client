// // https://socket.io/how-to/use-with-react#example
// import { io } from "socket.io-client";
// import { API_ROOT } from "@/utils/constants";
// export const socketIoInstance = io(API_ROOT);
import { io } from "socket.io-client";
import { API_ROOT } from "@/utils/constants";

let socket = null;

export const getSocket = () => socket;

export const initSocket = () => {
  if (!socket) {
    socket = io(API_ROOT);

    // Optional: debug
    // socket.on("connect", () => {
    //   console.log("Socket connected with ID:", socket.id);
    // });

    // socket.on("disconnect", () => {
    //   console.log("Socket disconnected");
    // });
  }

  return socket;
};
