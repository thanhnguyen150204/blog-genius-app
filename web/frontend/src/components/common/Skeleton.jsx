// Skeleton Primitives with Anti-slop Shimmer
import "./Skeleton.scss";

export function SkeletonBox({ width = "100%", height = "16px", borderRadius = "6px", style = {}, className = "" }) {
  return (
    <div
      className={`bg-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export function SkeletonCircle({ size = 36, style = {}, className = "" }) {
  return (
    <div
      className={`bg-skeleton bg-skeleton-circle ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export function SkeletonPill({ width = "54px", height = "20px", style = {} }) {
  return <SkeletonBox width={width} height={height} borderRadius="99px" style={style} />;
}
