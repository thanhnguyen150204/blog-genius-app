import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Badge,
} from "@shopify/polaris";
import {
  ArrowLeftIcon,
  UndoIcon,
  RedoIcon,
  ViewIcon,
  DesktopIcon,
  TabletIcon,
  MobileIcon,
} from "@shopify/polaris-icons";

export function ScratchTopBar({
  title,
  onTitleChange,
  status = "Draft",
  onToggleStatus,
  viewport = "desktop",
  onViewportChange,
  onPreview,
  onSave,
  onBack,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <div
      style={{
        height: "56px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e4e4e7",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        gap: "16px",
        zIndex: 20,
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
        <Button
          icon={ArrowLeftIcon}
          variant="tertiary"
          onClick={onBack}
          accessibilityLabel="Back to list"
        />

        <div style={{ cursor: "pointer", display: "inline-flex" }} onClick={onToggleStatus}>
          <Badge tone={status.toLowerCase() === "published" ? "success" : "attention"}>
            {status}
          </Badge>
        </div>

        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            autoFocus
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#18181b",
              border: "1px solid #005bd3",
              borderRadius: "6px",
              padding: "4px 8px",
              outline: "none",
              backgroundColor: "#ffffff",
              minWidth: "260px",
              fontFamily: "inherit",
            }}
          />
        ) : (
          <span
            onClick={() => setIsEditingTitle(true)}
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#18181b",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {title || "Untitled Blog Post"}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <ButtonGroup variant="segmented">
          <Button
            icon={UndoIcon}
            disabled={!canUndo}
            onClick={onUndo}
            accessibilityLabel="Undo"
          />
          <Button
            icon={RedoIcon}
            disabled={!canRedo}
            onClick={onRedo}
            accessibilityLabel="Redo"
          />
        </ButtonGroup>

        <Button icon={ViewIcon} variant="secondary" onClick={onPreview}>
          Preview
        </Button>

        <Button variant="primary" onClick={onSave}>
          Publish
        </Button>

        <ButtonGroup variant="segmented">
          <Button
            icon={DesktopIcon}
            pressed={viewport === "desktop"}
            onClick={() => onViewportChange("desktop")}
            accessibilityLabel="Desktop view"
          />
          <Button
            icon={TabletIcon}
            pressed={viewport === "tablet"}
            onClick={() => onViewportChange("tablet")}
            accessibilityLabel="Tablet view"
          />
          <Button
            icon={MobileIcon}
            pressed={viewport === "mobile"}
            onClick={() => onViewportChange("mobile")}
            accessibilityLabel="Mobile view"
          />
        </ButtonGroup>
      </div>
    </div>
  );
}

export default ScratchTopBar;
