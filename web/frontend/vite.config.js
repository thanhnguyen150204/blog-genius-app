import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const host = process.env.HOST
  ? process.env.HOST.replace(/https?:\/\//, "")
  : "localhost";

let hmrConfig;
if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: parseInt(process.env.FRONTEND_PORT) || 8002,
    clientPort: 443,
  };
}

export default defineConfig({
  root: "./",
  plugins: [
    react(),
    {
      name: "html-transform",
      transformIndexHtml(html) {
        return html.replace(
          /%SHOPIFY_API_KEY%/g,
          process.env.SHOPIFY_API_KEY || "8ac4d7551bb977744fc4fbb95a8c0c1e"
        );
      },
    },
  ],
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(
      process.env.SHOPIFY_API_KEY || "8ac4d7551bb977744fc4fbb95a8c0c1e"
    ),
  },
  server: {
    host: "localhost",
    port: parseInt(process.env.FRONTEND_PORT) || 8002,
    hmr: hmrConfig,
    proxy: {
      "^/api(/|(\\?.*)?$)": "http://localhost:3001",
    },
  },
});
