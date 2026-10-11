import { useState } from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Box,
  Divider,
  Badge,
  Icon,
} from "@shopify/polaris";
import { ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from "@shopify/polaris-icons";
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
  const [internalIntent, setInternalIntent] = useState("All");

  const handlePostKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate("/studio");
    }
  };

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const dateNum = currentDate.getDate();

  const handleJumpToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrevPeriod = () => {
    setCurrentDate((prev) => {
      const y = prev.getFullYear();
      const m = prev.getMonth();
      const d = prev.getDate();
      if (calendarView === "Month") {
        return new Date(y, m - 1, 1);
      }
      if (calendarView === "Week") {
        return new Date(y, m, d - 7);
      }
      return new Date(y, m, d - 1);
    });
  };

  const handleNextPeriod = () => {
    setCurrentDate((prev) => {
      const y = prev.getFullYear();
      const m = prev.getMonth();
      const d = prev.getDate();
      if (calendarView === "Month") {
        return new Date(y, m + 1, 1);
      }
      if (calendarView === "Week") {
        return new Date(y, m, d + 7);
      }
      return new Date(y, m, d + 1);
    });
  };

  const isCurrentPeriod = (() => {
    if (calendarView === "Month") {
      return year === todayYear && month === todayMonth;
    }
    if (calendarView === "Day") {
      return year === todayYear && month === todayMonth && dateNum === todayDate;
    }
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(year, month, dateNum - dayOfWeek);
    const endOfWeek = new Date(year, month, dateNum - dayOfWeek + 6, 23, 59, 59);
    return today >= startOfWeek && today <= endOfWeek;
  })();

  const getCalendarTitle = () => {
    const monthName = currentDate.toLocaleString("en-US", { month: "long" });

    if (calendarView === "Week") {
      const dayOfWeek = currentDate.getDay();
      const startOfWeek = new Date(year, month, dateNum - dayOfWeek);
      const endOfWeek = new Date(year, month, dateNum - dayOfWeek + 6);
      const startMonth = startOfWeek.toLocaleString("en-US", { month: "long" });
      const endMonth = endOfWeek.toLocaleString("en-US", { month: "long" });
      if (startMonth === endMonth) {
        return `${startMonth} ${startOfWeek.getDate()} – ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
      }
      return `${startMonth} ${startOfWeek.getDate()} – ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    }

    if (calendarView === "Day") {
      const dayName = currentDate.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
      return `${dayName}, ${monthName} ${dateNum}, ${year}`;
    }

    return `${monthName} ${year}`;
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonthDays = Array.from(
    { length: firstDayOfWeek },
    (_, i) => daysInPrevMonth - firstDayOfWeek + 1 + i
  );
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
  const nextMonthDaysCount = totalCells - (firstDayOfWeek + daysInMonth);
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

  const weekDayOfWeek = currentDate.getDay();
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((name, idx) => {
    const d = new Date(year, month, dateNum - weekDayOfWeek + idx);
    const isToday =
      d.getFullYear() === todayYear &&
      d.getMonth() === todayMonth &&
      d.getDate() === todayDate;
    const isOtherMonth = d.getMonth() !== month;
    return {
      name,
      date: d.getDate(),
      isPrevMonth: isOtherMonth,
      isToday,
    };
  });

  const currentDayName = currentDate.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
  const isCurrentDayToday =
    year === todayYear && month === todayMonth && dateNum === todayDate;
  const currentMonthName = currentDate.toLocaleString("en-US", { month: "long" });

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center" wrap>
          <InlineStack gap="300" blockAlign="center">
            <div
              style={{
                minWidth:
                  calendarView === "Week"
                    ? "310px"
                    : calendarView === "Day"
                    ? "220px"
                    : "185px",
                flexShrink: 0,
              }}
            >
              <Text variant="headingLg" as="h2">
                {getCalendarTitle()}
              </Text>
            </div>
            <div
              className="calendar-nav-group"
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#f4f4f5",
                borderRadius: "8px",
                padding: "2px",
                border: "1px solid #e4e4e7",
                userSelect: "none",
                gap: "2px",
              }}
            >
              <button
                type="button"
                onClick={handleJumpToday}
                className={`calendar-nav-btn ${isCurrentPeriod ? "active" : ""}`}
                style={{
                  background: isCurrentPeriod ? "#ffffff" : "transparent",
                  border: "none",
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: isCurrentPeriod ? "600" : "500",
                  color: isCurrentPeriod ? "#18181b" : "#71717a",
                  cursor: "pointer",
                  borderRadius: "6px",
                  boxShadow: isCurrentPeriod
                    ? "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)"
                    : "none",
                  transition: "all 0.18s ease",
                  outline: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Today
              </button>

              <button
                type="button"
                onClick={handlePrevPeriod}
                className="calendar-nav-btn"
                aria-label="Previous time period"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "3px 6px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#71717a",
                  transition: "all 0.18s ease",
                  outline: "none",
                }}
              >
                <Icon source={ChevronLeftIcon} tone="subdued" />
              </button>

              <button
                type="button"
                onClick={handleNextPeriod}
                className="calendar-nav-btn"
                aria-label="Next time period"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "3px 6px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#71717a",
                  transition: "all 0.18s ease",
                  outline: "none",
                }}
              >
                <Icon source={ChevronRightIcon} tone="subdued" />
              </button>
            </div>
          </InlineStack>

          <InlineStack gap="300" blockAlign="center">
            <SlidingSegmentedControl
              options={["Month", "Week", "Day"]}
              value={calendarView}
              onChange={onViewChange}
              size="sm"
            />

            <Button icon={PlusCircleIcon} onClick={() => navigate("/studio")}>
              Create blog post
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
              {prevMonthDays.map((d) => (
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

              {currentMonthDays.map((day) => {
                const isToday =
                  year === todayYear &&
                  month === todayMonth &&
                  day === todayDate;
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

                    {isToday && isPostVisible && (
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

              {nextMonthDays.map((d) => (
                <div
                  key={`next-${d}`}
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
              {weekDays.map((item, index) => (
                <div
                  key={`${item.name}-${item.date}`}
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
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                {currentDayName}
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: isCurrentDayToday ? "#2563eb" : "#e2e8f0",
                  color: isCurrentDayToday ? "#ffffff" : "#18181b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                {dateNum}
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                {currentMonthName} {year}
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
              {isCurrentDayToday && isPostVisible ? (
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
