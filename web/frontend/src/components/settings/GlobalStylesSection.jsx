import {
  Layout,
  Card,
  Divider,
} from "@shopify/polaris";
import ContentStyleItem from "./styles/ContentStyleItem";
import HeadingStyleItem from "./styles/HeadingStyleItem";
import TableStyleItem from "./styles/TableStyleItem";
import ImageStyleItem from "./styles/ImageStyleItem";
import VideoStyleItem from "./styles/VideoStyleItem";
import ProductCardStyleItem from "./styles/ProductCardStyleItem";
import CollectionCardStyleItem from "./styles/CollectionCardStyleItem";
import ProductGridStyleItem from "./styles/ProductGridStyleItem";
import ButtonStyleItem from "./styles/ButtonStyleItem";
import ImageAndTextStyleItem from "./styles/ImageAndTextStyleItem";
import TableOfContentStyleItem from "./styles/TableOfContentStyleItem";

export default function GlobalStylesSection({
  expandedStyles,
  toggleStyleSection,
  // Content
  autoSave,
  setAutoSave,
  colorMode,
  setColorMode,
  // Heading
  headingTag,
  setHeadingTag,
  headingAlign,
  setHeadingAlign,
  headingColor,
  setHeadingColor,
  // Table
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
  // Image
  imageSizeScope,
  setImageSizeScope,
  imageSameSize,
  setImageSameSize,
  imageAlign,
  setImageAlign,
  imageObjectFit,
  setImageObjectFit,
  imageObjectPosition,
  setImageObjectPosition,
  // Video
  videoControls,
  setVideoControls,
  videoAutoplay,
  setVideoAutoplay,
  videoLoop,
  setVideoLoop,
  // Product Card
  prodShowDescription,
  setProdShowDescription,
  prodTransparentBg,
  setProdTransparentBg,
  prodAddToCartLabel,
  setProdAddToCartLabel,
  prodAddToCartBgColor,
  setProdAddToCartBgColor,
  prodAddToCartTextColor,
  setProdAddToCartTextColor,
  // Collection Card
  collLayout,
  setCollLayout,
  collImageWidth,
  setCollImageWidth,
  collImageRatio,
  setCollImageRatio,
  collImageCornerRadius,
  setCollImageCornerRadius,
  collTitleFontSize,
  setCollTitleFontSize,
  collTitleColor,
  setCollTitleColor,
  collShowDescription,
  setCollShowDescription,
  collDescFontSize,
  setCollDescFontSize,
  collDescColor,
  setCollDescColor,
  collContentAlignment,
  setCollContentAlignment,
  collButtonLabel,
  setCollButtonLabel,
  collButtonBgColor,
  setCollButtonBgColor,
  collButtonTextColor,
  setCollButtonTextColor,
  collButtonCornerRadius,
  setCollButtonCornerRadius,
  collButtonWidth,
  setCollButtonWidth,
  collCardRadius,
  setCollCardRadius,
  collTransparentBg,
  setCollTransparentBg,
  // Product Grid
  gridMaxProducts,
  setGridMaxProducts,
  gridShowPrice,
  setGridShowPrice,
  gridTransparentBg,
  setGridTransparentBg,
  gridShowBtnHover,
  setGridShowBtnHover,
  gridBtnLabel,
  setGridBtnLabel,
  gridBtnBgColor,
  setGridBtnBgColor,
  gridBtnTextColor,
  setGridBtnTextColor,
  gridBtnRadius,
  setGridBtnRadius,
  gridHoverAnimation,
  setGridHoverAnimation,
  gridAlignment,
  setGridAlignment,
  gridTitle,
  setGridTitle,
  gridTitleColor,
  setGridTitleColor,
  // Button
  btnOpenNewTab,
  setBtnOpenNewTab,
  btnWidthMode,
  setBtnWidthMode,
  btnPosition,
  setBtnPosition,
  btnPaddingV,
  setBtnPaddingV,
  btnPaddingH,
  setBtnPaddingH,
  btnTextAlign,
  setBtnTextAlign,
  btnFontSize,
  setBtnFontSize,
  btnFontWeight,
  setBtnFontWeight,
  btnTextTransform,
  setBtnTextTransform,
  btnLetterSpacing,
  setBtnLetterSpacing,
  btnStyle,
  setBtnStyle,
  btnBorderRadius,
  setBtnBorderRadius,
  btnBorderWidth,
  setBtnBorderWidth,
  btnBgColor,
  setBtnBgColor,
  btnTextColor,
  setBtnTextColor,
  btnBorderColor,
  setBtnBorderColor,
  btnHoverBgColor,
  setBtnHoverBgColor,
  btnHoverTextColor,
  setBtnHoverTextColor,
  btnHoverBorderColor,
  setBtnHoverBorderColor,
  // Image & Text
  imgTextScope,
  setImgTextScope,
  imgTextSize,
  setImgTextSize,
  imgTextVerticalAlign,
  setImgTextVerticalAlign,
  imgTextHorizontalAlign,
  setImgTextHorizontalAlign,
  imgTextPosition,
  setImgTextPosition,
  // Table of Content
  tocTitle,
  setTocTitle,
  tocTextColor,
  setTocTextColor,
  tocListStyle,
  setTocListStyle,
  tocIndentation,
  setTocIndentation,
  tocLayout,
  setTocLayout,
  tocCollapsible,
  setTocCollapsible,
  tocExcludeHeadings,
  setTocExcludeHeadings,
}) {
  return (
    <Layout.AnnotatedSection
      id="global-styles"
      title="Global styles"
      description="Customize global typography and element styling for all blog articles."
    >
      <Card padding="0">
        <ContentStyleItem
          isOpen={expandedStyles.content}
          onToggle={() => toggleStyleSection("content")}
          autoSave={autoSave}
          setAutoSave={setAutoSave}
          colorMode={colorMode}
          setColorMode={setColorMode}
        />

        <Divider />

        <HeadingStyleItem
          isOpen={expandedStyles.heading}
          onToggle={() => toggleStyleSection("heading")}
          headingTag={headingTag}
          setHeadingTag={setHeadingTag}
          headingAlign={headingAlign}
          setHeadingAlign={setHeadingAlign}
          headingColor={headingColor}
          setHeadingColor={setHeadingColor}
        />

        <Divider />

        <TableStyleItem
          isOpen={expandedStyles.table}
          onToggle={() => toggleStyleSection("table")}
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
        />

        <Divider />

        <ImageStyleItem
          isOpen={expandedStyles.image}
          onToggle={() => toggleStyleSection("image")}
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
        />

        <Divider />

        <VideoStyleItem
          isOpen={expandedStyles.video}
          onToggle={() => toggleStyleSection("video")}
          videoControls={videoControls}
          setVideoControls={setVideoControls}
          videoAutoplay={videoAutoplay}
          setVideoAutoplay={setVideoAutoplay}
          videoLoop={videoLoop}
          setVideoLoop={setVideoLoop}
        />

        <Divider />

        <ProductCardStyleItem
          isOpen={expandedStyles.productCard}
          onToggle={() => toggleStyleSection("productCard")}
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
        />

        <Divider />

        <CollectionCardStyleItem
          isOpen={expandedStyles.collectionCard}
          onToggle={() => toggleStyleSection("collectionCard")}
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
        />

        <Divider />

        <ProductGridStyleItem
          isOpen={expandedStyles.productGrid}
          onToggle={() => toggleStyleSection("productGrid")}
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
        />

        <Divider />

        <ButtonStyleItem
          isOpen={expandedStyles.button}
          onToggle={() => toggleStyleSection("button")}
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
        />

        <Divider />

        <ImageAndTextStyleItem
          isOpen={expandedStyles.imageAndText}
          onToggle={() => toggleStyleSection("imageAndText")}
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
        />

        <Divider />

        <TableOfContentStyleItem
          isOpen={expandedStyles.tableOfContent}
          onToggle={() => toggleStyleSection("tableOfContent")}
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
      </Card>
    </Layout.AnnotatedSection>
  );
}
