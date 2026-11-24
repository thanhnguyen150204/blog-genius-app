import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./AppSidebar.scss";

// Precision 16x16 / 1.5px stroke icons (Linear / Vercel grade)
function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function IconIdeas() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
    </svg>
  );
}

function IconStudio() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function IconKeywords() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

function IconStrategy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconAuthors() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconResearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconPricing() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function IconFeedback() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconCollapseToggle({ isCollapsed }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {isCollapsed ? (
        <polyline points="9 18 15 12 9 6" />
      ) : (
        <polyline points="15 18 9 12 15 6" />
      )}
    </svg>
  );
}

// Crisp, bespoke typographic Monogram Logo (Anti-slop)
function BrandMonogram() {
  return (
    <div className="brand-monogram">
      <span className="brand-char">B</span>
      <span className="brand-dot"></span>
    </div>
  );
}

export default function AppSidebar({ isCollapsed, onToggleCollapse }) {
  const location = useLocation();

  const menuSections = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", path: "/", icon: <IconDashboard /> },
        { label: "Ideas", path: "/content-ideas", icon: <IconIdeas />, badge: "Radar" },
        { label: "Studio", path: "/studio", icon: <IconStudio /> },
        { label: "Keywords", path: "/keywords", icon: <IconKeywords /> },
      ],
    },
    {
      title: "Strategy",
      items: [
        { label: "Strategy", path: "/strategy", icon: <IconStrategy /> },
        { label: "Authors", path: "/authors", icon: <IconAuthors /> },
        { label: "Research", path: "/research", icon: <IconResearch /> },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Settings", path: "/settings", icon: <IconSettings /> },
        { label: "Pricing", path: "/pricing", icon: <IconPricing />, badgePro: "Pro" },
        { label: "Feedback", path: "/feature-request", icon: <IconFeedback /> },
      ],
    },
  ];

  return (
    <aside className={`bg-sidebar ${isCollapsed ? "is-collapsed" : ""}`}>
      {/* Top Header: Monogram & Brand Title */}
      <div className="sidebar-top">
        <NavLink to="/" className="brand-header">
          <BrandMonogram />
          {!isCollapsed && (
            <div className="brand-title-wrap">
              <span className="brand-title">BlogGenius</span>
              <span className="brand-version">v1.2</span>
            </div>
          )}
        </NavLink>

        {/* Store Selector (Workspace Switcher) */}
        {!isCollapsed && (
          <div className="store-selector" title="Connected Shopify Store">
            <div className="store-avatar">
              <span>S</span>
            </div>
            <div className="store-info">
              <div className="store-name-line">
                <span className="store-name">demo-store</span>
                <span className="live-indicator">
                  <span className="live-dot" />
                  Live
                </span>
              </div>
              <span className="store-domain">demo-store.myshopify.com</span>
            </div>
            <div className="store-caret">
              <IconChevronDown />
            </div>
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        {menuSections.map((section) => (
          <div key={section.title} className="nav-group">
            {!isCollapsed && <div className="nav-group-header">{section.title}</div>}
            {isCollapsed && <div className="nav-group-divider" />}

            <div className="nav-group-items">
              {section.items.map((item) => {
                const isActive =
                  item.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && <span className="nav-label">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className="nav-badge-radar">{item.badge}</span>
                    )}
                    {!isCollapsed && item.badgePro && (
                      <span className="nav-badge-pro">{item.badgePro}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: Refined Usage Meter & Collapse */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="usage-meter">
            <div className="usage-top">
              <span className="usage-label">Monthly Usage</span>
              <span className="usage-stat">
                <strong>250</strong> / 300
              </span>
            </div>
            <div className="usage-track">
              <div className="usage-bar" style={{ width: "83.3%" }} />
            </div>
            <div className="usage-sub">
              <span>Tier: Pro Plan</span>
              <NavLink to="/pricing" className="usage-link">
                Manage
              </NavLink>
            </div>
          </div>
        )}

        <div className="footer-actions">
          {!isCollapsed && (
            <div className="account-preview" title="Logged in as Admin">
              <div className="account-avatar">AD</div>
              <div className="account-meta">
                <span className="account-name">Store Admin</span>
                <span className="account-role">Workspace Owner</span>
              </div>
            </div>
          )}
          {!isCollapsed && (
            <button
              type="button"
              style={{
                background: "transparent",
                border: "1px solid #e4e4e7",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#ef4444",
                cursor: "pointer",
                marginRight: "6px",
              }}
              onClick={() => {
                localStorage.removeItem("bg_auth_token");
                localStorage.removeItem("bg_user");
                window.location.href = "/login";
              }}
              title="Sign out"
            >
              Log out
            </button>
          )}
          <button
            type="button"
            className="collapse-btn"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconCollapseToggle isCollapsed={isCollapsed} />
          </button>
        </div>
      </div>
    </aside>
  );
}
