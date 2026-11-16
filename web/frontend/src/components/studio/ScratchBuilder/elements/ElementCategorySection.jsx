import { ElementTile } from "./ElementTile";

/**
 * ElementCategorySection renders a category title and a 4-column grid of tool elements.
 */
export function ElementCategorySection({
  category,
  tools,
  onSelect,
  showDivider = true,
}) {
  if (!tools || tools.length === 0) return null;

  return (
    <div
      style={{
        paddingTop: showDivider ? "16px" : "4px",
        marginTop: showDivider ? "14px" : "0px",
        borderTop: showDivider ? "1px solid #f1f2f4" : "none",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#09090b",
          marginBottom: "10px",
          letterSpacing: "-0.015em",
        }}
      >
        {category.title}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px 4px",
          alignItems: "start",
        }}
      >
        {tools.map((tool) => (
          <ElementTile key={tool.id} item={tool} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

export default ElementCategorySection;
