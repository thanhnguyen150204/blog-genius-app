import { useState } from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Icon,
  IndexTable,
} from "@shopify/polaris";
import { MagicIcon, ChevronRightIcon, ConfettiIcon } from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import { SlidingSegmentedControl } from "../SlidingSegmentedControl";

export function TrendingIdeasCard() {
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("topics");

  const tabOptions = [
    { label: "Topic Ideas", value: "topics" },
    { label: "Hot Keywords", value: "keywords" },
    { label: "AI Questions", value: "questions" },
  ];

  const tabData = {
    topics: {
      subtitle: "Curated blog post ideas based on breakout search trends",
      colQuery: "TOPIC & QUERY",
      colMetric1: "VOLUME",
      colMetric2: "GROWTH",
      items: [
        {
          id: "t-1",
          title: "Top 10 Fall Winter Fashion Trends 2026",
          subline: "fall winter fashion trends",
          tag: "Fashion",
          metric1: "6.4K/mo",
          metric2: "+185%",
          action: "Draft",
          prompt: "fall winter fashion trends 2026",
        },
        {
          id: "t-2",
          title: "Organic Cotton Baby Clothes Buying Guide",
          subline: "organic baby clothes",
          tag: "Baby Care",
          metric1: "4.8K/mo",
          metric2: "+120%",
          action: "Draft",
          prompt: "organic baby clothes guide",
        },
        {
          id: "t-3",
          title: "Daily Skincare Routine for Sensitive Skin",
          subline: "sensitive skin routine",
          tag: "Skincare",
          metric1: "8.2K/mo",
          metric2: "+90%",
          action: "Draft",
          prompt: "sensitive skin daily routine",
        },
        {
          id: "t-4",
          title: "Capsule Wardrobe Essentials for Working Women",
          subline: "capsule wardrobe guide",
          tag: "Lifestyle",
          metric1: "5.6K/mo",
          metric2: "+140%",
          action: "Draft",
          prompt: "capsule wardrobe essentials guide",
        },
        {
          id: "t-5",
          title: "Zero-Waste Kitchen Essentials for Beginners",
          subline: "zero waste kitchen products",
          tag: "Eco Living",
          metric1: "7.1K/mo",
          metric2: "+110%",
          action: "Draft",
          prompt: "zero waste kitchen essentials beginner guide",
        },
      ],
    },
    keywords: {
      subtitle: "High-volume breakout search keywords ready to rank",
      colQuery: "TRENDING QUERY",
      colMetric1: "VOLUME",
      colMetric2: "GROWTH",
      items: [
        {
          id: "k-1",
          title: "fall jacket styling guide",
          subline: "Informational • Low Competition",
          tag: "Breakout",
          metric1: "9.6K/mo",
          metric2: "+210%",
          action: "Write",
          prompt: "fall jacket styling guide",
        },
        {
          id: "k-2",
          title: "sustainable baby gifts newborn",
          subline: "Commercial • Easy KD",
          tag: "High Intent",
          metric1: "5.2K/mo",
          metric2: "+165%",
          action: "Write",
          prompt: "sustainable baby gifts newborn",
        },
        {
          id: "k-3",
          title: "gentle morning skincare routine",
          subline: "Informational • Low KD",
          tag: "Trending",
          metric1: "11.4K/mo",
          metric2: "+130%",
          action: "Write",
          prompt: "gentle morning skincare routine",
        },
        {
          id: "k-4",
          title: "eco friendly nursery decor ideas",
          subline: "Commercial • Low Competition",
          tag: "Rising",
          metric1: "4.1K/mo",
          metric2: "+115%",
          action: "Write",
          prompt: "eco friendly nursery decor ideas",
        },
        {
          id: "k-5",
          title: "minimalist home office setup 2026",
          subline: "Commercial • High Volume",
          tag: "Breakout",
          metric1: "8.8K/mo",
          metric2: "+105%",
          action: "Write",
          prompt: "minimalist home office setup 2026",
        },
      ],
    },
    questions: {
      subtitle: "Direct queries shoppers ask ChatGPT, Claude & Perplexity",
      colQuery: "AI QUESTION",
      colMetric1: "QUERIES",
      colMetric2: "AI ODDS",
      items: [
        {
          id: "q-1",
          title: "What are the essential clothing staples for fall 2026?",
          subline: "Wins AI Overviews & ChatGPT answers",
          tag: "ChatGPT",
          metric1: "3.4K/mo",
          metric2: "96%",
          action: "Answer",
          prompt: "What are the essential clothing staples for fall 2026?",
        },
        {
          id: "q-2",
          title: "Is organic cotton truly safer for newborn baby skin?",
          subline: "Top shopper question before purchasing",
          tag: "Perplexity",
          metric1: "2.8K/mo",
          metric2: "94%",
          action: "Answer",
          prompt: "Is organic cotton truly safer for newborn baby skin?",
        },
        {
          id: "q-3",
          title: "How many steps should a sensitive skin routine have?",
          subline: "Frequently cited in AI answer overviews",
          tag: "Google AI",
          metric1: "4.1K/mo",
          metric2: "91%",
          action: "Answer",
          prompt: "How many steps should a sensitive skin routine have?",
        },
        {
          id: "q-4",
          title: "What natural fabric is best for sensitive baby eczema?",
          subline: "High shopping search query before checkout",
          tag: "Claude",
          metric1: "2.2K/mo",
          metric2: "92%",
          action: "Answer",
          prompt: "What natural fabric is best for sensitive baby eczema?",
        },
        {
          id: "q-5",
          title: "How do I choose between linen and organic cotton sheets?",
          subline: "Featured in ChatGPT shopping comparisons",
          tag: "ChatGPT",
          metric1: "3.1K/mo",
          metric2: "95%",
          action: "Answer",
          prompt: "How do I choose between linen and organic cotton sheets?",
        },
      ],
    },
  };

  const currentTab = tabData[activeTab] || tabData.topics;

  const quickKeywords = [
    { text: "sustainable baby gifts", growth: "+95%" },
    { text: "capsule wardrobe", growth: "+140%" },
    { text: "clean skincare", growth: "+80%" },
  ];

  const handleAction = (item) => {
    shopify.toast?.show(`Opening AI Studio for "${item.prompt}"`);
    navigate("/studio");
  };

  const handleKeywordClick = (kw) => {
    shopify.toast?.show(`Researching keyword "${kw.text}"`);
    navigate("/keywords");
  };

  return (
    <div className="trending-ideas-card">
      <Card>
        <BlockStack gap="300">
        <InlineStack align="space-between" blockAlign="center" wrap>
              <BlockStack gap="050">
                <InlineStack gap="150" blockAlign="center">
                  <Text variant="headingMd" as="h2">
                    Trending content opportunities
                  </Text>
                  <Badge tone="magic">AI Radar</Badge>
                </InlineStack>
                <Text variant="bodySm" tone="subdued">
                  {currentTab.subtitle}
                </Text>
              </BlockStack>

              <Button
                variant="plain"
                onClick={() => navigate("/keywords")}
              >
                <InlineStack gap="050" blockAlign="center">
                  <span>Keywords research</span>
                  <Icon source={ChevronRightIcon} />
                </InlineStack>
              </Button>
            </InlineStack>

            <div style={{ maxWidth: "100%", overflowX: "auto" }}>
              <SlidingSegmentedControl
                options={tabOptions}
                value={activeTab}
                onChange={setActiveTab}
                size="sm"
              />
            </div>

          <div style={{ minWidth: 0, width: "100%", overflowX: "auto" }}>
            <IndexTable
              resourceName={{ singular: "opportunity", plural: "opportunities" }}
              itemCount={currentTab.items.length}
              headings={[
                { title: currentTab.colQuery },
                { title: currentTab.colMetric1, alignment: "end" },
                { title: currentTab.colMetric2, alignment: "center" },
                { title: "ACTION", alignment: "end" },
              ]}
              selectable={false}
            >
              {currentTab.items.map((item, index) => (
                <IndexTable.Row id={item.id} key={item.id} position={index}>
                  <IndexTable.Cell>
                    <div style={{ maxWidth: "320px", minWidth: 0, overflow: "hidden" }}>
                      <BlockStack gap="050">
                        <Text variant="bodyMd" fontWeight="semibold" truncate>
                          {item.title}
                        </Text>
                        <InlineStack gap="150" blockAlign="center" wrap={false}>
                          <Text variant="bodyXs" tone="subdued" truncate>
                            {item.subline}
                          </Text>
                          <Text variant="bodyXs" tone="subdued">
                            •
                          </Text>
                          <Badge tone="info" size="small">
                            {item.tag}
                          </Badge>
                        </InlineStack>
                      </BlockStack>
                    </div>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <div className="trending-metric-vol" style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <Text variant="bodySm" fontWeight="bold">
                        {item.metric1}
                      </Text>
                    </div>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <div style={{ display: "flex", justifyContent: "center", whiteSpace: "nowrap" }}>
                      <Badge tone="success">{item.metric2}</Badge>
                    </div>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <div style={{ display: "flex", justifyContent: "flex-end", whiteSpace: "nowrap", minWidth: "75px" }}>
                      <Button
                        size="slim"
                        variant="primary"
                        icon={MagicIcon}
                        onClick={() => handleAction(item)}
                      >
                        {item.action}
                      </Button>
                    </div>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </div>

          <div className="trending-insight-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                <Icon source={ConfettiIcon} tone="subdued" />
                <Text variant="bodyXs" tone="subdued" fontWeight="semibold">
                  Hot searches:
                </Text>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                {quickKeywords.map((kw) => (
                  <div
                    key={kw.text}
                    role="button"
                    tabIndex={0}
                    className="trending-hot-query-pill"
                    onClick={() => handleKeywordClick(kw)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleKeywordClick(kw)}
                  >
                    <span>{kw.text}</span>
                    <span className="growth-tag">{kw.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="trending-insight-action">
              <Button
                size="slim"
                variant="plain"
                onClick={() => navigate("/keywords")}
              >
                <InlineStack gap="050" blockAlign="center">
                  <span>Explore all</span>
                  <Icon source={ChevronRightIcon} />
                </InlineStack>
              </Button>
            </div>
          </div>
        </BlockStack>
      </Card>
    </div>
  );
}

export default TrendingIdeasCard;
