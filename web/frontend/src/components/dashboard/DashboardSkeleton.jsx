import { Page, BlockStack, Grid } from "@shopify/polaris";
import { SkeletonBox, SkeletonCircle, SkeletonPill } from "../common/Skeleton";
import "../common/Skeleton.scss";

export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton-view">
      <Page>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", paddingBottom: "32px" }}>
          <BlockStack gap="500">
            {/* 1. Header Bar Skeleton */}
            <div className="skeleton-flex-between" style={{ minHeight: "44px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <SkeletonBox width="150px" height="32px" borderRadius="8px" />
                <SkeletonPill width="38px" height="20px" />
              </div>
              <SkeletonBox width="130px" height="36px" borderRadius="8px" />
            </div>

            {/* 2. Executive KPI Cards Skeleton (4 Separate Cards with 16px gap) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="skeleton-card"
                  style={{
                    padding: "18px 20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "110px",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <SkeletonBox width="52px" height="26px" borderRadius="6px" />
                    <SkeletonPill width="44px" height="18px" />
                  </div>
                  <div className="skeleton-flex-between" style={{ marginTop: "6px" }}>
                    <SkeletonBox width="115px" height="14px" />
                    <SkeletonBox width="14px" height="14px" borderRadius="2px" />
                  </div>
                  <SkeletonBox width="140px" height="11px" style={{ marginTop: "2px" }} />
                </div>
              ))}
            </div>

            {/* 3. Main Analytics Chart Card Skeleton */}
            <div className="skeleton-card skeleton-analytics-card">
              {/* Header */}
              <div className="skeleton-flex-between" style={{ paddingBottom: "14px", borderBottom: "1px solid #F1F5F9" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <SkeletonBox width="230px" height="20px" borderRadius="6px" />
                    <SkeletonPill width="84px" height="18px" />
                  </div>
                  <SkeletonBox width="340px" height="12px" />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <SkeletonBox width="180px" height="28px" borderRadius="6px" />
                  <SkeletonBox width="94px" height="28px" borderRadius="6px" />
                </div>
              </div>

              {/* Chart Grid */}
              <div className="skeleton-chart-grid">
                {/* Left: Wave chart area */}
                <div>
                  <div className="skeleton-flex-between" style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <SkeletonBox width="120px" height="28px" borderRadius="6px" />
                      <SkeletonPill width="90px" height="20px" />
                    </div>
                    <SkeletonBox width="140px" height="24px" borderRadius="99px" />
                  </div>
                  <SkeletonBox width="100%" height="185px" borderRadius="8px" />
                </div>

                {/* Right: Donut chart & legend */}
                <div style={{ borderLeft: "1px solid #F1F5F9", paddingLeft: "20px" }}>
                  <SkeletonBox width="130px" height="16px" style={{ marginBottom: "6px" }} />
                  <SkeletonBox width="80px" height="11px" style={{ marginBottom: "14px" }} />
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <SkeletonCircle size={105} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="skeleton-flex-between">
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <SkeletonCircle size={8} />
                          <SkeletonBox width="90px" height="12px" />
                        </div>
                        <SkeletonBox width="34px" height="12px" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Two-Column Opportunities & Health Skeleton */}
            <div className="skeleton-two-col-row">
              {/* Left (2/3): Trending Ideas Table Skeleton */}
              <div className="skeleton-card" style={{ padding: "20px" }}>
                <div className="skeleton-flex-between" style={{ marginBottom: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <SkeletonBox width="190px" height="18px" />
                      <SkeletonPill width="56px" height="16px" />
                    </div>
                    <SkeletonBox width="260px" height="11px" />
                  </div>
                  <SkeletonBox width="96px" height="28px" borderRadius="6px" />
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                  <SkeletonBox width="74px" height="24px" borderRadius="6px" />
                  <SkeletonBox width="84px" height="24px" borderRadius="6px" />
                  <SkeletonBox width="80px" height="24px" borderRadius="6px" />
                </div>

                {/* Table Rows */}
                {[1, 2, 3, 4].map((row) => (
                  <div key={row} className="skeleton-table-row">
                    <div style={{ flex: 1 }}>
                      <SkeletonBox width="70%" height="14px" style={{ marginBottom: "6px" }} />
                      <div style={{ display: "flex", gap: "6px" }}>
                        <SkeletonBox width="90px" height="11px" />
                        <SkeletonPill width="45px" height="14px" />
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <SkeletonBox width="45px" height="13px" />
                      <SkeletonPill width="42px" height="18px" />
                      <SkeletonBox width="54px" height="26px" borderRadius="6px" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Right (1/3): GEO Technical Health Skeleton */}
              <div className="skeleton-card" style={{ padding: "20px" }}>
                <SkeletonBox width="140px" height="18px" style={{ marginBottom: "6px" }} />
                <SkeletonBox width="200px" height="11px" style={{ marginBottom: "18px" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {[1, 2, 3, 4, 5, 6].map((row) => (
                    <div key={row} className="skeleton-checklist-row">
                      <SkeletonCircle size={16} />
                      <div style={{ flex: 1 }}>
                        <SkeletonBox width="85%" height="13px" style={{ marginBottom: "4px" }} />
                        <SkeletonBox width="60%" height="10px" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BlockStack>
        </div>
      </Page>
    </div>
  );
}

export default DashboardSkeleton;
