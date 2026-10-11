import {
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Button,
  TextField,
} from "@shopify/polaris";

export default function CustomAssetsSection({
  googleFontUrl,
  setGoogleFontUrl,
  customCss,
  setCustomCss,
  customJs,
  setCustomJs,
  onSave,
}) {
  return (
    <Layout.AnnotatedSection
      id="custom-assets"
      title="Custom Assets"
      description="Inject external brand fonts, custom CSS stylesheets, and JavaScript code to all blog post pages."
    >
      <Card>
        <BlockStack gap="400">
          <TextField
            label="Custom Fonts & Typography"
            value={googleFontUrl}
            onChange={setGoogleFontUrl}
            helpText="Paste Google Fonts URL or external @font-face link to apply brand fonts across all blog posts"
            autoComplete="off"
          />

          <TextField
            label="Custom CSS"
            value={customCss}
            onChange={setCustomCss}
            multiline={6}
            monospaced
            helpText="Add custom CSS rules for blog posts"
            autoComplete="off"
          />

          <TextField
            label="Custom JavaScript"
            value={customJs}
            onChange={setCustomJs}
            multiline={5}
            monospaced
            helpText="Custom JavaScript to execute on blog post pages"
            autoComplete="off"
          />
        </BlockStack>
      </Card>
    </Layout.AnnotatedSection>
  );
}
