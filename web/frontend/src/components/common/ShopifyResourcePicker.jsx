import { useState, useMemo, useEffect } from "react";
import {
  Modal,
  TextField,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Thumbnail,
  Box,
  Checkbox,
  RadioButton,
  EmptyState,
  Icon,
} from "@shopify/polaris";
import { SearchIcon, ProductIcon, CollectionIcon } from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";

const DEFAULT_SAMPLE_PRODUCTS = [
  {
    id: "gid://shopify/Product/1001",
    title: "Snowboard Pro Series 2026",
    handle: "snowboard-pro-series-2026",
    price: "$699.00",
    vendor: "Apex Outdoors",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&auto=format&fit=crop&q=60",
    variantsCount: 3,
  },
  {
    id: "gid://shopify/Product/1002",
    title: "Organic Cotton Baby Onesie",
    handle: "organic-cotton-baby-onesie",
    price: "$24.99",
    vendor: "EcoBaby Essentials",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=150&auto=format&fit=crop&q=60",
    variantsCount: 4,
  },
  {
    id: "gid://shopify/Product/1003",
    title: "Sustainable Mother Essentials Kit",
    handle: "sustainable-mother-essentials-kit",
    price: "$89.00",
    vendor: "PureNest Care",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&auto=format&fit=crop&q=60",
    variantsCount: 2,
  },
  {
    id: "gid://shopify/Product/1004",
    title: "Non-Toxic Wooden Teether Set",
    handle: "non-toxic-wooden-teether-set",
    price: "$18.50",
    vendor: "EcoBaby Essentials",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=150&auto=format&fit=crop&q=60",
    variantsCount: 1,
  },
  {
    id: "gid://shopify/Product/1005",
    title: "Eco-Friendly Bamboo Diaper Pack",
    handle: "eco-friendly-bamboo-diaper-pack",
    price: "$32.00",
    vendor: "PureNest Care",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=150&auto=format&fit=crop&q=60",
    variantsCount: 3,
  },
  {
    id: "gid://shopify/Product/1006",
    title: "Thermal Merino Wool Beanie",
    handle: "thermal-merino-wool-beanie",
    price: "$45.00",
    vendor: "Apex Outdoors",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=150&auto=format&fit=crop&q=60",
    variantsCount: 5,
  },
];

const DEFAULT_SAMPLE_COLLECTIONS = [
  {
    id: "gid://shopify/Collection/2001",
    title: "Winter Gear & Outdoor Accessories",
    handle: "winter-gear-outdoor",
    productsCount: 24,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: "gid://shopify/Collection/2002",
    title: "Organic Babywear Collection",
    handle: "organic-babywear",
    productsCount: 18,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: "gid://shopify/Collection/2003",
    title: "Maternal Care & Wellness",
    handle: "maternal-care-wellness",
    productsCount: 12,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: "gid://shopify/Collection/2004",
    title: "Eco-Friendly Nursery Gifts",
    handle: "nursery-gifts",
    productsCount: 15,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: "gid://shopify/Collection/2005",
    title: "Best Sellers 2026",
    handle: "best-sellers",
    productsCount: 30,
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=150&auto=format&fit=crop&q=60",
  },
];

