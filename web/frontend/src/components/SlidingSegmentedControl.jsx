import { useState, useRef, useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function SlidingSegmentedControl({
  options = [],
  value,
  onChange,
  size = "md",
  style = {},
}) {
  const containerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const activeIndex = options.findIndex((opt) => {
      const val = typeof opt === "string" ? opt : opt.value;
      return val === value;
    });

    if (activeIndex === -1) return;

    const btnElements = containerRef.current.querySelectorAll("button[data-segmented-option]");
    const activeBtn = btnElements[activeIndex];

    if (activeBtn) {
      setIndicator({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        ready: true,
      });
    }
  }, [value, options]);

    const activeOption = options.find((opt) => {
      const val = typeof opt === "string" ? opt : opt.value;
      return val === value;
    });

    const activeBg = (activeOption && typeof activeOption === "object" && activeOption.activeBg) || "#ffffff";
    const activeBorder = (activeOption && typeof activeOption === "object" && activeOption.activeBorder) || "none";
    const activeBoxShadow = (activeOption && typeof activeOption === "object" && activeOption.boxShadow) || "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)";

    return (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "#f4f4f5",
          borderRadius: "8px",
          padding: "3px",
          border: "1px solid #e4e4e7",
          userSelect: "none",
          maxWidth: "100%",
          overflowX: "auto",
          ...style,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3px",
            bottom: "3px",
            left: 0,
            transform: `translateX(${indicator.left}px)`,
            width: `${indicator.width}px`,
            backgroundColor: activeBg,
            borderRadius: "6px",
            border: activeBorder,
            boxShadow: activeBoxShadow,
            transition: indicator.ready
              ? "transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.2s ease, border-color 0.2s ease"
              : "none",
            opacity: indicator.ready ? 1 : 0,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const label = typeof opt === "string" ? opt : opt.label;
          const isActive = val === value;
          const activeTextColor = (opt && typeof opt === "object" && opt.activeColor) || "#18181b";
          const inactiveColor = (opt && typeof opt === "object" && opt.inactiveColor) || "#71717a";

          return (
            <button
              key={val}
              type="button"
              className={!isActive ? "sliding-seg-btn" : ""}
              data-segmented-option="true"
              onClick={() => onChange && onChange(val)}
              style={{
                position: "relative",
                zIndex: 2,
                background: "transparent",
                border: "none",
                padding: size === "sm" ? "4px 12px" : "6px 14px",
                fontSize: size === "sm" ? "12px" : "13px",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? activeTextColor : inactiveColor,
                cursor: "pointer",
                borderRadius: "6px",
                transition: "color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                outline: "none",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
}

export default SlidingSegmentedControl;
