import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CouponTable from "../components/table";
import CouponForm from "../components/form";
import CouponModal from "../components/modal";
import useModal from "../hooks/useProductModal";
import couponFields from "../data/couponFormData";
import { couponAccessors, couponHeaders } from "../data/couponTableData";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "../services/couponService";

const formatDateForInput = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
};

const formatDateForTable = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const getNextMonthDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split("T")[0];
};

export default function Coupons() {
  const queryClient = useQueryClient();
  const {
    open,
    selectedItem: selectedCoupon,
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

  const defaultCouponValues = useMemo(
    () => ({
      discountType: "Percentage",
      minOrderAmount: 0,
      usageLimit: 100,
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: getNextMonthDate(),
      status: "Active",
    }),
    [],
  );

  useEffect(() => {
    if (selectedCoupon) {
      reset({
        ...selectedCoupon,
        startDate: formatDateForInput(selectedCoupon.startDate),
        expiryDate: formatDateForInput(selectedCoupon.expiryDate),
      });
    } else {
      reset(defaultCouponValues);
    }
  }, [defaultCouponValues, selectedCoupon, reset]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const response = await getCoupons();
      return response?.data?.coupons || [];
    },
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  const couponsForTable = useMemo(
    () =>
      (data || []).map((coupon) => ({
        ...coupon,
        discountSummary:
          coupon.discountType === "Percentage"
            ? `${coupon.discountValue}%`
            : `$${coupon.discountValue}`,
        usageSummary: `${coupon.usedCount || 0}/${coupon.usageLimit}`,
        dateRange: `${formatDateForTable(coupon.startDate)} - ${formatDateForTable(
          coupon.expiryDate,
        )}`,
      })),
    [data],
  );

  const addCouponMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      toast.success("Coupon created successfully");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create coupon");
    },
  });

  const updateCouponMutation = useMutation({
    mutationFn: ({ id, data }) => updateCoupon(id, data),
    onSuccess: () => {
      toast.success("Coupon updated successfully");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update coupon");
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (id) => deleteCoupon(id),
    onSuccess: () => {
      toast.success("Coupon deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete coupon");
    },
  });

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
        <Typography color="text.secondary">Loading coupons...</Typography>
      </Paper>
    );
  }

  if (isError) {
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
    openModal(row);
  };

  const handleDelete = (row) => {
    deleteCouponMutation.mutate(row._id);
  };

  const onSubmit = async (formData) => {
    try {
      if (new Date(formData.expiryDate) < new Date(formData.startDate)) {
        toast.error("Expiry date must be after start date");
        return;
      }

      if (
        formData.discountType === "Percentage" &&
        Number(formData.discountValue) > 100
      ) {
        toast.error("Percentage discount cannot exceed 100");
        return;
      }

      const couponPayload = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount),
        usageLimit: Number(formData.usageLimit),
      };

      if (selectedCoupon) {
        updateCouponMutation.mutate({
          id: selectedCoupon._id,
          data: couponPayload,
        });
      } else {
        addCouponMutation.mutate(couponPayload);
      }
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
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
              Promotions
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
              Coupon Campaigns
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Create discount codes with limits, date windows, and active status
              for grocery promotions.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              openModal();
              reset(defaultCouponValues);
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
            Add Coupon
          </Button>
        </Stack>
      </Paper>

      <CouponTable
        headers={couponHeaders}
        accessors={couponAccessors}
        data={couponsForTable}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CouponModal
        open={open}
        onClose={handleClose}
        title={selectedCoupon ? "Edit Coupon" : "Add Coupon"}
      >
        <CouponForm
          fields={couponFields}
          register={register}
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel={selectedCoupon ? "Update Coupon" : "Add Coupon"}
        />
      </CouponModal>
    </Stack>
  );
}
