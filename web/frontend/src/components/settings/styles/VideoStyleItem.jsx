import {
  Collapsible,
  Box,
  BlockStack,
} from "@shopify/polaris";
import {
  AccordionHeader,
  ToggleSwitch,
} from "../SettingsHelpers";

export default function VideoStyleItem({
  isOpen,
  onToggle,
  videoControls,
  setVideoControls,
  videoAutoplay,
  setVideoAutoplay,
  videoLoop,
  setVideoLoop,
}) {
  return (
    <div>
      <AccordionHeader
        title="Video"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="video-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            <ToggleSwitch
              label="Show controls"
              checked={videoControls}
              onChange={setVideoControls}
            />
            <ToggleSwitch
              label="Auto play"
              checked={videoAutoplay}
              onChange={setVideoAutoplay}
            />
            <ToggleSwitch
              label="Loop"
              checked={videoLoop}
              onChange={setVideoLoop}
            />

            {/* Video Preview Box */}
            <Box
              background="bg-surface"
              padding="400"
              borderRadius="200"
              borderWidth="025"
              borderColor="border"
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#000000",
                  aspectRatio: "16 / 9",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fdba74 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "16px",
                  }}
                >
                  {/* Top Video Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", zIndex: 2 }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "#ea580c",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      BG
                    </div>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "13px", color: "#18181b" }}>
                        Content Strategy: Automate Shopify Blog Writing
                      </div>
                      <div style={{ fontSize: "11px", color: "#52525b" }}>Blog Genius</div>
                    </div>
                  </div>

                  {/* Center Play Button */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "40px",
                        borderRadius: "10px",
                        backgroundColor: "#dc2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(220, 38, 38, 0.4)",
                      }}
                    >
                      <span style={{ color: "#ffffff", fontSize: "18px", marginLeft: "3px" }}>▶</span>
                    </div>
                  </div>

                  {/* Bottom Controls Bar */}
                  {videoControls ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        zIndex: 2,
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                        }}
                      >
                        ↗
                      </div>
                      <div
                        style={{
                          backgroundColor: "rgba(0,0,0,0.7)",
                          color: "#ffffff",
                          fontSize: "11px",
                          padding: "3px 8px",
                          borderRadius: "14px",
                          fontWeight: 500,
                        }}
                      >
                        Watch on YouTube
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </Box>
          </BlockStack>
        </Box>
      </Collapsible>
    </div>
  );
}
