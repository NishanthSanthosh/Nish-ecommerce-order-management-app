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

export default function OrderItemsEditor({
  products,
  items,
  setItems,
  originalItems = [],
}) {
  const getEmptyItem = () => ({ productId: "", quantity: 1 });

  const selectedProductIds = items.map((item) => item.productId).filter(Boolean);

  const getProduct = (productId) =>
    products.find((product) => product._id === productId);

  const getOriginalQuantity = (productId) =>
    originalItems.reduce((total, item) => {
      const originalProductId = String(item.productId?._id || item.productId);
      return originalProductId === productId ? total + Number(item.quantity) : total;
    }, 0);

  const getStockLimit = (productId) => {
    const product = getProduct(productId);
    if (!product) return 0;
    return Number(product.stock) + getOriginalQuantity(productId);
  };

  const availableProductCount = products.filter(
    (product) => Number(product.stock) + getOriginalQuantity(product._id) > 0,
  ).length;

  const updateItem = (index, updates) => {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item,
      ),
    );
  };

  const handleProductChange = (index, productId) => {
    updateItem(index, { productId, quantity: productId ? 1 : "" });
  };

  const handleQuantityChange = (index, quantityValue) => {
    const item = items[index];
    const stockLimit = getStockLimit(item.productId);
    let quantity = Number(quantityValue);

    if (!Number.isFinite(quantity)) quantity = 1;
    if (quantity < 1) quantity = 1;
    if (stockLimit > 0 && quantity > stockLimit) quantity = stockLimit;

    updateItem(index, { quantity });
  };

  const removeItem = (index) => {
    setItems((currentItems) =>
      currentItems.length === 1
        ? [getEmptyItem()]
        : currentItems.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const addItem = () => {
    setItems((currentItems) => [...currentItems, getEmptyItem()]);
  };

  const subtotal = items.reduce((total, item) => {
    const product = getProduct(item.productId);
    if (!product) return total;
    return total + Number(product.price) * Number(item.quantity || 0);
  }, 0);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle1" fontWeight={800}>
          Order Items
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add each product and quantity. Quantity cannot exceed available stock.
        </Typography>
      </Box>

      {items.map((item, index) => {
        const selectedProduct = getProduct(item.productId);
        const stockLimit = item.productId ? getStockLimit(item.productId) : 0;
        const lineTotal = selectedProduct
          ? Number(selectedProduct.price) * Number(item.quantity || 0)
          : 0;

        return (
          <Box
            key={`${item.productId || "new"}-${index}`}
            sx={{
              p: { xs: 1.5, sm: 2 },
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
                  label="Product"
                  value={item.productId}
                  onChange={(event) =>
                    handleProductChange(index, event.target.value)
                  }
                  fullWidth
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: { maxWidth: "calc(100vw - 32px)" },
                      },
                    },
                  }}
                  helperText={
                    selectedProduct
                      ? `${stockLimit} available at $${Number(
                          selectedProduct.price,
                        )} each`
                      : "Select product"
                  }
                >
                  {products.map((product) => {
                    const itemStockLimit = getStockLimit(product._id);
                    const isSelectedInAnotherRow =
                      selectedProductIds.includes(product._id) &&
                      product._id !== item.productId;

                    return (
                      <MenuItem
                        key={product._id}
                        value={product._id}
                        disabled={itemStockLimit < 1 || isSelectedInAnotherRow}
                      >
                        {product.product} - ${Number(product.price)} (
                        {itemStockLimit} in stock)
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  disabled={!item.productId}
                  onChange={(event) =>
                    handleQuantityChange(index, event.target.value)
                  }
                  inputProps={{ min: 1, max: stockLimit }}
                  fullWidth
                  sx={{ minWidth: { sm: 140 }, maxWidth: { sm: 160 } }}
                />

                <IconButton
                  color="error"
                  onClick={() => removeItem(index)}
                  sx={{
                    alignSelf: { xs: "flex-end", sm: "center" },
                    mt: { sm: 1 },
                  }}
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
        onClick={addItem}
        disabled={items.length >= availableProductCount}
        sx={{
          alignSelf: { xs: "stretch", sm: "flex-start" },
          borderRadius: 2,
          fontWeight: 800,
        }}
      >
        Add Item
      </Button>

      <Divider />

      <Typography variant="h6" fontWeight={900}>
        Order Total: ${subtotal.toFixed(2)}
      </Typography>
    </Stack>
  );
}
