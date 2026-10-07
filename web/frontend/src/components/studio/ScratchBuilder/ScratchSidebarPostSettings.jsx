import { useState, useRef, useEffect, useMemo } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Button,
  ButtonGroup,
  RadioButton,
  Checkbox,
  Popover,
  DatePicker,
  Icon,
  Select,
  TextField,
  Card,
  Box,
  Divider,
  Modal,
} from "@shopify/polaris";
import {
  UploadIcon,
  ImageIcon,
  MagicIcon,
  DeleteIcon,
  LanguageIcon,
  DesktopIcon,
  TabletIcon,
  MobileIcon,
  CalendarIcon,
  ClockIcon,
} from "@shopify/polaris-icons";
import { addImageToLibrary } from "../../../mock/imageLibraryData";

const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TIME_OPTIONS = [
  "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM",
  "03:00 AM", "03:30 AM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM",
  "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM",
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
  "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
];

function formatDateDisplay(year, month, day) {
  const m = FULL_MONTH_NAMES[month] || "October";
  return `${m} ${day}, ${year}`;
}

function parseDateString(str) {
  if (!str) return new Date(2026, 9, 8);
  try {
    const parts = str.replace(/,/g, "").trim().split(/\s+/);
    if (parts.length === 3) {
      const maybeMonth = FULL_MONTH_NAMES.findIndex(
        (m) => m.toLowerCase().startsWith(parts[0].toLowerCase())
      );
      if (maybeMonth >= 0) {
        const day = parseInt(parts[1], 10) || 1;
        const year = parseInt(parts[2], 10) || 2026;
        return new Date(year, maybeMonth, day);
      }
      const maybeMonth2 = FULL_MONTH_NAMES.findIndex(
        (m) => m.toLowerCase().startsWith(parts[1].toLowerCase())
      );
      if (maybeMonth2 >= 0) {
        const day = parseInt(parts[0], 10) || 1;
        const year = parseInt(parts[2], 10) || 2026;
        return new Date(year, maybeMonth2, day);
      }
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d;
  } catch (e) {}
  return new Date(2026, 9, 8);
}

function getVisibilitySubtitle(dateStr, timeStr, timezoneStr) {
  const d = parseDateString(dateStr || "October 8, 2026");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();

  const rawTime = (timeStr || "12:00 PM").trim();
  let timeWithSec = rawTime;
  const parts = rawTime.split(" ");
  if (parts.length === 2) {
    const timeDigits = parts[0];
    const period = parts[1];
    const digitsParts = timeDigits.split(":");
    if (digitsParts.length === 2) {
      timeWithSec = `${digitsParts[0]}:${digitsParts[1]}:00 ${period}`;
    }
  }

  const tz = timezoneStr || "GMT+7";
  return `Will become visible on ${month}/${day}/${year} at ${timeWithSec} ${tz}`;
}

export function ScratchSidebarPostSettings({
  postData,
  onChange,
  onOpenLibraryModal,
  onOpenAiImageModal,
  isEditMode = false,
}) {
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [configDevice, setConfigDevice] = useState("desktop");
  const [isEditUrlModalOpen, setIsEditUrlModalOpen] = useState(false);
  const [editUrlBlog, setEditUrlBlog] = useState(postData.blogCategory || "News");
  const [editUrlHandle, setEditUrlHandle] = useState("");

  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);

  const selectedDateObj = useMemo(() => {
    return parseDateString(postData.visibilityDate || "October 8, 2026");
  }, [postData.visibilityDate]);

  const [{ dateViewMonth, dateViewYear }, setDateView] = useState({
    dateViewMonth: selectedDateObj.getMonth(),
    dateViewYear: selectedDateObj.getFullYear(),
  });

  const datePopoverRef = useRef(null);
  const timePopoverRef = useRef(null);

  useEffect(() => {
    setDateView({
      dateViewMonth: selectedDateObj.getMonth(),
      dateViewYear: selectedDateObj.getFullYear(),
    });
  }, [selectedDateObj]);

  const handleDateSelect = ({ start }) => {
    if (start) {
      const formatted = formatDateDisplay(start.getFullYear(), start.getMonth(), start.getDate());
      onChange({ visibilityDate: formatted });
      setIsDatePopoverOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePopoverRef.current &&
        !datePopoverRef.current.contains(event.target)
      ) {
        setIsDatePopoverOpen(false);
      }
      if (
        timePopoverRef.current &&
        !timePopoverRef.current.contains(event.target)
      ) {
        setIsTimePopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const isInitialCustom =
    Boolean(postData.author) &&
    postData.author !== "Default (Store Default)";
  const [isCustomAuthor, setIsCustomAuthor] = useState(isInitialCustom);
  const [customAuthorName, setCustomAuthorName] = useState(
    isInitialCustom ? postData.author : ""
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    const isCustom =
      Boolean(postData.author) &&
      postData.author !== "Default (Store Default)";
    setIsCustomAuthor(isCustom);
    if (isCustom) {
      setCustomAuthorName(postData.author);
    }
  }, [postData.author]);

  const languageOptions = [
    { label: "English (Primary)", value: "en" },
    { label: "Vietnamese (Tiếng Việt)", value: "vi" },
    { label: "French (Français)", value: "fr" },
    { label: "German (Deutsch)", value: "de" },
    { label: "Spanish (Español)", value: "es" },
  ];

  const authorOptions = [
    { label: "Default (Store Default)", value: "default" },
    { label: "Custom author...", value: "custom" },
  ];

  const blogOptions = [
    { label: "Please select", value: "" },
    { label: "News", value: "News" },
  ];

  const imageSizeOptions = [
    { label: "Original size", value: "original" },
    { label: "Inline (16px)", value: "16px" },
    { label: "Icon (32px)", value: "32px" },
    { label: "Thumbnail (50px)", value: "50px" },
    { label: "Small logo (100px)", value: "100px" },
    { label: "Logo (160px)", value: "160px" },
    { label: "Product thumbnail (240px)", value: "240px" },
    { label: "Product image (480px)", value: "480px" },
    { label: "Banner image (600px)", value: "600px" },
    { label: "Wallpaper (1024px)", value: "1024px" },
    { label: "Wallpaper (2048px)", value: "2048px" },
    { label: "Full width (100%)", value: "100%" },
    { label: "Custom...", value: "custom" },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        onChange({ featuredImage: dataUrl });
        addImageToLibrary({
          url: dataUrl,
          filename: file.name,
          title: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleOpenEditUrlModal = () => {
    setEditUrlBlog(postData.blogCategory || "News");
    setEditUrlHandle(currentHandle);
    setIsEditUrlModalOpen(true);
  };

  const handleSaveEditUrl = () => {
    const cleanHandle = (editUrlHandle || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    onChange({
      blogCategory: editUrlBlog,
      handle: cleanHandle,
    });
    setIsEditUrlModalOpen(false);
  };

  const handleSaveImageUrl = () => {
    if (imageUrlInput.trim()) {
      const url = imageUrlInput.trim();
      const filename = url.split("/").pop()?.split("?")[0] || `image-${Date.now()}.png`;
      onChange({ featuredImage: url });
      addImageToLibrary({
        url,
        filename,
        title: filename,
      });
      setImageUrlInput("");
    }
  };

  const handleAutoFillAlt = () => {
    const autoAlt = postData.title
      ? `Featured image illustrating ${postData.title}`
      : "Shopify Ecommerce Article Featured Graphic";
    onChange({ imageAlt: autoAlt });
  };

  const handleGenerateExcerpt = () => {
    const gen = `Comprehensive guide on ${postData.title || "ecommerce strategies"}, providing actionable tactics, data frameworks, and expert GEO optimization tips.`;
    onChange({ excerpt: gen });
  };

  const handleGenerateTags = () => {
    const tags = ["ecommerce", "shopify", "geo-seo", "2026-trends", "content-marketing"];
    onChange({ tags: tags.join(", ") });
  };

  const handleSuggestLinks = () => {
    const sampleLinks = [
      { title: "10 Proven Shopify SEO Tactics for 2026", url: "/blogs/news/shopify-seo-tactics" },
      { title: "How to Optimize for Google AI Overviews", url: "/blogs/news/google-ai-overviews" },
    ];
    onChange({ internalLinks: sampleLinks });
  };

  const handleAutoFillSeoTitle = () => {
    onChange({ seoTitle: postData.title || "Shopify Ecommerce Guide" });
  };

  const handleGenerateMetaDesc = () => {
    const desc = `Discover the ultimate guide on ${postData.title || "ecommerce strategies"}. Master SEO and GEO search rankings for your Shopify store.`;
    onChange({ metaDescription: desc });
  };

  const currentHandle =
    postData.handle ||
    (postData.title || "this-is-the-blog-post-title-2")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const seoTitleLength = (postData.seoTitle || postData.title || "").length;
  const seoTitlePercent = Math.min(100, (seoTitleLength / 60) * 100);
  const isSeoTitleGood = seoTitleLength >= 30 && seoTitleLength <= 65;

  return (
    <div
      style={{
        width: "360px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e4e4e7",
        height: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Sticky Language Selector Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#ffffff",
          padding: "12px 16px",
          borderBottom: "1px solid #f1f2f4",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1 }}>
          <Select
            label="Language"
            labelHidden
            options={languageOptions}
            value={postData.language || "en"}
            onChange={(val) => onChange({ language: val })}
          />
        </div>

        <Button
          icon={LanguageIcon}
          variant="tertiary"
          accessibilityLabel="Translate language"
        />
      </div>

      {/* Scrollable Form Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Post Visibility */}
        <BlockStack gap="150">
          <Text variant="headingSm" as="h3" fontWeight="bold">
            Post
          </Text>

          <BlockStack gap="100">
            <Text variant="bodySm" fontWeight="medium" tone="subdued">
              Visibility
            </Text>

            <BlockStack gap="150">
              <RadioButton
                label="Visible"
                checked={postData.visibility !== "hidden"}
                id="visibility-visible"
                name="visibility"
                onChange={() => onChange({ visibility: "visible" })}
              />
              <RadioButton
                label="Hidden"
                helpText={
                  postData.visibility === "hidden" && Boolean(postData.setVisibilityDate)
                    ? getVisibilitySubtitle(
                        postData.visibilityDate,
                        postData.visibilityTime,
                        postData.visibilityTimezone
                      )
                    : undefined
                }
                checked={postData.visibility === "hidden"}
                id="visibility-hidden"
                name="visibility"
                onChange={() =>
                  onChange({
                    visibility: "hidden",
                    setVisibilityDate: postData.setVisibilityDate ?? false,
                    visibilityDate: postData.visibilityDate || "October 8, 2026",
                    visibilityTime: postData.visibilityTime || "12:00 PM",
                    visibilityTimezone: postData.visibilityTimezone || "GMT+7",
                  })
                }
              />
            </BlockStack>

            {postData.visibility === "hidden" && (
              <div style={{ paddingLeft: "24px", marginTop: "4px" }}>
                <BlockStack gap="200">
                  <Checkbox
                    label="Set visibility date"
                    checked={Boolean(postData.setVisibilityDate)}
                    onChange={(newVal) => onChange({ setVisibilityDate: newVal })}
                  />

                  {/* Date Picker and Time Picker always displayed when Hidden */}
                  <BlockStack gap="200">
                    {/* Date Picker Input & Popover */}
                    <div
                      ref={datePopoverRef}
                      style={{ position: "relative", width: "100%" }}
                    >
                      <button
                        type="button"
                        id="visibility-date-picker-button"
                        onClick={() => {
                          setIsDatePopoverOpen((prev) => !prev);
                          setIsTimePopoverOpen(false);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "8px",
                          minHeight: "36px",
                          height: "36px",
                          padding: "6px 12px",
                          backgroundColor: "#ffffff",
                          border: isDatePopoverOpen
                            ? "2px solid #005bd3"
                            : "1px solid #8c9196",
                          borderRadius: "8px",
                          cursor: "pointer",
                          textAlign: "left",
                          boxShadow: isDatePopoverOpen
                            ? "0 0 0 1px #005bd3"
                            : "none",
                          boxSizing: "border-box",
                          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "#5c5f62",
                            flexShrink: 0,
                          }}
                        >
                          <Icon source={CalendarIcon} tone="subdued" />
                        </div>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#202223",
                            fontWeight: 400,
                            flex: 1,
                          }}
                        >
                          {postData.visibilityDate || "October 8, 2026"}
                        </span>
                      </button>

                      {isDatePopoverOpen && (
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            zIndex: 9999,
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            boxShadow:
                              "0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 20px rgba(0, 0, 0, 0.15)",
                            padding: "12px",
                            minWidth: "290px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DatePicker
                            month={dateViewMonth}
                            year={dateViewYear}
                            onChange={handleDateSelect}
                            onMonthChange={(m, y) =>
                              setDateView({ dateViewMonth: m, dateViewYear: y })
                            }
                            selected={{
                              start: selectedDateObj,
                              end: selectedDateObj,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Time Picker Input & Popover */}
                    <div
                      ref={timePopoverRef}
                      style={{ position: "relative", width: "100%" }}
                    >
                      <button
                        type="button"
                        id="visibility-time-picker-button"
                        onClick={() => {
                          setIsTimePopoverOpen((prev) => !prev);
                          setIsDatePopoverOpen(false);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          minHeight: "36px",
                          height: "36px",
                          padding: "6px 12px",
                          backgroundColor: "#ffffff",
                          border: isTimePopoverOpen
                            ? "2px solid #005bd3"
                            : "1px solid #8c9196",
                          borderRadius: "8px",
                          cursor: "pointer",
                          textAlign: "left",
                          boxShadow: isTimePopoverOpen
                            ? "0 0 0 1px #005bd3"
                            : "none",
                          boxSizing: "border-box",
                          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#5c5f62",
                              flexShrink: 0,
                            }}
                          >
                            <Icon source={ClockIcon} tone="subdued" />
                          </div>
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#202223",
                              fontWeight: 400,
                            }}
                          >
                            {postData.visibilityTime || "12:00 PM"}
                          </span>
                        </div>
                        <span
                          style={{
                            color: "#6d7175",
                            fontSize: "13px",
                            fontWeight: 400,
                          }}
                        >
                          {postData.visibilityTimezone || "GMT+7"}
                        </span>
                      </button>

                      {isTimePopoverOpen && (
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            right: 0,
                            zIndex: 9999,
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            boxShadow:
                              "0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 20px rgba(0, 0, 0, 0.15)",
                            maxHeight: "220px",
                            overflowY: "auto",
                            padding: "4px 0",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {TIME_OPTIONS.map((timeStr) => {
                            const isSelected =
                              (postData.visibilityTime || "12:00 PM") === timeStr;
                            return (
                              <div
                                key={timeStr}
                                onClick={() => {
                                  onChange({ visibilityTime: timeStr });
                                  setIsTimePopoverOpen(false);
                                }}
                                style={{
                                  padding: "8px 16px",
                                  fontSize: "13.5px",
                                  textAlign: "left",
                                  color: isSelected ? "#005bd3" : "#202223",
                                  fontWeight: isSelected ? 600 : 400,
                                  backgroundColor: isSelected
                                    ? "#f0f7ff"
                                    : "transparent",
                                  cursor: "pointer",
                                  transition: "background-color 0.1s ease",
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected)
                                    e.currentTarget.style.backgroundColor =
                                      "#f6f6f7";
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected)
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                }}
                              >
                                {timeStr}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </BlockStack>
                </BlockStack>
              </div>
            )}
          </BlockStack>
        </BlockStack>

        {/* Featured Image */}
        <BlockStack gap="200">
          <InlineStack align="space-between">
            <Text variant="bodySm" fontWeight="bold">
              Featured Image
            </Text>
            <Button
              variant="plain"
              icon={MagicIcon}
              onClick={onOpenAiImageModal}
            >
              Generate with AI
            </Button>
          </InlineStack>

          <div
            style={{
              border: "1px dashed #d4d4d8",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#fafafa",
              textAlign: "center",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            {postData.featuredImage ? (
              <BlockStack gap="200">
                <img
                  src={postData.featuredImage}
                  alt={postData.imageAlt || "Featured preview"}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #e4e4e7",
                  }}
                />
                <InlineStack gap="200" align="center">
                  <Button size="slim" icon={UploadIcon} onClick={() => fileInputRef.current?.click()}>
                    Replace
                  </Button>
                  <Button
                    size="slim"
                    icon={DeleteIcon}
                    tone="critical"
                    variant="plain"
                    onClick={() => onChange({ featuredImage: null })}
                  >
                    Remove
                  </Button>
                </InlineStack>
              </BlockStack>
            ) : (
              <InlineStack gap="200" align="center">
                <Button size="slim" icon={UploadIcon} onClick={() => fileInputRef.current?.click()}>
                  Upload file
                </Button>
                <Button size="slim" icon={ImageIcon} onClick={onOpenLibraryModal}>
                  Select from library
                </Button>
              </InlineStack>
            )}
          </div>

          <TextField
            label="or Insert image URL"
            value={imageUrlInput}
            onChange={setImageUrlInput}
            placeholder="https://..."
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveImageUrl();
              }
            }}
            connectedRight={
              <Button onClick={handleSaveImageUrl} disabled={!imageUrlInput.trim()}>
                Save
              </Button>
            }
          />

          <BlockStack gap="100">
            <InlineStack align="space-between">
              <Text variant="bodySm" tone="subdued">
                Image alt
              </Text>
              <Button variant="plain" onClick={handleAutoFillAlt}>
                Auto fill
              </Button>
            </InlineStack>
            <TextField
              label="Image alt"
              labelHidden
              value={postData.imageAlt || ""}
              onChange={(val) => onChange({ imageAlt: val.slice(0, 250) })}
              placeholder="Describe image for SEO & accessibility"
              autoComplete="off"
            />
            <Text variant="bodyXs" tone="subdued">
              {(postData.imageAlt || "").length}/250
            </Text>
          </BlockStack>

          {/* Image size scope */}
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodySm" tone="subdued">
                Image size scope
              </Text>
              <ButtonGroup variant="segmented">
                <Button
                  size="slim"
                  pressed={(postData.imageScope || "All devices") === "All devices"}
                  onClick={() => onChange({ imageScope: "All devices" })}
                >
                  All devices
                </Button>
                <Button
                  size="slim"
                  pressed={(postData.imageScope || "All devices") === "Per device"}
                  onClick={() => onChange({ imageScope: "Per device" })}
                >
                  Per device
                </Button>
              </ButtonGroup>
            </InlineStack>

            {postData.imageScope === "Per device" ? (
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="bodySm" tone="subdued">
                    Select device to config:
                  </Text>
                  <ButtonGroup variant="segmented">
                    <Button
                      size="slim"
                      icon={DesktopIcon}
                      pressed={configDevice === "desktop"}
                      onClick={() => setConfigDevice("desktop")}
                      accessibilityLabel="Desktop config"
                    />
                    <Button
                      size="slim"
                      icon={TabletIcon}
                      pressed={configDevice === "tablet"}
                      onClick={() => setConfigDevice("tablet")}
                      accessibilityLabel="Tablet config"
                    />
                    <Button
                      size="slim"
                      icon={MobileIcon}
                      pressed={configDevice === "mobile"}
                      onClick={() => setConfigDevice("mobile")}
                      accessibilityLabel="Mobile config"
                    />
                  </ButtonGroup>
                </InlineStack>

                <Select
                  label={`${configDevice.charAt(0).toUpperCase() + configDevice.slice(1)} image size`}
                  options={imageSizeOptions}
                  value={
                    postData.deviceImageSizes?.[configDevice] ||
                    (configDevice === "mobile" ? "100%" : "original")
                  }
                  onChange={(val) => {
                    const currentSizes = postData.deviceImageSizes || {
                      desktop: "original",
                      tablet: "original",
                      mobile: "100%",
                    };
                    onChange({
                      deviceImageSizes: {
                        ...currentSizes,
                        [configDevice]: val,
                      },
                    });
                  }}
                />
              </BlockStack>
            ) : (
              <BlockStack gap="150">
                <Select
                  label="Desktop image size"
                  options={imageSizeOptions}
                  value={postData.imageSize || "original"}
                  onChange={(val) => onChange({ imageSize: val })}
                />
                {postData.imageSize === "custom" && (
                  <TextField
                    label="Custom size (e.g. 750px or 80%)"
                    value={postData.customImageSize || ""}
                    onChange={(val) => onChange({ customImageSize: val })}
                    placeholder="750px"
                    autoComplete="off"
                  />
                )}
              </BlockStack>
            )}
          </BlockStack>
        </BlockStack>

        <Divider />

        {/* Excerpt */}
        <BlockStack gap="150">
          <InlineStack align="space-between">
            <Text variant="bodySm" fontWeight="bold">
              Excerpt
            </Text>
            <Button variant="plain" icon={MagicIcon} onClick={handleGenerateExcerpt}>
              Generate with AI
            </Button>
          </InlineStack>
          <TextField
            label="Excerpt"
            labelHidden
            multiline={3}
            value={postData.excerpt || ""}
            onChange={(val) => onChange({ excerpt: val })}
            placeholder="Eg: Add a summary of the post to appear on your home page or blog."
            autoComplete="off"
          />
        </BlockStack>

        <Divider />

        {/* Author & Blog */}
        <BlockStack gap="300">
          <Select
            label="Author"
            options={authorOptions}
            value={isCustomAuthor ? "custom" : "default"}
            onChange={(val) => {
              if (val === "custom") {
                setIsCustomAuthor(true);
                onChange({ author: customAuthorName || "" });
              } else {
                setIsCustomAuthor(false);
                onChange({ author: "Default (Store Default)" });
              }
            }}
          />
          {isCustomAuthor && (
            <TextField
              label="Custom author name"
              value={customAuthorName}
              onChange={(val) => {
                setCustomAuthorName(val);
                onChange({ author: val });
              }}
              placeholder="Enter author name"
              autoComplete="off"
            />
          )}
          <Select
            label="Blog"
            requiredIndicator
            options={blogOptions}
            value={postData.blogCategory !== undefined ? postData.blogCategory : "News"}
            onChange={(val) => onChange({ blogCategory: val })}
          />

          <TextField
            label="Keywords"
            value={postData.keyword || ""}
            onChange={(val) => onChange({ keyword: val })}
            placeholder="viet nam"
            autoComplete="off"
          />

          <BlockStack gap="100">
            <InlineStack align="space-between">
              <Text variant="bodySm" tone="subdued">
                Tags
              </Text>
              <Button variant="plain" icon={MagicIcon} onClick={handleGenerateTags}>
                Generate with AI
              </Button>
            </InlineStack>
            <TextField
              label="Tags"
              labelHidden
              value={postData.tags || ""}
              onChange={(val) => onChange({ tags: val })}
              placeholder="Vietnam, champions, victory, sports, national pride"
              autoComplete="off"
            />
          </BlockStack>
        </BlockStack>

        <Divider />

        {/* Internal Links */}
        <BlockStack gap="150">
          <InlineStack align="space-between">
            <Text variant="bodySm" fontWeight="bold">
              Internal Links ({postData.internalLinks ? postData.internalLinks.length : 0})
            </Text>
            <Button variant="plain" onClick={handleSuggestLinks}>
              Suggest Links
            </Button>
          </InlineStack>
          {postData.internalLinks && postData.internalLinks.length > 0 ? (
            <BlockStack gap="100">
              {postData.internalLinks.map((link, idx) => (
                <Box
                  key={idx}
                  padding="200"
                  background="bg-surface-secondary"
                  borderRadius="200"
                  borderWidth="025"
                  borderColor="border"
                >
                  <Text variant="bodySm" tone="interactive">
                    {link.title}
                  </Text>
                </Box>
              ))}
            </BlockStack>
          ) : (
            <Text variant="bodyXs" tone="subdued">
              No internal links added yet. Click &quot;Suggest Links&quot; to auto-link with other blogs.
            </Text>
          )}
        </BlockStack>

        <Divider />

          {/* Search Engine Listing Preview (Read-only real-time card) */}
          <BlockStack gap="200">
            <Text variant="bodySm" fontWeight="bold">
              Search Engine listing
            </Text>

            <Card padding="300" background="bg-surface-secondary">
              <BlockStack gap="050">
                <Text variant="headingSm" as="h4" tone="interactive">
                  {postData.seoTitle || postData.title || "Vietnam Crowned Champions—Deal With It"}
                </Text>
                <Text variant="bodyXs" tone="subdued">
                  https://thanh-store-oc3uxhrm.myshopify.com/blogs/{(postData.blogCategory || "news").toLowerCase()}/{currentHandle}
                </Text>
                <Text variant="bodySm" tone="subdued">
                  {postData.metaDescription || "Vietnam champions, and here's the case: heart, grit, and tactics that outclassed rivals. Doubt it? See why the win wasn't luck - it was inevitability."}
                </Text>
              </BlockStack>
            </Card>

            <BlockStack gap="100">
              <InlineStack align="space-between">
                <Text variant="bodySm" tone="subdued">
                  SEO title <span style={{ color: "#9e2a2b" }}>*</span>
                </Text>
                <Button variant="plain" onClick={handleAutoFillSeoTitle}>
                  Auto fill
                </Button>
              </InlineStack>
              <TextField
                label="SEO title"
                labelHidden
                value={postData.seoTitle !== undefined ? postData.seoTitle : (postData.title || "")}
                onChange={(val) => onChange({ seoTitle: val })}
                placeholder="SEO title"
                autoComplete="off"
              />
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#e4e4e7",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${seoTitlePercent}%`,
                    height: "100%",
                    backgroundColor: isSeoTitleGood ? "#16a34a" : "#ea580c",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              <Text variant="bodyXs" tone="subdued" alignment="end">
                {seoTitleLength} characters
              </Text>
            </BlockStack>

            <BlockStack gap="100">
              <InlineStack align="space-between">
                <Text variant="bodySm" tone="subdued">
                  Meta description <span style={{ color: "#9e2a2b" }}>*</span>
                </Text>
                <Button variant="plain" icon={MagicIcon} onClick={handleGenerateMetaDesc}>
                  Generate with AI
                </Button>
              </InlineStack>
              <TextField
                label="Meta description"
                labelHidden
                multiline={3}
                value={postData.metaDescription !== undefined ? postData.metaDescription : ""}
                onChange={(val) => onChange({ metaDescription: val.slice(0, 320) })}
                placeholder="Vietnam champions, and here's the case: heart, grit, and tactics that outclassed rivals..."
                autoComplete="off"
              />
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#e4e4e7",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, ((postData.metaDescription || "").length / 160) * 100)}%`,
                    height: "100%",
                    backgroundColor: (postData.metaDescription || "").length >= 100 && (postData.metaDescription || "").length <= 160 ? "#16a34a" : "#ea580c",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              <Text variant="bodyXs" tone="subdued" alignment="end">
                {(postData.metaDescription || "").length} characters
              </Text>
            </BlockStack>

            <BlockStack gap="100">
              <InlineStack align="space-between">
                <Text variant="bodySm" tone="subdued">
                  URL and handle <span style={{ color: "#9e2a2b" }}>*</span>
                </Text>
                <Button
                  variant="plain"
                  onClick={handleOpenEditUrlModal}
                >
                  Edit
                </Button>
              </InlineStack>
              <TextField
                label="URL and handle"
                labelHidden
                prefix={`/${(postData.blogCategory || "news").toLowerCase()}/`}
                readOnly
                value={currentHandle}
                autoComplete="off"
              />
            </BlockStack>
          </BlockStack>
      </div>

      {/* Edit URL Handle Modal matching Shopify standard */}
      <Modal
        open={isEditUrlModalOpen}
        onClose={() => setIsEditUrlModalOpen(false)}
        title="Edit URL handle"
        primaryAction={{
          content: "Save",
          onAction: handleSaveEditUrl,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setIsEditUrlModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Select
              label="Blog"
              requiredIndicator
              options={blogOptions}
              value={editUrlBlog}
              onChange={setEditUrlBlog}
            />
            <TextField
              label="URL handle"
              requiredIndicator
              prefix={`/${(editUrlBlog || "news").toLowerCase()}/`}
              value={editUrlHandle}
              onChange={setEditUrlHandle}
              helpText="The URL handle is used to create the web address for your blog post"
              autoComplete="off"
            />
          </BlockStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default ScratchSidebarPostSettings;
