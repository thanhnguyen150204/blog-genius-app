import { useState } from "react";
import { Icon, Tooltip } from "@shopify/polaris";

/**
 * ElementTile renders an individual tool button in the 4-column Tapita element grid.
 */
export function ElementTile({ item, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <Tooltip content={item.description || item.label} preferredPosition="above">
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          background: isHovered ? "#f4f4f5" : "transparent",
          border: "none",
          borderRadius: "8px",
          padding: "10px 4px 8px 4px",
          cursor: "pointer",
          outline: "none",
          transition: "background-color 0.15s ease",
        }}
        aria-label={item.label}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "6px",
            color: isHovered ? "#ea580c" : "#202223",
            transition: "color 0.15s ease",
          }}
        >
          <Icon source={item.icon} tone="base" />
        </div>

        <span
          style={{
            fontSize: "11.5px",
            fontWeight: 400,
            color: isHovered ? "#18181b" : "#4b5563",
            textAlign: "center",
            lineHeight: "1.25",
            wordBreak: "break-word",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {item.label}
        </span>
      </button>
    </Tooltip>
  );
}

export default ElementTile;
