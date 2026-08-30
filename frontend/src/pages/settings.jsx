import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getSettings, updateSettings } from "../services/settingsService";

const emptySettingsForm = {
  storeName: "",
  contactEmail: "",
  supportPhone: "",
  storeAddress: "",
  currency: "USD",
  deliveryFee: 0,
  taxRate: 0,
  orderStatus: "Open",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{7,20}$/;

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    let isCancelled = false;

    const loadSettings = async () => {
      try {
        const response = await getSettings();

        if (!isCancelled) {
          setSettings(response?.data?.settings || null);
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

    loadSettings();

    return () => {
      isCancelled = true;
    };
  }, []);

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
        <Typography color="text.secondary">Loading settings...</Typography>
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

  const handleInputChange = (event) => {
    const { name } = event.target;
    setFormErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const validateForm = (settingsFormData) => {
    const nextErrors = {};
    const deliveryFee = Number(settingsFormData.deliveryFee);
    const taxRate = Number(settingsFormData.taxRate);

    if (!settingsFormData.storeName.trim()) {
      nextErrors.storeName = "Store name is required";
    } else if (settingsFormData.storeName.trim().length < 3) {
      nextErrors.storeName = "Minimum 3 characters";
    } else if (settingsFormData.storeName.trim().length > 80) {
      nextErrors.storeName = "Maximum 80 characters";
    }

    if (!settingsFormData.contactEmail.trim()) {
      nextErrors.contactEmail = "Contact email is required";
    } else if (!emailPattern.test(settingsFormData.contactEmail)) {
      nextErrors.contactEmail = "Enter a valid email";
    }

    if (!settingsFormData.supportPhone.trim()) {
      nextErrors.supportPhone = "Support phone is required";
    } else if (!phonePattern.test(settingsFormData.supportPhone)) {
      nextErrors.supportPhone = "Enter a valid phone number";
    }

    if (!settingsFormData.storeAddress.trim()) {
      nextErrors.storeAddress = "Store address is required";
    } else if (settingsFormData.storeAddress.trim().length < 8) {
      nextErrors.storeAddress = "Enter a complete address";
    } else if (settingsFormData.storeAddress.trim().length > 200) {
      nextErrors.storeAddress = "Maximum 200 characters";
    }

    if (!settingsFormData.currency) nextErrors.currency = "Please select a currency";

    if (settingsFormData.deliveryFee === "" || Number.isNaN(deliveryFee)) {
      nextErrors.deliveryFee = "Delivery fee is required";
    } else if (deliveryFee < 0) {
      nextErrors.deliveryFee = "Delivery fee cannot be negative";
    }

    if (settingsFormData.taxRate === "" || Number.isNaN(taxRate)) {
      nextErrors.taxRate = "Tax rate is required";
    } else if (taxRate < 0) {
      nextErrors.taxRate = "Tax rate cannot be negative";
    } else if (taxRate > 100) {
      nextErrors.taxRate = "Tax rate cannot exceed 100";
    }

    if (!settingsFormData.orderStatus) {
      nextErrors.orderStatus = "Please select order status";
    }

    return nextErrors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const settingsFormData = Object.fromEntries(new FormData(event.currentTarget));
    const nextErrors = validateForm(settingsFormData);

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const settingsPayload = {
      ...settingsFormData,
      deliveryFee: Number(settingsFormData.deliveryFee),
      taxRate: Number(settingsFormData.taxRate),
    };

    setIsSubmitting(true);

    try {
      const response = await updateSettings(settingsPayload);
      setSettings(response?.data?.settings || settingsPayload);
      toast.success("Settings updated successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to update settings");
    } finally {
      setIsSubmitting(false);
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
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Settings
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
            Update store details, fees, tax, and order availability.
          </Typography>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          border: "1px solid #e5e7eb",
          borderRadius: 4,
          maxWidth: 720,
        }}
      >
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Store Name"
            name="storeName"
            defaultValue={settings?.storeName || emptySettingsForm.storeName}
            onChange={handleInputChange}
            placeholder="e.g., Nish Groceries"
            fullWidth
            error={!!formErrors.storeName}
            helperText={formErrors.storeName}
          />

          <TextField
            label="Contact Email"
            name="contactEmail"
            defaultValue={settings?.contactEmail || emptySettingsForm.contactEmail}
            onChange={handleInputChange}
            type="email"
            placeholder="e.g., support@example.com"
            fullWidth
            error={!!formErrors.contactEmail}
            helperText={formErrors.contactEmail}
          />

          <TextField
            label="Support Phone"
            name="supportPhone"
            defaultValue={settings?.supportPhone || emptySettingsForm.supportPhone}
            onChange={handleInputChange}
            placeholder="e.g., 9876543210"
            fullWidth
            error={!!formErrors.supportPhone}
            helperText={formErrors.supportPhone}
          />

          <TextField
            label="Store Address"
            name="storeAddress"
            defaultValue={settings?.storeAddress || emptySettingsForm.storeAddress}
            onChange={handleInputChange}
            placeholder="Street, city, state, zip code"
            multiline
            rows={3}
            fullWidth
            error={!!formErrors.storeAddress}
            helperText={formErrors.storeAddress}
          />

          <TextField
            select
            name="currency"
            defaultValue={settings?.currency || emptySettingsForm.currency}
            onChange={handleInputChange}
            fullWidth
            label="Currency"
            error={!!formErrors.currency}
            helperText={formErrors.currency}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="INR">INR</MenuItem>
          </TextField>

          <TextField
            label="Delivery Fee"
            name="deliveryFee"
            defaultValue={settings?.deliveryFee ?? emptySettingsForm.deliveryFee}
            onChange={handleInputChange}
            type="number"
            inputProps={{ step: "0.01", min: "0" }}
            fullWidth
            error={!!formErrors.deliveryFee}
            helperText={formErrors.deliveryFee}
          />

          <TextField
            label="Tax Rate (%)"
            name="taxRate"
            defaultValue={settings?.taxRate ?? emptySettingsForm.taxRate}
            onChange={handleInputChange}
            type="number"
            inputProps={{ step: "0.01", min: "0", max: "100" }}
            fullWidth
            error={!!formErrors.taxRate}
            helperText={formErrors.taxRate}
          />

          <TextField
            select
            name="orderStatus"
            defaultValue={settings?.orderStatus || emptySettingsForm.orderStatus}
            onChange={handleInputChange}
            fullWidth
            label="Accepting Orders"
            error={!!formErrors.orderStatus}
            helperText={formErrors.orderStatus}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              alignSelf: { xs: "stretch", sm: "flex-start" },
              bgcolor: "#0f766e",
              fontWeight: 800,
              "&:hover": { bgcolor: "#115e59" },
            }}
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </Box>
      </Paper>
    </Stack>
  );
}
