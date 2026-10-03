import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";

// Fallback for standalone/local dev preview if window.shopify isn't initialized yet
if (typeof window !== "undefined" && !window.shopify) {
  window.shopify = {
    toast: {
      show: (message, options) => {
        console.log("[Shopify Toast]:", message, options);
      },
    },
    id: "8ac4d7551bb977744fc4fbb95a8c0c1e",
  };
}

createRoot(document.getElementById("root")).render(<App />);
