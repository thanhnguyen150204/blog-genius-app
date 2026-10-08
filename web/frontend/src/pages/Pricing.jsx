import { useState } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Button,
  ButtonGroup,
  Modal,
  Badge,
  Card,
  Banner,
  Icon,
} from "@shopify/polaris";
import { CheckIcon } from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    monthlyCredits: 0,
    bonusCredits: 50,
    features: [
      "Unlimited blog posts",
      "50 AI credits (non-recurring)",
      "SEO audit",
      "Message our team to fix common SEO issues",
      "24/7 live chat support",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: 9.9,
    monthlyCredits: 100,
    bonusCredits: 0,
    features: [
      "Unlimited blog posts",
      "100 AI credits / month",
      "SEO audit & GEO optimization",
      "Auto outline & topic suggestions",
      "Standard featured image generation",
      "24/7 live chat support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    isPopular: true,
    price: 29.9,
    monthlyCredits: 250,
    bonusCredits: 55,
    features: [
      "Unlimited blog posts",
      "250 AI credits / month",
      "Advanced SEO & AI Overviews audit",
      "High-Quality AI Featured Images",
      "Keyword Discovery & Auto Suggestions",
      "Priority 24/7 live chat support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 79.9,
    monthlyCredits: 1000,
    bonusCredits: 100,
    features: [
      "Unlimited blog posts",
      "1,000 AI credits / month",
      "Custom AI Tone & Brand Voice models",
      "Bulk blog post generation & scheduling",
      "Dedicated SEO strategist",
      "24/7 VIP instant support",
    ],
  },
];

const CREDIT_PACKS = [
  { id: "pack-50", credits: 50, price: 4.99, popular: false },
  { id: "pack-200", credits: 200, price: 14.99, popular: true, save: "Save 25%" },
  { id: "pack-500", credits: 500, price: 29.99, popular: false, save: "Save 40%" },
];

export default function Pricing() {
  const shopify = useAppBridge();

  // Current active subscription state
  const [currentPlanId, setCurrentPlanId] = useState("pro");
  const [monthlyCredits, setMonthlyCredits] = useState({ remaining: 250, total: 250 });
  const [lifetimeCredits, setLifetimeCredits] = useState(55);

  // Selected plan tab for viewing card
  const [selectedPlanId, setSelectedPlanId] = useState("free");

  // Modals state
  const [planToSwitch, setPlanToSwitch] = useState(null);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [selectedCreditPack, setSelectedCreditPack] = useState(CREDIT_PACKS[1]);

  const activePlanObj = PLANS.find((p) => p.id === currentPlanId) || PLANS[2];
  const viewedPlanObj = PLANS.find((p) => p.id === selectedPlanId) || PLANS[0];

  const handleOpenSwitchModal = (plan) => {
    if (plan.id === currentPlanId) {
      shopify.toast?.show(`You are already on the ${plan.name} plan.`);
      return;
    }
    setPlanToSwitch(plan);
    setIsSwitchModalOpen(true);
  };

  const handleConfirmSwitchPlan = () => {
    if (!planToSwitch) return;
    setCurrentPlanId(planToSwitch.id);
    if (planToSwitch.id === "free") {
      setMonthlyCredits({ remaining: 0, total: 0 });
    } else {
      setMonthlyCredits({ remaining: planToSwitch.monthlyCredits, total: planToSwitch.monthlyCredits });
    }
    setIsSwitchModalOpen(false);
    shopify.toast?.show(`Successfully switched to ${planToSwitch.name} plan!`);
  };

  const handleBuyCredits = () => {
    if (!selectedCreditPack) return;
    setLifetimeCredits((prev) => prev + selectedCreditPack.credits);
    setIsBuyCreditsModalOpen(false);
    shopify.toast?.show(
      `Purchased ${selectedCreditPack.credits} lifetime credits successfully!`
    );
  };

  return (
    <div
      style={{
        padding: "24px 32px 80px 32px",
        maxWidth: "1160px",
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <Text variant="headingLg" as="h1" fontWeight="bold">
          Pricing
        </Text>

        <InlineStack gap="200" align="center">
          <Button variant="secondary" onClick={() => setIsBuyCreditsModalOpen(true)}>
            Buy extra credits
          </Button>
        </InlineStack>
      </div>

      <BlockStack gap="600">
        {/* Plan Switcher Tabs using Polaris ButtonGroup Segmented */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ButtonGroup variant="segmented">
            {PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isCurrent = currentPlanId === plan.id;
              return (
                <Button
                  key={plan.id}
                  pressed={isSelected}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  {plan.name} {isCurrent ? " (Active)" : ""}
                </Button>
              );
            })}
          </ButtonGroup>
        </div>

        {/* Centered Plan Card matching the user's design */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "380px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e1e3e5",
              padding: "28px 24px 24px 24px",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
              boxSizing: "border-box",
            }}
          >
            {/* Plan Title */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#202223",
                  lineHeight: "1.3",
                }}
              >
                {viewedPlanObj.name}
              </div>
              {viewedPlanObj.price > 0 ? (
                <div style={{ marginTop: "4px", fontSize: "14px", color: "#6d7175" }}>
                  <span style={{ fontSize: "22px", fontWeight: 700, color: "#202223" }}>
                    ${viewedPlanObj.price}
                  </span>{" "}
                  / month
                </div>
              ) : null}
            </div>

            {/* Dotted separator */}
            <div
              style={{
                borderTop: "1px dashed #d1d5db",
                marginBottom: "20px",
              }}
            />

            {/* Features Checklist with Polaris Icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "28px",
              }}
            >
              {viewedPlanObj.features.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    fontSize: "13px",
                    color: "#374151",
                    lineHeight: "1.45",
                  }}
                >
                  <div style={{ flexShrink: 0, marginTop: "1px" }}>
                    <Icon source={CheckIcon} tone="success" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Switch Plan Button using Polaris Button */}
            {currentPlanId === viewedPlanObj.id ? (
              <Button fullWidth disabled>
                Current Plan
              </Button>
            ) : (
              <Button
                fullWidth
                variant="primary"
                onClick={() => handleOpenSwitchModal(viewedPlanObj)}
              >
                Switch Plan
              </Button>
            )}
          </div>
        </div>

        {/* Current Plan Overview Card at Bottom */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e1e3e5",
            padding: "20px 24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          <BlockStack gap="200">
            <div style={{ fontSize: "14px", color: "#202223" }}>
              Your current plan:{" "}
              <span style={{ fontWeight: 700, textTransform: "uppercase" }}>
                {activePlanObj.name}
              </span>
            </div>

            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                fontSize: "13.5px",
                color: "#374151",
                lineHeight: "1.7",
              }}
            >
              <li>
                Monthly credits:{" "}
                <span style={{ fontWeight: 600 }}>
                  {monthlyCredits.remaining}/{monthlyCredits.total} credits
                </span>
              </li>
              <li>
                Lifetime credits:{" "}
                <span style={{ fontWeight: 600 }}>{lifetimeCredits} credits</span> - Never expire
              </li>
            </ul>
          </BlockStack>
        </div>
      </BlockStack>

      {/* Switch Plan Confirmation Modal */}
      <Modal
        open={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        title={`Switch to ${planToSwitch?.name} Plan`}
        primaryAction={{
          content: "Confirm Switch",
          onAction: handleConfirmSwitchPlan,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setIsSwitchModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <Text variant="bodyMd">
              Are you sure you want to switch your subscription to the{" "}
              <strong>{planToSwitch?.name}</strong> plan?
            </Text>
            {planToSwitch?.id === "free" ? (
              <Banner tone="warning">
                Switching to Free plan will reset your monthly recurring AI credits at the end
                of the billing cycle. Your lifetime credits ({lifetimeCredits}) will remain intact.
              </Banner>
            ) : (
              <Banner tone="info">
                You will be allocated {planToSwitch?.monthlyCredits} AI credits per month.
              </Banner>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Buy Extra Credits Modal */}
      <Modal
        open={isBuyCreditsModalOpen}
        onClose={() => setIsBuyCreditsModalOpen(false)}
        title="Buy Lifetime AI Credits"
        primaryAction={{
          content: `Purchase for $${selectedCreditPack.price}`,
          onAction: handleBuyCredits,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setIsBuyCreditsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text variant="bodySm" tone="subdued">
              Lifetime credits never expire and are consumed after monthly credits:
            </Text>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {CREDIT_PACKS.map((pack) => {
                const isSelected = selectedCreditPack.id === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedCreditPack(pack)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: isSelected ? "2px solid #005bd3" : "1px solid #e1e3e5",
                      backgroundColor: isSelected ? "#f0f7ff" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: "#202223" }}>
                        {pack.credits} AI Credits
                      </div>
                      <div style={{ fontSize: "12px", color: "#6d7175" }}>
                        Lifetime validity • Never expires
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {pack.save && (
                        <span
                          style={{
                            backgroundColor: "#def7ec",
                            color: "#03543f",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {pack.save}
                        </span>
                      )}
                      <span style={{ fontWeight: 700, fontSize: "15px", color: "#202223" }}>
                        ${pack.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}
