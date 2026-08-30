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
import CouponModal from "../components/modal";
import useModal from "../hooks/useModal";
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

const getDefaultCouponValues = () => ({
  discountType: "Percentage",
  minOrderAmount: 0,
  usageLimit: 100,
  startDate: new Date().toISOString().split("T")[0],
  expiryDate: getNextMonthDate(),
  status: "Active",
});

export default function Coupons() {
  const {
    open,
    selectedItem: selectedCoupon,
    openModal,
    closeModal,
  } = useModal();
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(getDefaultCouponValues);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    let isCancelled = false;

    const loadCoupons = async () => {
      try {
        const response = await getCoupons();

        if (!isCancelled) {
          setCoupons(response?.data?.coupons || []);
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

    loadCoupons();

    return () => {
      isCancelled = true;
    };
  }, []);

  const couponsForTable = coupons.map((coupon) => ({
    ...coupon,
    discountSummary:
      coupon.discountType === "Percentage"
        ? `${coupon.discountValue}%`
        : `$${coupon.discountValue}`,
    usageSummary: `${coupon.usedCount || 0}/${coupon.usageLimit}`,
    dateRange: `${formatDateForTable(coupon.startDate)} - ${formatDateForTable(
      coupon.expiryDate,
    )}`,
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
        <Typography color="text.secondary">Loading coupons...</Typography>
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
      ...row,
      startDate: formatDateForInput(row.startDate),
      expiryDate: formatDateForInput(row.expiryDate),
    });
    setFormErrors({});
    openModal(row);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.code}`)) {
      deleteCoupon(row._id)
        .then(() => {
          setCoupons((currentCoupons) =>
            currentCoupons.filter((coupon) => coupon._id !== row._id),
          );
          toast.success("Coupon deleted successfully");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete coupon");
        });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setFormErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const discountValue = Number(formData.discountValue);
    const minOrderAmount = Number(formData.minOrderAmount);
    const usageLimit = Number(formData.usageLimit);

    if (!formData.code.trim()) nextErrors.code = "Coupon code is required";
    else if (formData.code.trim().length < 3) {
      nextErrors.code = "Minimum 3 characters";
    } else if (formData.code.trim().length > 20) {
      nextErrors.code = "Maximum 20 characters";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.code)) {
      nextErrors.code = "Only letters, numbers, underscores, and dashes allowed";
    }

    if (formData.description?.length > 120) {
      nextErrors.description = "Maximum 120 characters";
    }

    if (!formData.discountType) {
      nextErrors.discountType = "Please select a discount type";
    }

    if (formData.discountValue === "" || Number.isNaN(discountValue)) {
      nextErrors.discountValue = "Discount value is required";
    } else if (discountValue <= 0) {
      nextErrors.discountValue = "Discount must be greater than 0";
    } else if (
      formData.discountType === "Percentage" &&
      discountValue > 100
    ) {
      nextErrors.discountValue = "Percentage discount cannot exceed 100";
    }

    if (formData.minOrderAmount === "" || Number.isNaN(minOrderAmount)) {
      nextErrors.minOrderAmount = "Minimum order amount is required";
    } else if (minOrderAmount < 0) {
      nextErrors.minOrderAmount = "Minimum order amount cannot be negative";
    }

    if (formData.usageLimit === "" || Number.isNaN(usageLimit)) {
      nextErrors.usageLimit = "Usage limit is required";
    } else if (usageLimit < 1) {
      nextErrors.usageLimit = "Usage limit must be at least 1";
    } else if (!Number.isInteger(usageLimit)) {
      nextErrors.usageLimit = "Usage limit must be a whole number";
    }

    if (!formData.startDate) nextErrors.startDate = "Start date is required";
    if (!formData.expiryDate) nextErrors.expiryDate = "Expiry date is required";
    if (
      formData.startDate &&
      formData.expiryDate &&
      new Date(formData.expiryDate) < new Date(formData.startDate)
    ) {
      nextErrors.expiryDate = "Expiry date must be after start date";
    }

    if (!formData.status) nextErrors.status = "Please select a status";

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
      const couponPayload = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount),
        usageLimit: Number(formData.usageLimit),
      };

      if (selectedCoupon) {
        const response = await updateCoupon(selectedCoupon._id, couponPayload);
        const updatedCoupon = response?.data?.coupon;

        setCoupons((currentCoupons) =>
          currentCoupons.map((coupon) =>
            coupon._id === selectedCoupon._id ? updatedCoupon : coupon,
          ),
        );
        toast.success("Coupon updated successfully");
      } else {
        const response = await createCoupon(couponPayload);
        const newCoupon = response?.data?.coupon;

        setCoupons((currentCoupons) => [...currentCoupons, newCoupon]);
        toast.success("Coupon created successfully");
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
              Coupons
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Create and manage discount codes.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              openModal();
              setFormData(getDefaultCouponValues());
              setFormErrors({});
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
              minWidth: { xs: 920, md: 860 },
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
                  "Coupon ID",
                  "Code",
                  "Discount",
                  "Min Order",
                  "Usage",
                  "Date Range",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <TableCell key={header} sx={{ fontSize: 12, fontWeight: 800 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {couponsForTable.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 6, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No coupons found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {couponsForTable.map((coupon) => (
                <TableRow key={coupon._id} hover>
                  <TableCell>{coupon._id}</TableCell>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.discountSummary}</TableCell>
                  <TableCell>{coupon.minOrderAmount}</TableCell>
                  <TableCell>{coupon.usageSummary}</TableCell>
                  <TableCell>{coupon.dateRange}</TableCell>
                  <TableCell>{coupon.status}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(coupon)}
                      sx={{ bgcolor: "#eff6ff", mr: 0.75 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(coupon)}
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

      <CouponModal
        open={open}
        onClose={handleClose}
        title={selectedCoupon ? "Edit Coupon" : "Add Coupon"}
      >
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Coupon Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="e.g., SAVE10"
            fullWidth
            error={!!formErrors.code}
            helperText={formErrors.code}
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="e.g., 10% off grocery orders"
            multiline
            rows={2}
            fullWidth
            error={!!formErrors.description}
            helperText={formErrors.description}
          />

          <TextField
            select
            name="discountType"
            value={formData.discountType}
            onChange={handleInputChange}
            fullWidth
            label="Discount Type"
            error={!!formErrors.discountType}
            helperText={formErrors.discountType}
          >
            <MenuItem value="Percentage">Percentage</MenuItem>
            <MenuItem value="Fixed">Fixed</MenuItem>
          </TextField>

          <TextField
            label="Discount Value"
            name="discountValue"
            value={formData.discountValue || ""}
            onChange={handleInputChange}
            type="number"
            inputProps={{ step: "0.01", min: "0.01" }}
            fullWidth
            error={!!formErrors.discountValue}
            helperText={formErrors.discountValue}
          />

          <TextField
            label="Minimum Order Amount"
            name="minOrderAmount"
            value={formData.minOrderAmount}
            onChange={handleInputChange}
            type="number"
            inputProps={{ step: "0.01", min: "0" }}
            fullWidth
            error={!!formErrors.minOrderAmount}
            helperText={formErrors.minOrderAmount}
          />

          <TextField
            label="Usage Limit"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleInputChange}
            type="number"
            inputProps={{ min: "1" }}
            fullWidth
            error={!!formErrors.usageLimit}
            helperText={formErrors.usageLimit}
          />

          <TextField
            label="Start Date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!formErrors.startDate}
            helperText={formErrors.startDate}
          />

          <TextField
            label="Expiry Date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!formErrors.expiryDate}
            helperText={formErrors.expiryDate}
          />

          <TextField
            select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            fullWidth
            label="Status"
            error={!!formErrors.status}
            helperText={formErrors.status}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>

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
            {selectedCoupon ? "Update Coupon" : "Add Coupon"}
          </Button>
        </Box>
      </CouponModal>
    </Stack>
  );
}
