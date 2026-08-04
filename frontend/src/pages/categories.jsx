import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CategoryTable from "../components/table";
import CategoryForm from "../components/form";
import CategoryModal from "../components/modal";
import useModal from "../hooks/useProductModal";
import categoryFields from "../data/categoryFormData";
import {
  categoryAccessors,
  categoryHeaders,
} from "../data/categoryTableData";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";

export default function Categories() {
  const queryClient = useQueryClient();
  const {
    open,
    selectedItem: selectedCategory,
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

  useEffect(() => {
    if (selectedCategory) {
      reset(selectedCategory);
    } else {
      reset({});
    }
  }, [selectedCategory, reset]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response?.data?.categories || [];
    },
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  const addCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create category");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update category");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete category");
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
        <Typography color="text.secondary">Loading categories...</Typography>
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
    deleteCategoryMutation.mutate(row._id);
  };

  const onSubmit = async (formData) => {
    try {
      if (selectedCategory) {
        updateCategoryMutation.mutate({
          id: selectedCategory._id,
          data: formData,
        });
      } else {
        addCategoryMutation.mutate(formData);
      }
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
              Catalog
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
              Category Management
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Create and maintain product categories used across the grocery
              catalog.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              openModal();
              reset({});
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
            Add Category
          </Button>
        </Stack>
      </Paper>

      <CategoryTable
        headers={categoryHeaders}
        accessors={categoryAccessors}
        data={data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryModal
        open={open}
        onClose={handleClose}
        title={selectedCategory ? "Edit Category" : "Add Category"}
      >
        <CategoryForm
          fields={categoryFields}
          register={register}
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel={selectedCategory ? "Update Category" : "Add Category"}
        />
      </CategoryModal>
    </Stack>
  );
}
