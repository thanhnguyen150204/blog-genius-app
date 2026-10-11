import { useState } from "react";
import { Page, Layout, BlockStack, Tabs } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  AiInfoSection,
  KnowledgeBaseSection,
  GlobalStylesSection,
  ClaudeApiKeySection,
  CreditHistorySection,
  CustomAssetsSection,
  BuyCreditsModal,
  SETTINGS_TABS,
  INITIAL_LOGS,
} from "../components/settings";

export default function Settings() {
  const shopify = useAppBridge();

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const [businessDesc, setBusinessDesc] = useState(() => {
    return localStorage.getItem("business_desc") || "";
  });
  const [targetCustomer, setTargetCustomer] = useState(() => {
    return localStorage.getItem("target_customer") || "";
  });
  const [businessDescLang, setBusinessDescLang] = useState("en-US");
  const [targetCustomerLang, setTargetCustomerLang] = useState("en-US");
  const [brandVoice, setBrandVoice] = useState(() => {
    return localStorage.getItem("brand_voice") || "";
  });
  const [targetMarket, setTargetMarket] = useState("none");
  const [knowledgeBase, setKnowledgeBase] = useState(() => {
    return localStorage.getItem("store_knowledge_base") || "";
  });

  const [expandedStyles, setExpandedStyles] = useState({
    content: true,
    heading: true,
    table: false,
    image: false,
    video: false,
    productCard: false,
    collectionCard: false,
    productGrid: false,
    button: false,
    imageAndText: false,
    tableOfContent: false,
  });
  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem("auto_save") === "true";
  });
  const [colorMode, setColorMode] = useState("unset");

  // Heading styles
  const [headingTag, setHeadingTag] = useState("H2");
  const [headingAlign, setHeadingAlign] = useState("left");
  const [headingColor, setHeadingColor] = useState("#000000");

  // Table styles
  const [tableBorderStyle, setTableBorderStyle] = useState("none");
  const [tableCellPadding, setTableCellPadding] = useState("10");
  const [tableHeaderTransparent, setTableHeaderTransparent] = useState(false);
  const [tableHeaderBg, setTableHeaderBg] = useState("#F5F5F5");
  const [tableHeaderColor, setTableHeaderColor] = useState("#000000");
  const [tableBodyTransparent, setTableBodyTransparent] = useState(false);
  const [tableBodyBg, setTableBodyBg] = useState("#FFFFFF");
  const [tableBodyColor, setTableBodyColor] = useState("#000000");

  // Image styles
  const [imageSizeScope, setImageSizeScope] = useState("all");
  const [imageSameSize, setImageSameSize] = useState("full");
  const [imageAlign, setImageAlign] = useState("center");
  const [imageObjectFit, setImageObjectFit] = useState("cover");
  const [imageObjectPosition, setImageObjectPosition] = useState("unset");

  // Video styles
  const [videoControls, setVideoControls] = useState(true);
  const [videoAutoplay, setVideoAutoplay] = useState(false);
  const [videoLoop, setVideoLoop] = useState(false);

  // Product Card styles
  const [prodShowDescription, setProdShowDescription] = useState(true);
  const [prodTransparentBg, setProdTransparentBg] = useState(true);
  const [prodAddToCartLabel, setProdAddToCartLabel] = useState("Add to Cart");
  const [prodAddToCartBgColor, setProdAddToCartBgColor] = useState("#4A4AF4");
  const [prodAddToCartTextColor, setProdAddToCartTextColor] = useState("#FFFFFF");

  // Collection Card styles
  const [collLayout, setCollLayout] = useState("side-by-side");
  const [collImageWidth, setCollImageWidth] = useState(50);
  const [collImageRatio, setCollImageRatio] = useState("4:3");
  const [collImageCornerRadius, setCollImageCornerRadius] = useState(8);
  const [collTitleFontSize, setCollTitleFontSize] = useState(24);
  const [collTitleColor, setCollTitleColor] = useState("#000000");
  const [collShowDescription, setCollShowDescription] = useState(true);
  const [collDescFontSize, setCollDescFontSize] = useState(14);
  const [collDescColor, setCollDescColor] = useState("#555555");
  const [collContentAlignment, setCollContentAlignment] = useState("left");
  const [collButtonLabel, setCollButtonLabel] = useState("Shop Collection");
  const [collButtonBgColor, setCollButtonBgColor] = useState("#000000");
  const [collButtonTextColor, setCollButtonTextColor] = useState("#FFFFFF");
  const [collButtonCornerRadius, setCollButtonCornerRadius] = useState(6);
  const [collButtonWidth, setCollButtonWidth] = useState("auto");
  const [collCardRadius, setCollCardRadius] = useState(12);
  const [collTransparentBg, setCollTransparentBg] = useState(true);

  // Product Grid styles
  const [gridMaxProducts, setGridMaxProducts] = useState(4);
  const [gridShowPrice, setGridShowPrice] = useState(true);
  const [gridTransparentBg, setGridTransparentBg] = useState(true);
  const [gridShowBtnHover, setGridShowBtnHover] = useState(true);
  const [gridBtnLabel, setGridBtnLabel] = useState("Add to Cart");
  const [gridBtnBgColor, setGridBtnBgColor] = useState("#000000");
  const [gridBtnTextColor, setGridBtnTextColor] = useState("#FFFFFF");
  const [gridBtnRadius, setGridBtnRadius] = useState(4);
  const [gridHoverAnimation, setGridHoverAnimation] = useState("slide-up");
  const [gridAlignment, setGridAlignment] = useState("center");
  const [gridTitle, setGridTitle] = useState("Featured Products");
  const [gridTitleColor, setGridTitleColor] = useState("#000000");

  // Button styles
  const [btnOpenNewTab, setBtnOpenNewTab] = useState(false);
  const [btnWidthMode, setBtnWidthMode] = useState("auto");
  const [btnPosition, setBtnPosition] = useState("left");
  const [btnPaddingV, setBtnPaddingV] = useState(10);
  const [btnPaddingH, setBtnPaddingH] = useState(22);
  const [btnTextAlign, setBtnTextAlign] = useState("center");
  const [btnFontSize, setBtnFontSize] = useState(14);
  const [btnFontWeight, setBtnFontWeight] = useState("600");
  const [btnTextTransform, setBtnTextTransform] = useState("none");
  const [btnLetterSpacing, setBtnLetterSpacing] = useState(0);
  const [btnStyle, setBtnStyle] = useState("fill");
  const [btnBorderRadius, setBtnBorderRadius] = useState(6);
  const [btnBorderWidth, setBtnBorderWidth] = useState(1);
  const [btnBgColor, setBtnBgColor] = useState("#008060");
  const [btnTextColor, setBtnTextColor] = useState("#FFFFFF");
  const [btnBorderColor, setBtnBorderColor] = useState("#008060");
  const [btnHoverBgColor, setBtnHoverBgColor] = useState("#004C3F");
  const [btnHoverTextColor, setBtnHoverTextColor] = useState("#FFFFFF");
  const [btnHoverBorderColor, setBtnHoverBorderColor] = useState("#004C3F");

  // Image & Text styles
  const [imgTextScope, setImgTextScope] = useState("all");
  const [imgTextSize, setImgTextSize] = useState("240");
  const [imgTextVerticalAlign, setImgTextVerticalAlign] = useState("center");
  const [imgTextHorizontalAlign, setImgTextHorizontalAlign] = useState("center");
  const [imgTextPosition, setImgTextPosition] = useState("left");

  // Table of Contents styles
  const [tocSettings] = useState(() => {
    try {
      const raw = localStorage.getItem("bloggenius_global_toc_style");
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      title: "Table of Contents",
      textColor: "#000000",
      listStyle: "none",
      indentation: "hierarchical",
      layout: "1-col",
      collapsible: false,
      excludedHeadingTypes: [],
    };
  });
  const [tocTitle, setTocTitle] = useState(() => tocSettings.title || "Table of Contents");
  const [tocTextColor, setTocTextColor] = useState(() => tocSettings.textColor || "#000000");
  const [tocListStyle, setTocListStyle] = useState(() => tocSettings.listStyle || "none");
  const [tocIndentation, setTocIndentation] = useState(() => tocSettings.indentation || "hierarchical");
  const [tocLayout, setTocLayout] = useState(() => tocSettings.layout || "1-col");
  const [tocCollapsible, setTocCollapsible] = useState(() => Boolean(tocSettings.collapsible));
  const [tocExcludeHeadings, setTocExcludeHeadings] = useState(() => tocSettings.excludedHeadingTypes || []);

  const [aiProvider, setAiProvider] = useState(() => {
    return localStorage.getItem("ai_provider") || "anthropic";
  });
  const [aiKeys, setAiKeys] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_provider_keys");
      if (saved) return JSON.parse(saved);
    } catch {}
    const legacyClaude = localStorage.getItem("claude_api_key") || "";
    return {
      anthropic: legacyClaude,
      openai: "",
      google: "",
      deepseek: "",
      qwen: "",
    };
  });
  const [aiModel, setAiModel] = useState(() => {
    return localStorage.getItem("ai_model") || "";
  });

  const [monthlyCredits] = useState(250);
  const [lifetimeCredits, setLifetimeCredits] = useState(55);
  const [logs] = useState(INITIAL_LOGS);

  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [selectedCreditPack, setSelectedCreditPack] = useState({
    id: "pack-200",
    credits: 200,
    price: 14.99,
  });

  // Custom Assets Tab State
  const [customCss, setCustomCss] = useState(
    "/* Add your custom styles for blog posts here */\n.custom-css {\n  font-family: inherit;\n}"
  );
  const [customJs, setCustomJs] = useState(
    "// Custom JS to execute on blog post pages\nconsole.log('Blog loaded');"
  );
  const [googleFontUrl, setGoogleFontUrl] = useState("");

  const toggleStyleSection = (key) => {
    setExpandedStyles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem("business_desc", businessDesc);
    localStorage.setItem("target_customer", targetCustomer);
    localStorage.setItem("brand_voice", brandVoice);
    localStorage.setItem("claude_api_key", aiKeys.anthropic || "");
    localStorage.setItem("ai_provider", aiProvider);
    localStorage.setItem("ai_provider_keys", JSON.stringify(aiKeys));
    localStorage.setItem("ai_model", aiModel);
    localStorage.setItem("store_knowledge_base", knowledgeBase);
    localStorage.setItem("auto_save", autoSave ? "true" : "false");
    localStorage.setItem(
      "bloggenius_global_toc_style",
      JSON.stringify({
        title: tocTitle,
        textColor: tocTextColor,
        listStyle: tocListStyle,
        indentation: tocIndentation,
        layout: tocLayout,
        collapsible: tocCollapsible,
        excludedHeadingTypes: tocExcludeHeadings,
      })
    );
    shopify.toast?.show("Settings saved successfully!");
  };

  const handleAutoSuggestAI = (field) => {
    if (field === "businessDesc") {
      setBusinessDesc(
        "Modern eco-friendly lifestyle brand focusing on organic cotton babywear, sustainable mother essentials, and non-toxic nursery accessories."
      );
      shopify.toast?.show("AI suggestion applied to Business description!");
    } else if (field === "targetCustomer") {
      setTargetCustomer(
        "First-time parents, expectant mothers, and gift shoppers aged 24-40 looking for safe, sustainable, premium baby and maternal care products."
      );
      shopify.toast?.show("AI suggestion applied to Target customer!");
    }
  };

  const handleBuyCredits = () => {
    setLifetimeCredits((prev) => prev + selectedCreditPack.credits);
    setIsBuyCreditsModalOpen(false);
    shopify.toast?.show(
      `Purchased ${selectedCreditPack.credits} lifetime credits successfully!`
    );
  };

  return (
    <Page
      title="Settings"
    >
      <BlockStack gap="500">
        <Tabs
          tabs={SETTINGS_TABS}
          selected={selectedTabIndex}
          onSelect={setSelectedTabIndex}
        />

        {selectedTabIndex === 0 ? (
          <Layout>
            <AiInfoSection
              businessDesc={businessDesc}
              setBusinessDesc={setBusinessDesc}
              businessDescLang={businessDescLang}
              setBusinessDescLang={setBusinessDescLang}
              targetCustomer={targetCustomer}
              setTargetCustomer={setTargetCustomer}
              targetCustomerLang={targetCustomerLang}
              setTargetCustomerLang={setTargetCustomerLang}
              brandVoice={brandVoice}
              setBrandVoice={setBrandVoice}
              targetMarket={targetMarket}
              setTargetMarket={setTargetMarket}
              onAutoSuggestAI={handleAutoSuggestAI}
            />

            <KnowledgeBaseSection
              knowledgeBase={knowledgeBase}
              setKnowledgeBase={setKnowledgeBase}
            />

            <GlobalStylesSection
              expandedStyles={expandedStyles}
              toggleStyleSection={toggleStyleSection}
              // Content
              autoSave={autoSave}
              setAutoSave={setAutoSave}
              colorMode={colorMode}
              setColorMode={setColorMode}
              // Heading
              headingTag={headingTag}
              setHeadingTag={setHeadingTag}
              headingAlign={headingAlign}
              setHeadingAlign={setHeadingAlign}
              headingColor={headingColor}
              setHeadingColor={setHeadingColor}
              // Table
              tableBorderStyle={tableBorderStyle}
              setTableBorderStyle={setTableBorderStyle}
              tableCellPadding={tableCellPadding}
              setTableCellPadding={setTableCellPadding}
              tableHeaderTransparent={tableHeaderTransparent}
              setTableHeaderTransparent={setTableHeaderTransparent}
              tableHeaderBg={tableHeaderBg}
              setTableHeaderBg={setTableHeaderBg}
              tableHeaderColor={tableHeaderColor}
              setTableHeaderColor={setTableHeaderColor}
              tableBodyTransparent={tableBodyTransparent}
              setTableBodyTransparent={setTableBodyTransparent}
              tableBodyBg={tableBodyBg}
              setTableBodyBg={setTableBodyBg}
              tableBodyColor={tableBodyColor}
              setTableBodyColor={setTableBodyColor}
              // Image
              imageSizeScope={imageSizeScope}
              setImageSizeScope={setImageSizeScope}
              imageSameSize={imageSameSize}
              setImageSameSize={setImageSameSize}
              imageAlign={imageAlign}
              setImageAlign={setImageAlign}
              imageObjectFit={imageObjectFit}
              setImageObjectFit={setImageObjectFit}
              imageObjectPosition={imageObjectPosition}
              setImageObjectPosition={setImageObjectPosition}
              // Video
              videoControls={videoControls}
              setVideoControls={setVideoControls}
              videoAutoplay={videoAutoplay}
              setVideoAutoplay={setVideoAutoplay}
              videoLoop={videoLoop}
              setVideoLoop={setVideoLoop}
              // Product Card
              prodShowDescription={prodShowDescription}
              setProdShowDescription={setProdShowDescription}
              prodTransparentBg={prodTransparentBg}
              setProdTransparentBg={setProdTransparentBg}
              prodAddToCartLabel={prodAddToCartLabel}
              setProdAddToCartLabel={setProdAddToCartLabel}
              prodAddToCartBgColor={prodAddToCartBgColor}
              setProdAddToCartBgColor={setProdAddToCartBgColor}
              prodAddToCartTextColor={prodAddToCartTextColor}
              setProdAddToCartTextColor={setProdAddToCartTextColor}
              // Collection Card
              collLayout={collLayout}
              setCollLayout={setCollLayout}
              collImageWidth={collImageWidth}
              setCollImageWidth={setCollImageWidth}
              collImageRatio={collImageRatio}
              setCollImageRatio={setCollImageRatio}
              collImageCornerRadius={collImageCornerRadius}
              setCollImageCornerRadius={setCollImageCornerRadius}
              collTitleFontSize={collTitleFontSize}
              setCollTitleFontSize={setCollTitleFontSize}
              collTitleColor={collTitleColor}
              setCollTitleColor={setCollTitleColor}
              collShowDescription={collShowDescription}
              setCollShowDescription={setCollShowDescription}
              collDescFontSize={collDescFontSize}
              setCollDescFontSize={setCollDescFontSize}
              collDescColor={collDescColor}
              setCollDescColor={setCollDescColor}
              collContentAlignment={collContentAlignment}
              setCollContentAlignment={setCollContentAlignment}
              collButtonLabel={collButtonLabel}
              setCollButtonLabel={setCollButtonLabel}
              collButtonBgColor={collButtonBgColor}
              setCollButtonBgColor={setCollButtonBgColor}
              collButtonTextColor={collButtonTextColor}
              setCollButtonTextColor={setCollButtonTextColor}
              collButtonCornerRadius={collButtonCornerRadius}
              setCollButtonCornerRadius={setCollButtonCornerRadius}
              collButtonWidth={collButtonWidth}
              setCollButtonWidth={setCollButtonWidth}
              collCardRadius={collCardRadius}
              setCollCardRadius={setCollCardRadius}
              collTransparentBg={collTransparentBg}
              setCollTransparentBg={setCollTransparentBg}
              // Product Grid
              gridMaxProducts={gridMaxProducts}
              setGridMaxProducts={setGridMaxProducts}
              gridShowPrice={gridShowPrice}
              setGridShowPrice={setGridShowPrice}
              gridTransparentBg={gridTransparentBg}
              setGridTransparentBg={setGridTransparentBg}
              gridShowBtnHover={gridShowBtnHover}
              setGridShowBtnHover={setGridShowBtnHover}
              gridBtnLabel={gridBtnLabel}
              setGridBtnLabel={setGridBtnLabel}
              gridBtnBgColor={gridBtnBgColor}
              setGridBtnBgColor={setGridBtnBgColor}
              gridBtnTextColor={gridBtnTextColor}
              setGridBtnTextColor={setGridBtnTextColor}
              gridBtnRadius={gridBtnRadius}
              setGridBtnRadius={setGridBtnRadius}
              gridHoverAnimation={gridHoverAnimation}
              setGridHoverAnimation={setGridHoverAnimation}
              gridAlignment={gridAlignment}
              setGridAlignment={setGridAlignment}
              gridTitle={gridTitle}
              setGridTitle={setGridTitle}
              gridTitleColor={gridTitleColor}
              setGridTitleColor={setGridTitleColor}
              // Button
              btnOpenNewTab={btnOpenNewTab}
              setBtnOpenNewTab={setBtnOpenNewTab}
              btnWidthMode={btnWidthMode}
              setBtnWidthMode={setBtnWidthMode}
              btnPosition={btnPosition}
              setBtnPosition={setBtnPosition}
              btnPaddingV={btnPaddingV}
              setBtnPaddingV={setBtnPaddingV}
              btnPaddingH={btnPaddingH}
              setBtnPaddingH={setBtnPaddingH}
              btnTextAlign={btnTextAlign}
              setBtnTextAlign={setBtnTextAlign}
              btnFontSize={btnFontSize}
              setBtnFontSize={setBtnFontSize}
              btnFontWeight={btnFontWeight}
              setBtnFontWeight={setBtnFontWeight}
              btnTextTransform={btnTextTransform}
              setBtnTextTransform={setBtnTextTransform}
              btnLetterSpacing={btnLetterSpacing}
              setBtnLetterSpacing={setBtnLetterSpacing}
              btnStyle={btnStyle}
              setBtnStyle={setBtnStyle}
              btnBorderRadius={btnBorderRadius}
              setBtnBorderRadius={setBtnBorderRadius}
              btnBorderWidth={btnBorderWidth}
              setBtnBorderWidth={setBtnBorderWidth}
              btnBgColor={btnBgColor}
              setBtnBgColor={setBtnBgColor}
              btnTextColor={btnTextColor}
              setBtnTextColor={setBtnTextColor}
              btnBorderColor={btnBorderColor}
              setBtnBorderColor={setBtnBorderColor}
              btnHoverBgColor={btnHoverBgColor}
              setBtnHoverBgColor={setBtnHoverBgColor}
              btnHoverTextColor={btnHoverTextColor}
              setBtnHoverTextColor={setBtnHoverTextColor}
              btnHoverBorderColor={btnHoverBorderColor}
              setBtnHoverBorderColor={setBtnHoverBorderColor}
              // Image & Text
              imgTextScope={imgTextScope}
              setImgTextScope={setImgTextScope}
              imgTextSize={imgTextSize}
              setImgTextSize={setImgTextSize}
              imgTextVerticalAlign={imgTextVerticalAlign}
              setImgTextVerticalAlign={setImgTextVerticalAlign}
              imgTextHorizontalAlign={imgTextHorizontalAlign}
              setImgTextHorizontalAlign={setImgTextHorizontalAlign}
              imgTextPosition={imgTextPosition}
              setImgTextPosition={setImgTextPosition}
              // Table of Content
              tocTitle={tocTitle}
              setTocTitle={setTocTitle}
              tocTextColor={tocTextColor}
              setTocTextColor={setTocTextColor}
              tocListStyle={tocListStyle}
              setTocListStyle={setTocListStyle}
              tocIndentation={tocIndentation}
              setTocIndentation={setTocIndentation}
              tocLayout={tocLayout}
              setTocLayout={setTocLayout}
              tocCollapsible={tocCollapsible}
              setTocCollapsible={setTocCollapsible}
              tocExcludeHeadings={tocExcludeHeadings}
              setTocExcludeHeadings={setTocExcludeHeadings}
            />

            <ClaudeApiKeySection
              aiProvider={aiProvider}
              setAiProvider={setAiProvider}
              aiKeys={aiKeys}
              setAiKeys={setAiKeys}
              aiModel={aiModel}
              setAiModel={setAiModel}
            />

            <CreditHistorySection
              monthlyCredits={monthlyCredits}
              lifetimeCredits={lifetimeCredits}
              logs={logs}
              onOpenBuyCreditsModal={() => setIsBuyCreditsModalOpen(true)}
            />
          </Layout>
        ) : (
          <Layout>
            <CustomAssetsSection
              googleFontUrl={googleFontUrl}
              setGoogleFontUrl={setGoogleFontUrl}
              customCss={customCss}
              setCustomCss={setCustomCss}
              customJs={customJs}
              setCustomJs={setCustomJs}
              onSave={handleSaveSettings}
            />
          </Layout>
        )}
      </BlockStack>

      <BuyCreditsModal
        isOpen={isBuyCreditsModalOpen}
        onClose={() => setIsBuyCreditsModalOpen(false)}
        selectedCreditPack={selectedCreditPack}
        setSelectedCreditPack={setSelectedCreditPack}
        onBuyCredits={handleBuyCredits}
      />
    </Page>
  );
}
