import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function LineItemsEditor({
  catalogItems,
  lineItems,
  setLineItems,
  originalLineItems = [],
  itemIdKey = "itemId",
  title = "Line Items",
  description = "Add each item and quantity.",
  selectLabel = "Item",
  addButtonLabel = "Add Item",
  totalLabel = "Total",
  getCatalogItemId,
  getCatalogItemName,
  getCatalogItemPrice,
  getCatalogItemStock,
  getOriginalItemId = (item) => item[itemIdKey],
  getOriginalItemQuantity = (item) => item.quantity,
}) {
  const getEmptyItem = () => ({ [itemIdKey]: "", quantity: 1 });

  const getLineItemId = (item) => item[itemIdKey];

  const getCatalogItem = (itemId) =>
    catalogItems.find((catalogItem) => getCatalogItemId(catalogItem) === itemId);

  const getOriginalQuantity = (itemId) =>
    originalLineItems.reduce((total, item) => {
      const originalItemId = String(getOriginalItemId(item));
      return originalItemId === itemId
        ? total + Number(getOriginalItemQuantity(item))
        : total;
    }, 0);

  const getStockLimit = (itemId) => {
    const catalogItem = getCatalogItem(itemId);
    if (!catalogItem) return 0;
    return Number(getCatalogItemStock(catalogItem)) + getOriginalQuantity(itemId);
  };

  const selectedItemIds = lineItems.map(getLineItemId).filter(Boolean);

  const availableItemCount = catalogItems.filter(
    (catalogItem) =>
      Number(getCatalogItemStock(catalogItem)) +
        getOriginalQuantity(getCatalogItemId(catalogItem)) >
      0,
  ).length;

  const updateLineItem = (index, updates) => {
    setLineItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item,
      ),
    );
  };

  const handleItemChange = (index, itemId) => {
    updateLineItem(index, { [itemIdKey]: itemId, quantity: itemId ? 1 : "" });
  };

  const handleQuantityChange = (index, quantityValue) => {
    const item = lineItems[index];
    const stockLimit = getStockLimit(getLineItemId(item));
    let quantity = Number(quantityValue);

    if (!Number.isFinite(quantity)) quantity = 1;
    if (quantity < 1) quantity = 1;
    if (stockLimit > 0 && quantity > stockLimit) quantity = stockLimit;

    updateLineItem(index, { quantity });
  };

  const removeLineItem = (index) => {
    setLineItems((currentItems) =>
      currentItems.length === 1
        ? [getEmptyItem()]
        : currentItems.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const addLineItem = () => {
    setLineItems((currentItems) => [...currentItems, getEmptyItem()]);
  };

  const subtotal = lineItems.reduce((total, item) => {
    const catalogItem = getCatalogItem(getLineItemId(item));
    if (!catalogItem) return total;
    return total + Number(getCatalogItemPrice(catalogItem)) * Number(item.quantity || 0);
  }, 0);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle1" fontWeight={800}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>

      {lineItems.map((item, index) => {
        const selectedItemId = getLineItemId(item);
        const selectedCatalogItem = getCatalogItem(selectedItemId);
        const stockLimit = selectedItemId ? getStockLimit(selectedItemId) : 0;
        const lineTotal = selectedCatalogItem
          ? Number(getCatalogItemPrice(selectedCatalogItem)) *
            Number(item.quantity || 0)
          : 0;

        return (
          <Box
            key={`${selectedItemId || "new"}-${index}`}
            sx={{
              p: 2,
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              bgcolor: "#f8fafc",
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "flex-start" }}
              >
                <TextField
                  select
                  label={selectLabel}
                  value={selectedItemId}
                  onChange={(event) => handleItemChange(index, event.target.value)}
                  fullWidth
                  helperText={
                    selectedCatalogItem
                      ? `${stockLimit} available at $${getCatalogItemPrice(
                          selectedCatalogItem,
                        )} each`
                      : `Select ${selectLabel.toLowerCase()}`
                  }
                >
                  {catalogItems.map((catalogItem) => {
                    const catalogItemId = getCatalogItemId(catalogItem);
                    const itemStockLimit = getStockLimit(catalogItemId);
                    const isSelectedInAnotherRow =
                      selectedItemIds.includes(catalogItemId) &&
                      catalogItemId !== selectedItemId;

                    return (
                      <MenuItem
                        key={catalogItemId}
                        value={catalogItemId}
                        disabled={itemStockLimit < 1 || isSelectedInAnotherRow}
                      >
                        {getCatalogItemName(catalogItem)} - $
                        {getCatalogItemPrice(catalogItem)} ({itemStockLimit} in
                        stock)
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  disabled={!selectedItemId}
                  onChange={(event) =>
                    handleQuantityChange(index, event.target.value)
                  }
                  inputProps={{ min: 1, max: stockLimit }}
                  sx={{ minWidth: { sm: 140 } }}
                />

                <IconButton
                  color="error"
                  onClick={() => removeLineItem(index)}
                  sx={{ mt: { sm: 1 } }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>

              <Typography variant="body2" fontWeight={700}>
                Line total: ${lineTotal.toFixed(2)}
              </Typography>
            </Stack>
          </Box>
        );
      })}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addLineItem}
        disabled={lineItems.length >= availableItemCount}
        sx={{ alignSelf: "flex-start", borderRadius: 2, fontWeight: 800 }}
      >
        {addButtonLabel}
      </Button>

      <Divider />

      <Typography variant="h6" fontWeight={900}>
        {totalLabel}: ${subtotal.toFixed(2)}
      </Typography>
    </Stack>
  );
}
