import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ProductTable from "../components/table";
import AddProductForm from "../components/form";
import { useEffect, useMemo } from "react";
import useModal from "../hooks/useProductModal";
import AddProductModal from "../components/modal";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import productFields from "../data/productFormData";
import { headers } from "../data/productTableData";
import { accessors } from "../data/productTableData";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../services/productService";
import { getCategories } from "../services/categoryService";
import { useQueryClient } from "@tanstack/react-query";

export default function Products() {
  const queryClient = useQueryClient();
  const {
    open,
    selectedItem: selectedProduct,
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
    if (selectedProduct) {
      reset(selectedProduct);
    } else {
      reset({});
    }
  }, [selectedProduct, reset]);

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
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response?.data?.categories || [];
    },
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  const categoryOptions = useMemo(() => {
    const options = (categories || []).map((item) => ({
      label: item.category,
      value: item.category,
    }));

    if (
      selectedProduct?.category &&
      !options.some((option) => option.value === selectedProduct.category)
    ) {
      options.push({
        label: selectedProduct.category,
        value: selectedProduct.category,
      });
    }

    return options;
  }, [categories, selectedProduct]);

  const productFieldsWithCategories = useMemo(
    () =>
      productFields.map((field) =>
        field.name === "category"
          ? {
              ...field,
              options: categoryOptions,
              disabled: categoryOptions.length === 0,
              helperText:
                categoryOptions.length === 0
                  ? "Create a category before adding products."
                  : undefined,
            }
          : field,
      ),
    [categoryOptions],
  );

  const addProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create product");
    },
  });
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update product");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete product");
    },
  });

  if (isProductsLoading || isCategoriesLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "1px solid #e5e7eb",
          borderRadius: 4,
        }}
      >
        <Typography color="text.secondary">Loading products...</Typography>
      </Paper>
    );
  }
  if (isProductsError || isCategoriesError) {
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
          Error: {productsError?.message || categoriesError?.message}
        </Typography>
      </Paper>
    );
  }
  const handleClose = () => closeModal();
  const handleEdit = (row) => {
    openModal(row);
  };
  const handleDelete = (row) => {
    deleteProductMutation.mutate(row._id);
  };
  const onSubmit = async (data) => {
    try {
      if (selectedProduct) {
        updateProductMutation.mutate({
          id: selectedProduct._id,
          data: data,
        });
      } else {
        addProductMutation.mutate(data);
      }
      handleClose();

      queryClient.invalidateQueries({ queryKey: ["products"] });
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
              Inventory
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
              Product Catalog
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Keep grocery items updated with current stock, pricing, and
              category details.
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
            Add Product
          </Button>
        </Stack>
      </Paper>
      <ProductTable
        headers={headers}
        accessors={accessors}
        data={products || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AddProductModal
        open={open}
        onClose={handleClose}
        title={selectedProduct ? "Edit Product" : "Add Product"}
      >
        <AddProductForm
          fields={productFieldsWithCategories}
          register={register}
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel={selectedProduct ? "Update Product" : "Add Product"}
        />
      </AddProductModal>
    </Stack>
  );
}
