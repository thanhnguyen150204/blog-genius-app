import { Card, InlineStack, Text, Icon } from "@shopify/polaris";
import { InfoIcon, StarFilledIcon, StarIcon, XIcon } from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";

export function RatingFeedbackCard({
  visible,
  onDismiss,
  userRating,
  onRate,
  hoverRating,
  onHoverRate,
}) {
  const shopify = useAppBridge();

  if (!visible) return null;

  return (
    <Card>
      <InlineStack align="space-between" blockAlign="center" wrap gap="300">
        <InlineStack gap="300" blockAlign="center">
          <Icon source={InfoIcon} tone="info" />
          <Text variant="bodyMd" fontWeight="semibold">
            How was your experience using Blog Genius AI SEO Blog Builder?
          </Text>
        </InlineStack>

        <InlineStack gap="300" blockAlign="center">
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="star-rating-btn"
                aria-label={`Rate ${star} star`}
                onClick={() => {
                  onRate(star);
                  shopify.toast?.show(`Thank you for rating ${star} stars ⭐!`);
                }}
                onMouseEnter={() => onHoverRate(star)}
                onMouseLeave={() => onHoverRate(0)}
                style={{
                  transition: "all 0.15s ease",
                  transform: star <= (hoverRating || userRating) ? "scale(1.15)" : "scale(1)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  source={star <= (hoverRating || userRating) ? StarFilledIcon : StarIcon}
                  tone={star <= (hoverRating || userRating) ? "warning" : "subdued"}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rating-close-btn"
            aria-label="Dismiss banner"
            onClick={onDismiss}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <Icon source={XIcon} tone="subdued" />
          </button>
        </InlineStack>
      </InlineStack>
    </Card>
  );
}

export default RatingFeedbackCard;
