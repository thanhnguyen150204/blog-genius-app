import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  ButtonGroup,
  Button,
  Box,
  Divider,
  Badge,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { SlidingSegmentedControl } from "../SlidingSegmentedControl";

export function ContentCalendar({
  calendarView = "Month",
  onViewChange,
  calendarStatus = "All",
  onStatusChange,
  isPostVisible = true,
}) {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const handlePostKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate("/studio");
    }
  };

  const getCalendarTitle = () => {
    if (calendarView === "Week") return "September 27 – October 3, 2026";
    if (calendarView === "Day") return "SAT, October 3, 2026";
    return "October 2026";
  };

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center" wrap>
          <InlineStack gap="300" blockAlign="center">
            <Text variant="headingLg" as="h2">
              {getCalendarTitle()}
            </Text>
            <ButtonGroup variant="segmented">
              <Button size="slim" onClick={() => shopify.toast?.show("Jumped to today")}>
                Today
              </Button>
              <Button size="slim" onClick={() => shopify.toast?.show("Previous time period")}>
                &lt;
              </Button>
              <Button size="slim" onClick={() => shopify.toast?.show("Next time period")}>
                &gt;
              </Button>
            </ButtonGroup>
          </InlineStack>

          <InlineStack gap="300" blockAlign="center">
            <SlidingSegmentedControl
              options={["Month", "Week", "Day"]}
              value={calendarView}
              onChange={onViewChange}
              size="sm"
            />

            <Button onClick={() => navigate("/studio")}>
              + Create blog post
            </Button>
          </InlineStack>
        </InlineStack>

        <Box paddingBlockEnd="200">
          <SlidingSegmentedControl
            options={["All", "Published", "Scheduled", "Draft"]}
            value={calendarStatus}
            onChange={onStatusChange}
            size="md"
          />
        </Box>

        <Divider />

        {calendarView === "Month" && (
          <div
            className="calendar-view-container"
            style={{ border: "1px solid #e4e4e7", borderRadius: "8px", overflowX: "auto" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(70px, 1fr))",
                backgroundColor: "#fafafa",
                borderBottom: "1px solid #e4e4e7",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "600",
                color: "#71717a",
                padding: "8px 0",
                minWidth: "500px",
              }}
            >
              <div>SUN</div>
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(70px, 1fr))",
                gridAutoRows: "90px",
                minWidth: "500px",
              }}
            >
              {[27, 28, 29, 30].map((d) => (
                <div
                  key={`prev-${d}`}
                  style={{
                    borderRight: "1px solid #f4f4f5",
                    borderBottom: "1px solid #f4f4f5",
                    padding: "8px",
                    color: "#d4d4d8",
                    fontSize: "12px",
                  }}
                >
                  {d}
                </div>
              ))}

              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const isToday = day === 3;
                return (
                  <div
                    key={`day-${day}`}
                    className="calendar-day-cell"
                    style={{
                      borderRight: "1px solid #f4f4f5",
                      borderBottom: "1px solid #f4f4f5",
                      padding: "8px",
                      fontSize: "12px",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontWeight: isToday ? "700" : "500",
                          color: isToday ? "#ffffff" : "#27272a",
                          backgroundColor: isToday ? "#2563eb" : "transparent",
                          width: isToday ? "22px" : "auto",
                          height: isToday ? "22px" : "auto",
                          borderRadius: isToday ? "50%" : "0",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {day}
                      </span>
                    </div>

                    {day === 3 && isPostVisible && (
                      <div
                        role="button"
                        tabIndex={0}
                        className="calendar-post-chip"
                        onClick={() => navigate("/studio")}
                        onKeyDown={handlePostKeyDown}
                        style={{
                          marginTop: "6px",
                          backgroundColor: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: "4px",
                          padding: "3px 6px",
                          fontSize: "11px",
                          color: "#1d4ed8",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#10b981" }} />
                        test
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {calendarView === "Week" && (
          <div
            className="calendar-view-container"
            style={{ border: "1px solid #e4e4e7", borderRadius: "8px", overflowX: "auto" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(70px, 1fr))",
                minHeight: "240px",
                minWidth: "500px",
              }}
            >
              {[
                { name: "SUN", date: 27, isPrevMonth: true, isToday: false },
                { name: "MON", date: 28, isPrevMonth: true, isToday: false },
                { name: "TUE", date: 29, isPrevMonth: true, isToday: false },
                { name: "WED", date: 30, isPrevMonth: true, isToday: false },
                { name: "THU", date: 1, isPrevMonth: false, isToday: false },
                { name: "FRI", date: 2, isPrevMonth: false, isToday: false },
                { name: "SAT", date: 3, isPrevMonth: false, isToday: true },
              ].map((item, index) => (
                <div
                  key={item.name}
                  className="calendar-week-col"
                  style={{
                    borderRight: index < 6 ? "1px solid #f4f4f5" : "none",
                    padding: "16px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: item.isToday ? "#fafafa" : "#ffffff",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: "600", color: "#71717a", marginBottom: "8px" }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: item.isToday ? "700" : "500",
                      color: item.isToday ? "#ffffff" : item.isPrevMonth ? "#a1a1aa" : "#18181b",
                      backgroundColor: item.isToday ? "#2563eb" : "transparent",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item.date}
                  </div>

                  {item.isToday && isPostVisible && (
                    <div
                      role="button"
                      tabIndex={0}
                      className="calendar-post-chip"
                      onClick={() => navigate("/studio")}
                      onKeyDown={handlePostKeyDown}
                      style={{
                        width: "100%",
                        backgroundColor: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        borderRadius: "6px",
                        padding: "8px",
                        fontSize: "12px",
                        color: "#1d4ed8",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10b981" }} />
                        test
                      </div>
                      <span style={{ fontSize: "10px", color: "#6b7280" }}>Published</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {calendarView === "Day" && (
          <div className="calendar-view-container" style={{ border: "1px solid #e4e4e7", borderRadius: "8px", overflow: "hidden" }}>
            <div
              style={{
                backgroundColor: "#f0f9ff",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                borderBottom: "1px solid #e4e4e7",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>SAT</span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                3
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                October 2026
              </span>
            </div>

            <div
              style={{
                padding: "24px",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {isPostVisible ? (
                <div
                  role="button"
                  tabIndex={0}
                  className="calendar-day-card"
                  onClick={() => navigate("/studio")}
                  onKeyDown={handlePostKeyDown}
                >
                  <BlockStack gap="100">
                    <Text variant="bodyMd" fontWeight="semibold">
                      test
                    </Text>
                    <InlineStack gap="200" blockAlign="center">
                      <Badge tone="info">Informational</Badge>
                      <Text variant="bodyXs" tone="subdued">• Published 1m ago</Text>
                    </InlineStack>
                  </BlockStack>

                  <InlineStack gap="300" blockAlign="center">
                    <Badge tone="success">Published</Badge>
                    <Button
                      size="slim"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/studio");
                      }}
                    >
                      Edit post
                    </Button>
                  </InlineStack>
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "#a1a1aa", fontSize: "13px", padding: "30px 0" }}>
                  No {calendarStatus.toLowerCase()} posts in this period.
                </div>
              )}
            </div>
          </div>
        )}

        <Divider />
        <InlineStack align="end" gap="400" blockAlign="center">
          <InlineStack gap="150" blockAlign="center">
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
            <Text variant="bodySm" tone="subdued">Published</Text>
          </InlineStack>
          <InlineStack gap="150" blockAlign="center">
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
            <Text variant="bodySm" tone="subdued">Scheduled</Text>
          </InlineStack>
          <InlineStack gap="150" blockAlign="center">
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#9ca3af" }} />
            <Text variant="bodySm" tone="subdued">Draft</Text>
          </InlineStack>
          <Text variant="bodySm" tone="subdued">= Refresh due</Text>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

export default ContentCalendar;
