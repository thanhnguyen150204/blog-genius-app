import { useState, useCallback } from "react";
import { Popover, Icon } from "@shopify/polaris";
import {
  MenuHorizontalIcon,
  ViewIcon,
  EditIcon,
  DuplicateIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";

export function ArticleActionsMenu({
  post,
  onEdit,
  onView,
  onDuplicate,
  onDelete,
}) {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((active) => !active),
    [],
  );

  const handleAction = (callback) => {
    setPopoverActive(false);
    if (callback) callback(post);
  };

  const activator = (
    <button
      type="button"
      onClick={togglePopoverActive}
      aria-label="More actions"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "30px",
        height: "26px",
        borderRadius: "8px",
        border: "1px solid #e4e4e7",
        backgroundColor: popoverActive ? "#f4f4f5" : "#ffffff",
        color: "#27272a",
        cursor: "pointer",
        padding: 0,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (!popoverActive) {
          e.currentTarget.style.backgroundColor = "#f8fafc";
          e.currentTarget.style.borderColor = "#cbd5e1";
        }
      }}
      onMouseLeave={(e) => {
        if (!popoverActive) {
          e.currentTarget.style.backgroundColor = "#ffffff";
          e.currentTarget.style.borderColor = "#e4e4e7";
        }
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#27272a",
        }}
      >
        <Icon source={MenuHorizontalIcon} tone="base" />
      </div>
    </button>
  );

  const menuItems = [
    {
      label: "Preview",
      icon: ViewIcon,
      action: () => handleAction(onView),
      color: "#27272a",
      iconColor: "#3f3f46",
      destructive: false,
    },
    {
      label: "Edit",
      icon: EditIcon,
      action: () => handleAction(onEdit),
      color: "#27272a",
      iconColor: "#3f3f46",
      destructive: false,
    },
    {
      label: "Duplicate",
      icon: DuplicateIcon,
      action: () => handleAction(onDuplicate),
      color: "#27272a",
      iconColor: "#3f3f46",
      destructive: false,
    },
    {
      label: "Delete",
      icon: DeleteIcon,
      action: () => handleAction(onDelete),
      color: "#b91c1c",
      iconColor: "#b91c1c",
      destructive: true,
    },
  ];

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
      preferredAlignment="right"
      preferredPosition="below"
    >
      <div
        style={{
          padding: "6px",
          minWidth: "136px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
        }}
      >
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={item.action}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "7px 10px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "transparent",
              color: item.color,
              fontSize: "13px",
              fontWeight: 400,
              textAlign: "left",
              cursor: "pointer",
              transition: "background-color 0.12s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = item.destructive
                ? "#fef2f2"
                : "#f4f4f5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: item.iconColor,
              }}
            >
              <Icon source={item.icon} tone={item.destructive ? "critical" : "base"} />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 400, color: item.color }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </Popover>
  );
}

export default ArticleActionsMenu;
