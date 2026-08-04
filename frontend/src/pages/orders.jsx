import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OrderTable from "../components/table";
import OrderForm from "../components/form";
import OrderModal from "../components/modal";
import OrderItemsEditor from "../components/orderItemsEditor";
import useModal from "../hooks/useProductModal";
import orderFields from "../data/orderFormData";
import { orderAccessors, orderHeaders } from "../data/orderTableData";
import { getProducts } from "../services/productService";
import { getUsers } from "../services/userService";
import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} from "../services/orderService";

const getDefaultOrderItems = () => [{ productId: "", quantity: 1 }];

export default function Orders() {
  const queryClient = useQueryClient();
  const {
    open,
    selectedItem: selectedOrder,
    openModal,
    closeModal,
  } = useModal();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });
  const [orderItems, setOrderItems] = useState(getDefaultOrderItems);

  const defaultOrderValues = useMemo(
    () => ({
      customerId: "",
      paymentStatus: "Pending",
      orderStatus: "Pending",
    }),
    [],
  );

  useEffect(() => {
    if (selectedOrder) {
      reset({
        ...selectedOrder,
        customerId: selectedOrder.customerId
          ? String(selectedOrder.customerId?._id || selectedOrder.customerId)
          : "",
      });
      setOrderItems(
        selectedOrder.items?.length
          ? selectedOrder.items.map((item) => ({
              productId: String(item.productId?._id || item.productId),
              quantity: item.quantity,
            }))
          : getDefaultOrderItems(),
      );
    } else {
      reset(defaultOrderValues);
      setOrderItems(getDefaultOrderItems());
    }
  }, [defaultOrderValues, selectedOrder, reset]);

  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await getOrders();
      return response?.data?.orders || [];
    },
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts();
      return response?.data?.products || [];
    },
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsers();
      return response?.data?.users || [];
    },
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  const customerOptions = useMemo(() => {
    const options = (users || []).map((user) => ({
      label: `${user.name} (${user.phone})`,
      value: user._id,
    }));

    const selectedCustomerId = selectedOrder?.customerId
      ? String(selectedOrder.customerId?._id || selectedOrder.customerId)
      : "";

    if (
      selectedCustomerId &&
      !options.some((option) => option.value === selectedCustomerId)
    ) {
      options.push({
        label: selectedOrder.customerName,
        value: selectedCustomerId,
      });
    }

    return options;
  }, [selectedOrder, users]);

  const orderFieldsWithUsers = useMemo(
    () =>
      orderFields.map((field) =>
        field.name === "customerId"
          ? {
              ...field,
              options: customerOptions,
              disabled: customerOptions.length === 0,
              helperText:
                customerOptions.length === 0
                  ? "Create a user before adding orders."
                  : undefined,
            }
          : field,
      ),
    [customerOptions],
  );

  const ordersForTable = useMemo(
    () =>
      (orders || []).map((order) => ({
        ...order,
        couponCode: order.couponCode || "-",
        subtotal: order.subtotal !== undefined ? `$${order.subtotal}` : "-",
        discountAmount:
          order.discountAmount !== undefined ? `$${order.discountAmount}` : "$0",
        totalAmount:
          order.totalAmount !== undefined ? `$${order.totalAmount}` : "-",
        itemsSummary: order.items?.length
          ? order.items
              .map((item) => `${item.productName} x${item.quantity}`)
              .join(", ")
          : order.product
            ? `${order.product} x${order.quantity}`
            : "-",
      })),
    [orders],
  );

  const addOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create order");
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => updateOrder(id, data),
    onSuccess: () => {
      toast.success("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update order");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id) => deleteOrder(id),
    onSuccess: () => {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete order");
    },
  });

  if (isOrdersLoading || isProductsLoading || isUsersLoading) {
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

  if (isOrdersError || isProductsError || isUsersError) {
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
        <Typography color="error">
          Error: {ordersError?.message || productsError?.message || usersError?.message}
        </Typography>
      </Paper>
    );
  }

  const handleClose = () => closeModal();

  const handleEdit = (row) => {
    openModal(row);
  };

  const handleDelete = (row) => {
    deleteOrderMutation.mutate(row._id);
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

  const onSubmit = async (formData) => {
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
        await updateOrderMutation.mutateAsync({
          id: selectedOrder._id,
          data: orderPayload,
        });
      } else {
        await addOrderMutation.mutateAsync(orderPayload);
      }
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
          background:
            "linear-gradient(135deg, rgba(20, 184, 166, 0.08), rgba(255, 255, 255, 0.95))",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="overline" color="text.secondary" fontWeight={800}>
              Fulfillment
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
              Order Management
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Track customer grocery orders, delivery details, payment status,
              and fulfillment progress.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              openModal();
              reset(defaultOrderValues);
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

      <OrderTable
        headers={orderHeaders}
        accessors={orderAccessors}
        data={ordersForTable}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <OrderModal
        open={open}
        onClose={handleClose}
        title={selectedOrder ? "Edit Order" : "Add Order"}
      >
        <OrderForm
          fields={orderFieldsWithUsers}
          register={register}
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel={selectedOrder ? "Update Order" : "Add Order"}
        >
          <OrderItemsEditor
            products={products || []}
            items={orderItems}
            setItems={setOrderItems}
            originalItems={selectedOrder?.items || []}
          />
        </OrderForm>
      </OrderModal>
    </Stack>
  );
}
