import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { getOrders } from "../services/orderService";
import { getUsers } from "../services/userService";
import { getCoupons } from "../services/couponService";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const isOpenOrder = (order) =>
  !["Delivered", "Cancelled"].includes(order.orderStatus);

const isActiveCoupon = (coupon) => {
  const now = new Date();
  return (
    coupon.status === "Active" &&
    new Date(coupon.startDate) <= now &&
    now <= new Date(coupon.expiryDate) &&
    Number(coupon.usedCount || 0) < Number(coupon.usageLimit || 0)
  );
};

const StatCard = ({ label, value, helper }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      border: "1px solid #e5e7eb",
      borderRadius: 4,
      height: "100%",
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {helper}
    </Typography>
  </Paper>
);

export default function Dashboard() {
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts();
      return response?.data?.products || [];
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response?.data?.categories || [];
    },
  });

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await getOrders();
      return response?.data?.orders || [];
    },
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsers();
      return response?.data?.users || [];
    },
  });

  const couponsQuery = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const response = await getCoupons();
      return response?.data?.coupons || [];
    },
  });

  const isLoading =
    productsQuery.isLoading ||
    categoriesQuery.isLoading ||
    ordersQuery.isLoading ||
    usersQuery.isLoading ||
    couponsQuery.isLoading;

  const error =
    productsQuery.error ||
    categoriesQuery.error ||
    ordersQuery.error ||
    usersQuery.error ||
    couponsQuery.error;

  const metrics = useMemo(() => {
    const products = productsQuery.data || [];
    const categories = categoriesQuery.data || [];
    const orders = ordersQuery.data || [];
    const users = usersQuery.data || [];
    const coupons = couponsQuery.data || [];

    const totalStock = products.reduce(
      (total, product) => total + Number(product.stock || 0),
      0,
    );
    const lowStockProducts = products.filter(
      (product) => Number(product.stock || 0) <= 5,
    );
    const paidRevenue = orders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce((total, order) => total + Number(order.totalAmount || 0), 0);
    const pendingPaymentAmount = orders
      .filter((order) => order.paymentStatus === "Pending")
      .reduce((total, order) => total + Number(order.totalAmount || 0), 0);
    const totalOrderValue = orders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0,
    );
    const openOrders = orders.filter(isOpenOrder);
    const customers = users.filter((user) => user.role === "Customer");
    const admins = users.filter((user) => user.role === "Admin");
    const activeCoupons = coupons.filter(isActiveCoupon);
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    return {
      products,
      categories,
      orders,
      users,
      coupons,
      totalStock,
      lowStockProducts,
      paidRevenue,
      pendingPaymentAmount,
      totalOrderValue,
      openOrders,
      customers,
      admins,
      activeCoupons,
      recentOrders,
    };
  }, [
    categoriesQuery.data,
    couponsQuery.data,
    ordersQuery.data,
    productsQuery.data,
    usersQuery.data,
  ]);

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 4, border: "1px solid #e5e7eb", borderRadius: 4 }}
      >
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Loading dashboard metrics...
        </Typography>
        <LinearProgress />
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

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          border: "1px solid #e5e7eb",
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(20, 184, 166, 0.08), rgba(255, 255, 255, 0.95))",
        }}
      >
        <Typography variant="overline" color="text.secondary" fontWeight={800}>
          Overview
        </Typography>
        <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
          Store Performance
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 720 }}>
          Live operational metrics from products, orders, users, categories, and
          coupons.
        </Typography>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.5,
        }}
      >
        <StatCard
          label="Open Orders"
          value={metrics.openOrders.length}
          helper={`${metrics.orders.length} total orders`}
        />
        <StatCard
          label="Paid Revenue"
          value={formatCurrency(metrics.paidRevenue)}
          helper={`${formatCurrency(metrics.totalOrderValue)} total order value`}
        />
        <StatCard
          label="Products"
          value={metrics.products.length}
          helper={`${metrics.totalStock} units in stock`}
        />
        <StatCard
          label="Customers"
          value={metrics.customers.length}
          helper={`${metrics.admins.length} admin users`}
        />
        <StatCard
          label="Categories"
          value={metrics.categories.length}
          helper="Product groupings"
        />
        <StatCard
          label="Active Coupons"
          value={metrics.activeCoupons.length}
          helper={`${metrics.coupons.length} total coupons`}
        />
        <StatCard
          label="Low Stock"
          value={metrics.lowStockProducts.length}
          helper="Products at 5 units or below"
        />
        <StatCard
          label="Pending Payments"
          value={formatCurrency(metrics.pendingPaymentAmount)}
          helper="Not counted as revenue"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" },
          gap: 2.5,
        }}
      >
        <Paper
          elevation={0}
          sx={{ p: 2.5, border: "1px solid #e5e7eb", borderRadius: 4 }}
        >
          <Typography variant="h6" fontWeight={900}>
            Recent Orders
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {metrics.recentOrders.length === 0 && (
              <Typography color="text.secondary">No orders yet.</Typography>
            )}
            {metrics.recentOrders.map((order) => (
              <Box
                key={order._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                }}
              >
                <Box>
                  <Typography fontWeight={800}>{order.customerName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.items
                      ?.map((item) => `${item.productName} x${item.quantity}`)
                      .join(", ") || "No items"}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography fontWeight={900}>
                    {formatCurrency(order.totalAmount)}
                  </Typography>
                  <Chip
                    size="small"
                    label={order.orderStatus}
                    sx={{ mt: 0.5, fontWeight: 700 }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 2.5, border: "1px solid #e5e7eb", borderRadius: 4 }}
        >
          <Typography variant="h6" fontWeight={900}>
            Low Stock Alerts
          </Typography>
          <Stack spacing={1.25} sx={{ mt: 2 }}>
            {metrics.lowStockProducts.length === 0 && (
              <Typography color="text.secondary">
                All products have healthy stock.
              </Typography>
            )}
            {metrics.lowStockProducts.slice(0, 6).map((product) => (
              <Box
                key={product._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#fff7ed",
                }}
              >
                <Typography fontWeight={800}>{product.product}</Typography>
                <Chip
                  size="small"
                  color={Number(product.stock) === 0 ? "error" : "warning"}
                  label={`${product.stock} left`}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
