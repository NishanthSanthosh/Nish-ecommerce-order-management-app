import { Box, Paper, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SettingsForm from "../components/form";
import settingsFields from "../data/settingsFormData";
import { getSettings, updateSettings } from "../services/settingsService";

export default function Settings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await getSettings();
      return response?.data?.settings;
    },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update settings");
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
        <Typography color="text.secondary">Loading settings...</Typography>
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

  const onSubmit = async (formData) => {
    const settingsPayload = {
      ...formData,
      deliveryFee: Number(formData.deliveryFee),
      taxRate: Number(formData.taxRate),
    };

    updateSettingsMutation.mutate(settingsPayload);
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
        <Box>
          <Typography variant="overline" color="text.secondary" fontWeight={800}>
            Configuration
          </Typography>
          <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
            Store Settings
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
            Control store contact details, delivery fees, tax rate, currency,
            and order availability.
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
        <SettingsForm
          fields={settingsFields}
          register={register}
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel="Save Settings"
        />
      </Paper>
    </Stack>
  );
}
