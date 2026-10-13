import { Card, BlockStack, InlineStack, Text, Badge } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export function RecentPostsCard({ posts = [] }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-card-stretch">
      <Card>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text variant="headingMd" as="h2">
              Recent posts
            </Text>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", display: "flex", justifyContent: "center" }}>
                <Text variant="bodySm" tone="subdued" fontWeight="semibold">
                  GEO
                </Text>
              </div>
              <div style={{ width: "88px", display: "flex", justifyContent: "center" }}>
                <Text variant="bodySm" tone="subdued" fontWeight="semibold">
                  Status
                </Text>
              </div>
            </div>
          </div>

          <BlockStack gap="300">
            {posts.map((post) => (
              <div
                key={post.id}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: "16px" }}>
                  <div
                    role="button"
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/studio")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate("/studio");
                      }
                    }}
                  >
                    <Text variant="bodyMd" fontWeight="semibold" truncate>
                      {post.title}
                    </Text>
                  </div>
                  <InlineStack gap="200" blockAlign="center">
                    <Badge tone="info">{post.intent}</Badge>
                    <Text variant="bodyXs" tone="subdued">
                      • {post.publishedAt}
                    </Text>
                  </InlineStack>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                  <div style={{ width: "48px", display: "flex", justifyContent: "center" }}>
                    <Badge tone={post.geoScore > 80 ? "success" : post.geoScore > 50 ? "warning" : "critical"}>
                      <Text variant="bodyMd" fontWeight="semibold">
                        {post.geoScore}
                      </Text>
                    </Badge>
                  </div>

                  <div style={{ width: "88px", display: "flex", justifyContent: "center" }}>
                    <Badge tone="success">{post.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </BlockStack>
        </div>
      </Card>
    </div>
  );
}

export default RecentPostsCard;