export default function ShopifyResourcePicker({
  open,
  onClose,
  onSelect,
  resourceType = "Product", 
  multiple = false,
  initialSelection = [],
  title,
}) {
  const shopify = useAppBridge();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [useFallbackModal, setUseFallbackModal] = useState(false);

  // Sync initial selection
  useEffect(() => {
    if (open) {
      const ids = (initialSelection || []).map((item) =>
        typeof item === "string" ? item : item.id
      );
      setSelectedIds(ids);
    }
  }, [open, initialSelection]);

  // Try App Bridge ResourcePicker first if available
  useEffect(() => {
    let isCancelled = false;

    if (open && !useFallbackModal) {
      if (typeof shopify?.resourcePicker === "function") {
        shopify
          .resourcePicker({
            type: resourceType.toLowerCase() === "collection" ? "collection" : "product",
            multiple,
            selectionIds: (initialSelection || []).map((item) => ({
              id: typeof item === "string" ? item : item.id,
            })),
          })
          .then((resources) => {
            if (!isCancelled && resources) {
              if (onSelect) onSelect(resources);
              if (onClose) onClose();
            } else if (!isCancelled && resources === undefined) {
              // User cancelled App Bridge picker
              if (onClose) onClose();
            }
          })
          .catch((err) => {
            console.warn("App Bridge resourcePicker unavailable, using Polaris modal fallback:", err);
            if (!isCancelled) setUseFallbackModal(true);
          });
      } else {
        setUseFallbackModal(true);
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [open, resourceType, multiple, shopify, useFallbackModal, initialSelection, onSelect, onClose]);

  const rawItems = resourceType.toLowerCase() === "collection"
    ? DEFAULT_SAMPLE_COLLECTIONS
    : DEFAULT_SAMPLE_PRODUCTS;

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return rawItems;
    return rawItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.vendor && item.vendor.toLowerCase().includes(q)) ||
        item.handle.toLowerCase().includes(q)
    );
  }, [rawItems, searchQuery]);

  const handleToggleSelect = (item) => {
    if (multiple) {
      setSelectedIds((prev) =>
        prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      setSelectedIds([item.id]);
    }
  };

  const handleConfirm = () => {
    const chosen = rawItems.filter((item) => selectedIds.includes(item.id));
    if (onSelect) onSelect(chosen);
    if (onClose) onClose();
  };

  const modalTitle =
    title ||
    `Select ${resourceType === "Collection" ? "Collection" : "Product"}${multiple ? "s" : ""}`;

  return (
    <Modal
      open={open && useFallbackModal}
      onClose={onClose}
      title={modalTitle}
      primaryAction={{
        content: `Select${selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}`,
        disabled: selectedIds.length === 0,
        onAction: handleConfirm,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="300">
          <TextField
            placeholder={`Search ${resourceType.toLowerCase()}s...`}
            value={searchQuery}
            onChange={setSearchQuery}
            prefix={<Icon source={SearchIcon} tone="subdued" />}
            autoComplete="off"
            clearButton
            onClearButtonClick={() => setSearchQuery("")}
          />

          <Box
            maxHeight="360px"
            overflowY="auto"
            borderWidth="025"
            borderColor="border"
            borderRadius="200"
          >
            {filteredItems.length === 0 ? (
              <Box padding="600">
                <EmptyState
                  heading={`No ${resourceType.toLowerCase()}s found`}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <Text tone="subdued">Try searching for a different keyword.</Text>
                </EmptyState>
              </Box>
            ) : (
              <div>
                {filteredItems.map((item, idx) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleToggleSelect(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleToggleSelect(item);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        cursor: "pointer",
                        borderBottom: idx < filteredItems.length - 1 ? "1px solid #f1f2f4" : "none",
                        backgroundColor: isSelected ? "#f0f7ff" : "transparent",
                        transition: "background-color 0.15s ease",
                      }}
                    >
                      {multiple ? (
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item)}
                        />
                      ) : (
                        <RadioButton
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item)}
                        />
                      )}

                      <Thumbnail
                        source={item.image || (resourceType === "Collection" ? CollectionIcon : ProductIcon)}
                        alt={item.title}
                        size="small"
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <InlineStack align="space-between" blockAlign="center">
                          <Text variant="bodyMd" fontWeight="semibold" truncate>
                            {item.title}
                          </Text>
                          {item.price && (
                            <Text variant="bodySm" fontWeight="medium">
                              {item.price}
                            </Text>
                          )}
                          {item.productsCount !== undefined && (
                            <Badge tone="info" size="small">
                              {item.productsCount} products
                            </Badge>
                          )}
                        </InlineStack>

                        <InlineStack gap="200" blockAlign="center">
                          {item.vendor && (
                            <Text variant="bodyXs" tone="subdued">
                              {item.vendor}
                            </Text>
                          )}
                          {item.status && (
                            <Badge tone="success" size="small">
                              {item.status.toLowerCase()}
                            </Badge>
                          )}
                        </InlineStack>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Box>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
