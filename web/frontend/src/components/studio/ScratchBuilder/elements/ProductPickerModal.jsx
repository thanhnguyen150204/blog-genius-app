import { useState, useEffect, useMemo } from "react";
import {
  Modal,
  TextField,
  Spinner,
  Text,
  Badge,
  Icon,
} from "@shopify/polaris";
import { SearchIcon, ProductIcon } from "@shopify/polaris-icons";

export function ProductPickerModal({
  open,
  onClose,
  onSelectProduct,
  onSelectProducts,
  multiSelect = false,
  selectedId = null,
  selectedIds = [],
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentSelectedId, setCurrentSelectedId] = useState(selectedId);
  const [currentSelectedIds, setCurrentSelectedIds] = useState(selectedIds || []);

  useEffect(() => {
    if (open) {
      setCurrentSelectedId(selectedId);
      setCurrentSelectedIds(selectedIds || []);
      fetchProducts();
    }
  }, [open, selectedId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/shop/products");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.error("Failed to load products from Shopify GraphQL:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase().trim();
    return products.filter((p) => p.title.toLowerCase().includes(q));
  }, [products, search]);

  const handleToggleProduct = (product) => {
    if (multiSelect) {
      if (currentSelectedIds.includes(product.id)) {
        setCurrentSelectedIds(currentSelectedIds.filter((id) => id !== product.id));
      } else {
        setCurrentSelectedIds([...currentSelectedIds, product.id]);
      }
    } else {
      setCurrentSelectedId(product.id);
    }
  };

  const handleConfirm = () => {
    if (multiSelect) {
      const chosen = products.filter((p) => currentSelectedIds.includes(p.id));
      if (onSelectProducts) onSelectProducts(chosen);
    } else {
      const chosen = products.find((p) => p.id === currentSelectedId);
      if (chosen && onSelectProduct) onSelectProduct(chosen);
    }
    onClose();
  };

  const hasSelection = multiSelect ? currentSelectedIds.length > 0 : Boolean(currentSelectedId);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={multiSelect ? "Select Products from Shopify Store" : "Select Product from Shopify Store"}
      primaryAction={{
        content: multiSelect ? `Select (${currentSelectedIds.length})` : "Select product",
        onAction: handleConfirm,
        disabled: !hasSelection,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <TextField
            prefix={<Icon source={SearchIcon} tone="subdued" />}
            placeholder="Search products by title..."
            value={search}
            onChange={setSearch}
            clearButton
            onClearButtonClick={() => setSearch("")}
            autoComplete="off"
          />

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <Spinner accessibilityLabel="Loading products from Shopify" size="large" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "36px 16px",
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              No products found matching &quot;{search}&quot;.
            </div>
          ) : (
            <div
              style={{
                maxHeight: "380px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                paddingRight: "4px",
              }}
            >
              {filteredProducts.map((p) => {
                const isSelected = multiSelect
                  ? currentSelectedIds.includes(p.id)
                  : currentSelectedId === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleToggleProduct(p)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: isSelected ? "1.5px solid #09090b" : "1px solid #e4e4e7",
                      backgroundColor: isSelected ? "#f4f4f5" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <input
                      type={multiSelect ? "checkbox" : "radio"}
                      checked={isSelected}
                      onChange={() => handleToggleProduct(p)}
                      style={{ cursor: "pointer", accentColor: "#09090b" }}
                    />

                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "6px",
                          objectFit: "cover",
                          border: "1px solid #e4e4e7",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "6px",
                          backgroundColor: "#f4f4f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon source={ProductIcon} tone="subdued" />
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text variant="bodySm" fontWeight="bold" truncate>
                        {p.title}
                      </Text>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#16a34a" }}>
                          {p.price}
                        </span>
                        {p.inventory > 0 ? (
                          <Badge tone="success" size="small">
                            In stock ({p.inventory})
                          </Badge>
                        ) : (
                          <Badge tone="attention" size="small">
                            Out of stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal.Section>
    </Modal>
  );
}
