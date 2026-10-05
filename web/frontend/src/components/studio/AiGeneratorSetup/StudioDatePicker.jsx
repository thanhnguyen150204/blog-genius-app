import { useState, useCallback, useMemo } from "react";
import { Popover, DatePicker, TextField, Icon, Box } from "@shopify/polaris";
import { CalendarIcon } from "@shopify/polaris-icons";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function StudioDatePicker({ value = "05 Oct 2026", onChange }) {
  const [popoverActive, setPopoverActive] = useState(false);

  // Parse string "05 Oct 2026" to JS Date
  const parseStringToDate = useCallback((dateStr) => {
    try {
      const parts = (dateStr || "").trim().split(/\s+/);
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10) || 5;
        const monthIndex = MONTH_NAMES.findIndex(
          (m) => m.toLowerCase() === parts[1].toLowerCase()
        );
        const year = parseInt(parts[2], 10) || 2026;
        return new Date(year, monthIndex >= 0 ? monthIndex : 9, day);
      }
    } catch {
      // ignore
    }
    return new Date(2026, 9, 5);
  }, []);

  const initialDate = useMemo(() => parseStringToDate(value), [value, parseStringToDate]);

  const [{ month, year }, setDateView] = useState({
    month: initialDate.getMonth(),
    year: initialDate.getFullYear(),
  });

  const [selectedDates, setSelectedDates] = useState({
    start: initialDate,
    end: initialDate,
  });

  const handleMonthChange = useCallback((newMonth, newYear) => {
    setDateView({ month: newMonth, year: newYear });
  }, []);

  const handleDateSelection = useCallback(
    ({ start }) => {
      setSelectedDates({ start, end: start });
      const d = String(start.getDate()).padStart(2, "0");
      const m = MONTH_NAMES[start.getMonth()];
      const y = start.getFullYear();
      const formatted = `${d} ${m} ${y}`;
      if (onChange) {
        onChange(formatted);
      }
      setPopoverActive(false);
    },
    [onChange]
  );

  const togglePopoverActive = useCallback(
    () => setPopoverActive((active) => !active),
    []
  );

  const activator = (
    <div onClick={togglePopoverActive} style={{ width: "100%", cursor: "pointer" }}>
      <TextField
        value={value}
        prefix={<Icon source={CalendarIcon} tone="subdued" />}
        autoComplete="off"
        readOnly
        focused={popoverActive}
      />
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      <Popover
        active={popoverActive}
        activator={activator}
        autofocusTarget="none"
        onClose={togglePopoverActive}
      >
        <Box padding="300">
          <DatePicker
            month={month}
            year={year}
            onChange={handleDateSelection}
            onMonthChange={handleMonthChange}
            selected={selectedDates}
          />
        </Box>
      </Popover>
    </div>
  );
}

export default StudioDatePicker;
