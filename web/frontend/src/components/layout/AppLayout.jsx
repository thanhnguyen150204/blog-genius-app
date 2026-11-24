import { useState, useEffect } from "react";
import AppSidebar from "./AppSidebar";
import NavigationMenuShopify from "../../NavigationMenuShopify";
import "./AppSidebar.scss";
import { useLocation, Navigate } from "react-router-dom";
/**
 * Detects whether the application is running embedded inside Shopify Admin iframe
 * or as a standalone web application.
 */
export function isEmbeddedInShopify() {
  if (typeof window === "undefined") return false;

  const searchParams = new URLSearchParams(window.location.search);
  // Manual override parameters for testing & development
  if (searchParams.get("standalone") === "true") return false;
  if (searchParams.get("embedded") === "1" || searchParams.get("host")) return true;

  try {
    return window.top !== window.self;
  } catch (e) {
    // Cross-origin access blocked = inside an external iframe (Shopify Admin)
    return true;
  }
}

export default function AppLayout({ children }) {
  const location = useLocation();
  const [isEmbedded, setIsEmbedded] = useState(() => isEmbeddedInShopify());
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Remember user collapse preference from localStorage
    return localStorage.getItem("bg_sidebar_collapsed") === "true";
  });

  useEffect(() => {
    const handleCheck = () => {
      setIsEmbedded(isEmbeddedInShopify());
    };
    window.addEventListener("popstate", handleCheck);
    return () => window.removeEventListener("popstate", handleCheck);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("bg_sidebar_collapsed", String(next));
      return next;
    });
  };

  if (location.pathname === "/login") {
    return children;
  }

  // When embedded inside Shopify Admin iframe:
  // Render Shopify App Bridge navigation menu and Polaris page directly.
  if (isEmbedded) {
    return (
      <>
        <NavigationMenuShopify />
        {children}
      </>
    );
  }
  const isAuthenticated = Boolean(localStorage.getItem("bg_auth_token"));
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // When running standalone outside Shopify:
  // Render full web layout with modern left sidebar.
  return (
    <div className="bg-app-shell">
      <AppSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <main className={`bg-main-content ${isCollapsed ? "sidebar-collapsed" : ""}`}>
        {children}
      </main>
    </div>
  );
}
