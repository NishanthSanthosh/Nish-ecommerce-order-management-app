import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserTable from "../components/table";
import UserForm from "../components/form";
import UserModal from "../components/modal";
import useModal from "../hooks/useProductModal";
import userFields from "../data/userFormData";
import { userAccessors, userHeaders } from "../data/userTableData";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../services/userService";

export default function Users() {
  const queryClient = useQueryClient();
  const { open, selectedItem: selectedUser, openModal, closeModal } = useModal();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const defaultUserValues = useMemo(
    () => ({
      password: "",
      role: "Customer",
      status: "Active",
    }),
    [],
  );

  useEffect(() => {
    if (selectedUser) {
      reset({ ...selectedUser, password: "" });
    } else {
      reset(defaultUserValues);
    }
  }, [defaultUserValues, selectedUser, reset]);

  const userFieldsForMode = useMemo(
    () =>
      userFields.map((field) =>
        field.name === "password" && !selectedUser
          ? {
              ...field,
              validation: {
                ...field.validation,
                required: "Password is required",
              },
            }
          : field,
      ),
    [selectedUser],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsers();
      return response?.data?.users || [];
    },
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  const addUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create user");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete user");
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
        <Typography color="text.secondary">Loading users...</Typography>
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
    deleteUserMutation.mutate(row._id);
  };

  const onSubmit = async (formData) => {
    try {
      const userPayload = { ...formData };

      if (!selectedUser && !userPayload.password) {
        toast.error("Password is required");
        return;
      }

      if (selectedUser && !userPayload.password) {
        delete userPayload.password;
      }

      if (selectedUser) {
        updateUserMutation.mutate({
          id: selectedUser._id,
          data: userPayload,
        });
      } else {
        addUserMutation.mutate(userPayload);
      }
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
              Customers
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
              User Management
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Manage customer and admin records, contact details, account roles,
              and account status.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              openModal();
              reset(defaultUserValues);
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
            Add User
          </Button>
        </Stack>
      </Paper>

      <UserTable
        headers={userHeaders}
        accessors={userAccessors}
        data={data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UserModal
        open={open}
        onClose={handleClose}
        title={selectedUser ? "Edit User" : "Add User"}
      >
        <UserForm
          fields={userFieldsForMode}
          register={register}
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel={selectedUser ? "Update User" : "Add User"}
        />
      </UserModal>
    </Stack>
  );
}
