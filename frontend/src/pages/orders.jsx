import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderModal from "../components/modal";
import OrderItemsEditor from "../components/orderItemsEditor";
import useModal from "../hooks/useModal";
import { getProducts } from "../services/productService";
import { getUsers } from "../services/userService";
import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} from "../services/orderService";

const getDefaultOrderItems = () => [{ productId: "", quantity: 1 }];

const emptyOrderForm = {
  customerId: "",
  address: "",
  couponCode: "",
  paymentMethod: "",
  paymentStatus: "Pending",
  orderStatus: "Pending",
};

const getOrderItemsFromOrder = (order) =>
  order.items?.length
    ? order.items.map((item) => ({
        productId: String(item.productId?._id || item.productId),
        quantity: item.quantity,
      }))
    : getDefaultOrderItems();

export default function Orders() {
  const {
    open,
    selectedItem: selectedOrder,
    openModal,
    closeModal,
  } = useModal();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [formData, setFormData] = useState(emptyOrderForm);
  const [formErrors, setFormErrors] = useState({});
  const [orderItems, setOrderItems] = useState(getDefaultOrderItems);

  useEffect(() => {
    let isCancelled = false;

    const loadPageData = async () => {
      try {
        const [ordersResponse, productsResponse, usersResponse] =
          await Promise.all([getOrders(), getProducts(), getUsers()]);

        if (!isCancelled) {
          setOrders(ordersResponse?.data?.orders || []);
          setProducts(productsResponse?.data?.products || []);
          setUsers(usersResponse?.data?.users || []);
          setError(null);
        }
      } catch (error) {
        if (!isCancelled) {
          setError(error);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadPageData();

    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  const customerOptions = (users || []).map((user) => ({
    label: `${user.name} (${user.phone})`,
    value: user._id,
  }));

  const selectedCustomerId = selectedOrder?.customerId
    ? String(selectedOrder.customerId?._id || selectedOrder.customerId)
    : "";

  if (
    selectedCustomerId &&
    !customerOptions.some((option) => option.value === selectedCustomerId)
  ) {
    customerOptions.push({
      label: selectedOrder.customerName,
      value: selectedCustomerId,
    });
  }

  const ordersForTable = (orders || []).map((order) => ({
    ...order,
    couponCode: order.couponCode || "-",
    subtotal: order.subtotal !== undefined ? `$${order.subtotal}` : "-",
    discountAmount:
      order.discountAmount !== undefined ? `$${order.discountAmount}` : "$0",
    totalAmount: order.totalAmount !== undefined ? `$${order.totalAmount}` : "-",
    itemsSummary: order.items?.length
      ? order.items.map((item) => `${item.productName} x${item.quantity}`).join(", ")
      : order.product
        ? `${order.product} x${order.quantity}`
        : "-",
  }));

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "1px solid #e5e7eb",
          borderRadius: 4,
        }}
      >
        <Typography color="text.secondary">Loading orders...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "1px solid #fee2e2",
          borderRadius: 4,
          bgcolor: "#fef2f2",
        }}
      >
        <Typography color="error">Error: {error.message}</Typography>
      </Paper>
    );
  }

  const handleClose = () => closeModal();

  const handleEdit = (row) => {
    setFormData({
      customerId: row.customerId ? String(row.customerId?._id || row.customerId) : "",
      address: row.address || "",
      couponCode: row.couponCode === "-" ? "" : row.couponCode || "",
      paymentMethod: row.paymentMethod || "",
      paymentStatus: row.paymentStatus || "Pending",
      orderStatus: row.orderStatus || "Pending",
    });
    setFormErrors({});
    setOrderItems(getOrderItemsFromOrder(row));
    openModal(row);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.customerName}`)) {
      deleteOrder(row._id)
        .then(() => {
          toast.success("Order deleted successfully");
          setReloadKey((currentKey) => currentKey + 1);
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete order");
        });
    }
  };

  const getOriginalQuantity = (productId) =>
    (selectedOrder?.items || []).reduce((total, item) => {
      const originalProductId = String(item.productId?._id || item.productId);
      return originalProductId === productId ? total + Number(item.quantity) : total;
    }, 0);

  const getAvailableStock = (productId) => {
    const product = (products || []).find((item) => item._id === productId);
    if (!product) return 0;
    return Number(product.stock) + getOriginalQuantity(productId);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setFormErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.customerId) nextErrors.customerId = "Please select a customer";

    if (!formData.address.trim()) {
      nextErrors.address = "Delivery address is required";
    } else if (formData.address.trim().length < 8) {
      nextErrors.address = "Enter a complete address";
    } else if (formData.address.trim().length > 200) {
      nextErrors.address = "Maximum 200 characters";
    }

    if (
      formData.couponCode &&
      !/^[a-zA-Z0-9_-]*$/.test(formData.couponCode)
    ) {
      nextErrors.couponCode = "Only letters, numbers, underscores, and dashes allowed";
    }

    if (!formData.paymentMethod) {
      nextErrors.paymentMethod = "Please select a payment method";
    }
    if (!formData.paymentStatus) {
      nextErrors.paymentStatus = "Please select a payment status";
    }
    if (!formData.orderStatus) {
      nextErrors.orderStatus = "Please select an order status";
    }

    return nextErrors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    try {
      const selectedItems = orderItems.filter((item) => item.productId);

      if (selectedItems.length === 0) {
        toast.error("Please add at least one order item");
        return;
      }

      const payloadItems = [];

      for (const item of selectedItems) {
        const quantity = Number(item.quantity);
        const availableStock = getAvailableStock(item.productId);

        if (!Number.isInteger(quantity) || quantity < 1) {
          toast.error("Each item quantity must be a whole number");
          return;
        }

        if (quantity > availableStock) {
          toast.error("Order quantity exceeds available product stock");
          return;
        }

        payloadItems.push({
          productId: item.productId,
          quantity,
        });
      }

      const orderPayload = {
        ...formData,
        couponCode: formData.couponCode?.trim().toUpperCase(),
        items: payloadItems,
      };

      if (selectedOrder) {
        await updateOrder(selectedOrder._id, orderPayload);
        toast.success("Order updated successfully");
      } else {
        await createOrder(orderPayload);
        toast.success("Order created successfully");
      }
      setReloadKey((currentKey) => currentKey + 1);
      handleClose();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.error("Submission failed:", error);
    }
  };

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          border: "1px solid #e5e7eb",
          borderRadius: 4,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Orders
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Create and track customer orders.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              openModal();
              setFormData(emptyOrderForm);
              setFormErrors({});
              setOrderItems(getDefaultOrderItems());
            }}
            sx={{
              alignSelf: { xs: "stretch", sm: "center" },
              bgcolor: "#0f766e",
              borderRadius: 2,
              px: 3,
              py: 1.25,
              fontWeight: 800,
              boxShadow: "0 12px 24px rgba(15, 118, 110, 0.2)",
              "&:hover": { bgcolor: "#115e59" },
            }}
          >
            Add Order
          </Button>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
        }}
      >
        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table
            sx={{
              minWidth: { xs: 1320, md: 1200 },
              "& th, & td": {
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1.25, sm: 1.75 },
                whiteSpace: "nowrap",
              },
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                {[
                  "Order ID",
                  "Customer",
                  "Phone",
                  "Address",
                  "Items",
                  "Coupon",
                  "Subtotal",
                  "Discount",
                  "Total",
                  "Payment Method",
                  "Payment Status",
                  "Order Status",
                  "Actions",
                ].map((header) => (
                  <TableCell key={header} sx={{ fontSize: 12, fontWeight: 800 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersForTable.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13} sx={{ py: 6, textAlign: "center" }}>
                    <Typography color="text.secondary">No orders found.</Typography>
                  </TableCell>
                </TableRow>
              )}

              {ordersForTable.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.itemsSummary}</TableCell>
                  <TableCell>{order.couponCode}</TableCell>
                  <TableCell>{order.subtotal}</TableCell>
                  <TableCell>{order.discountAmount}</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{order.paymentStatus}</TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(order)}
                      sx={{ bgcolor: "#eff6ff", mr: 0.75 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(order)}
                      sx={{ bgcolor: "#fef2f2" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <OrderModal
        open={open}
        onClose={handleClose}
        title={selectedOrder ? "Edit Order" : "Add Order"}
      >
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            select
            name="customerId"
            value={formData.customerId}
            onChange={handleInputChange}
            fullWidth
            label="Customer"
            disabled={customerOptions.length === 0}
            error={!!formErrors.customerId}
            helperText={
              formErrors.customerId ||
              (customerOptions.length === 0
                ? "Create a user before adding orders."
                : undefined)
            }
          >
            {customerOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Delivery Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Street, city, state, zip code"
            multiline
            rows={3}
            fullWidth
            error={!!formErrors.address}
            helperText={formErrors.address}
          />

          <TextField
            label="Coupon Code"
            name="couponCode"
            value={formData.couponCode}
            onChange={handleInputChange}
            placeholder="e.g., SAVE10"
            fullWidth
            error={!!formErrors.couponCode}
            helperText={
              formErrors.couponCode ||
              "Optional. Discount is validated and applied by the backend."
            }
          />

          <TextField
            select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            fullWidth
            label="Payment Method"
            error={!!formErrors.paymentMethod}
            helperText={formErrors.paymentMethod}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
          </TextField>

          <TextField
            select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleInputChange}
            fullWidth
            label="Payment Status"
            error={!!formErrors.paymentStatus}
            helperText={formErrors.paymentStatus}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </TextField>

          <TextField
            select
            name="orderStatus"
            value={formData.orderStatus}
            onChange={handleInputChange}
            fullWidth
            label="Order Status"
            error={!!formErrors.orderStatus}
            helperText={formErrors.orderStatus}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Packed">Packed</MenuItem>
            <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>

          <OrderItemsEditor
            products={products || []}
            items={orderItems}
            setItems={setOrderItems}
            originalItems={selectedOrder?.items || []}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              alignSelf: { xs: "stretch", sm: "flex-start" },
              bgcolor: "#0f766e",
              fontWeight: 800,
              "&:hover": { bgcolor: "#115e59" },
            }}
          >
            {selectedOrder ? "Update Order" : "Add Order"}
          </Button>
        </Box>
      </OrderModal>
    </Stack>
  );
}
