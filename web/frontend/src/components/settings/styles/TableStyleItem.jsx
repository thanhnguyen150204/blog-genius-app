import {
  Collapsible,
  Box,
  BlockStack,
  InlineStack,
  Select,
  TextField,
  Checkbox,
  Text,
} from "@shopify/polaris";
import {
  AccordionHeader,
  ColorPickerInput,
  TABLE_BORDER_OPTIONS,
} from "../SettingsHelpers";

export default function TableStyleItem({
  isOpen,
  onToggle,
  tableBorderStyle,
  setTableBorderStyle,
  tableCellPadding,
  setTableCellPadding,
  tableHeaderTransparent,
  setTableHeaderTransparent,
  tableHeaderBg,
  setTableHeaderBg,
  tableHeaderColor,
  setTableHeaderColor,
  tableBodyTransparent,
  setTableBodyTransparent,
  tableBodyBg,
  setTableBodyBg,
  tableBodyColor,
  setTableBodyColor,
}) {
  return (
    <div>
      <AccordionHeader
        title="Table"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="table-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            <InlineStack gap="400" align="space-between">
              <div style={{ flex: 1 }}>
                <Select
                  label="Border style"
                  options={TABLE_BORDER_OPTIONS}
                  value={tableBorderStyle}
                  onChange={setTableBorderStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Cell padding"
                  type="number"
                  value={tableCellPadding}
                  onChange={setTableCellPadding}
                  suffix="PX"
                  autoComplete="off"
                />
              </div>
            </InlineStack>

            {/* Header color */}
            <BlockStack gap="200">
              <Text variant="bodySm" fontWeight="semibold">Header color</Text>
              <Checkbox
                label="Transparent header background"
                checked={tableHeaderTransparent}
                onChange={setTableHeaderTransparent}
              />
              {!tableHeaderTransparent && (
                <ColorPickerInput
                  label="Background"
                  value={tableHeaderBg}
                  onChange={setTableHeaderBg}
                />
              )}
              <ColorPickerInput
                label="Text"
                value={tableHeaderColor}
                onChange={setTableHeaderColor}
              />
            </BlockStack>

            {/* Body color */}
            <BlockStack gap="200">
              <Text variant="bodySm" fontWeight="semibold">Body color</Text>
              <Checkbox
                label="Transparent body background"
                checked={tableBodyTransparent}
                onChange={setTableBodyTransparent}
              />
              {!tableBodyTransparent && (
                <ColorPickerInput
                  label="Background"
                  value={tableBodyBg}
                  onChange={setTableBodyBg}
                />
              )}
              <ColorPickerInput
                label="Text"
                value={tableBodyColor}
                onChange={setTableBodyColor}
              />
            </BlockStack>

            {/* Table Preview Box */}
            <Box
              background="bg-surface"
              padding="400"
              borderRadius="200"
              borderWidth="025"
              borderColor="border"
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border:
                    tableBorderStyle === "solid"
                      ? "1px solid #d1d5db"
                      : tableBorderStyle === "dashed"
                      ? "1px dashed #d1d5db"
                      : tableBorderStyle === "dotted"
                      ? "1px dotted #d1d5db"
                      : "none",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: tableHeaderTransparent
                        ? "transparent"
                        : tableHeaderBg,
                      color: tableHeaderColor,
                    }}
                  >
                    <th
                      style={{
                        padding: `${tableCellPadding}px`,
                        textAlign: "left",
                        border:
                          tableBorderStyle !== "none"
                            ? `1px ${tableBorderStyle} #e5e7eb`
                            : "1px solid #f3f4f6",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      Heading 1
                    </th>
                    <th
                      style={{
                        padding: `${tableCellPadding}px`,
                        textAlign: "left",
                        border:
                          tableBorderStyle !== "none"
                            ? `1px ${tableBorderStyle} #e5e7eb`
                            : "1px solid #f3f4f6",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      Heading 2
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{
                      backgroundColor: tableBodyTransparent
                        ? "transparent"
                        : tableBodyBg,
                      color: tableBodyColor,
                    }}
                  >
                    <td
                      style={{
                        padding: `${tableCellPadding}px`,
                        border:
                          tableBorderStyle !== "none"
                            ? `1px ${tableBorderStyle} #e5e7eb`
                            : "1px solid #f3f4f6",
                        fontSize: "13px",
                      }}
                    >
                      Cell 1
                    </td>
                    <td
                      style={{
                        padding: `${tableCellPadding}px`,
                        border:
                          tableBorderStyle !== "none"
                            ? `1px ${tableBorderStyle} #e5e7eb`
                            : "1px solid #f3f4f6",
                        fontSize: "13px",
                      }}
                    >
                      Cell 2
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </BlockStack>
        </Box>
      </Collapsible>
    </div>
  );
}
