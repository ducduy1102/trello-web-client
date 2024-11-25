import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  // Allowed vite use process.env because define use import.meta.env
  // https://github.com/vitejs/vite/issues/1973
  define: {
    "process.env": process.env,
  },
  plugins: [react(), svgr()],
  // base: './'
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@Boards", replacement: "/src/pages/Boards" },
    ],
  },
  test: /\.svg$/,
  use: ["@svgr/webpack", "url-loader"],
});
