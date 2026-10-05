import { useState } from "react";
import { Text } from "@shopify/polaris";

export function FieldNoteTooltip({ text, children, placement = "top" }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!text) return children;

  return (
    <div
      style={{ position: "relative", width: "100%" }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {/* Speech bubble note */}
      {isVisible && (
        <div
          style={{
            position: "absolute",
            bottom: placement === "top" ? "calc(100% + 8px)" : "auto",
            top: placement === "bottom" ? "calc(100% + 8px)" : "auto",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ffffff",
            color: "#18181b",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            lineHeight: "16px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 4px 6px -2px rgba(0,0,0,0.05)",
            border: "1px solid #e4e4e7",
            zIndex: 1000,
            whiteSpace: "normal",
            minWidth: "200px",
            maxWidth: "320px",
            pointerEvents: "none",
            animation: "fieldNoteFade 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Text variant="bodyXs" as="p">
            {text}
          </Text>
          {/* Bottom pointer arrow */}
          <div
            style={{
              position: "absolute",
              top: placement === "top" ? "100%" : "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: placement === "top" ? "6px solid #ffffff" : "none",
              borderBottom: placement === "bottom" ? "6px solid #ffffff" : "none",
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
}

export default FieldNoteTooltip;
