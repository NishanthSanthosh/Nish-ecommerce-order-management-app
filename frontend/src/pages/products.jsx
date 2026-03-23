import { Toolbar, Button } from "@mui/material";
import ProductTable from "../components/table";
import AddProductForm from "../components/form";
import { useState } from "react";
import AddProductModal from "../components/modal";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
// import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
const headers = [
  "Product ID",
  "Product Name",
  "Category",
  "Price ($)",
  "Stock",
  "Rating",
];
// const accessors = ["id", "name", "category", "price", "stock", "rating"];
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../services/productService";
import { useQueryClient } from "@tanstack/react-query";

const accessors = ["_id", "product", "category", "price", "stock", "rating"];
const productFields = [
  {
    name: "product",
    label: "Product Name",
    placeholder: "e.g., Organic Red Apples",
    validation: {
      required: "Product name is required",
      minLength: { value: 3, message: "Minimum 3 characters" },
      maxLength: { value: 50, message: "Maximum 50 characters" },
      pattern: {
        value: /^[a-zA-Z0-9\s&'-]+$/,
        message: "Only alphanumeric characters allowed",
      },
      validate: (value) =>
        value.trim().length >= 3 || "Name cannot be just spaces",
    },
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Vegetables", value: "Vegetables" },
      { label: "Fruits", value: "Fruits" },
      { label: "Dairy", value: "Dairy" },
    ],
    validation: {
      required: "Please select a category",
    },
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    inputProps: { step: "0.01", min: "0" },
    validation: {
      required: "Price is required",
      min: { value: 0.01, message: "Price must be at least 0.01" },
      max: { value: 100, message: "Price exceeds maximum limit" },
      pattern: {
        value: /^\d+(\.\d{1,2})?$/,
        message: "Maximum 2 decimal places allowed",
      },
    },
  },
  {
    name: "stock",
    label: "Stock Quantity",
    type: "number",
    validation: {
      required: "Stock is required",
      min: { value: 0, message: "Stock cannot be negative" },
      max: { value: 99999, message: "Stock exceeds warehouse capacity" },
      validate: (value) =>
        Number.isInteger(Number(value)) || "Stock must be a whole number",
    },
  },
];

export default function Products() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"], // query key
    queryFn: async () => {
      const response = await getProducts();
      return response?.data?.products || [];
    },
    staleTime: 5000, // optional
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  const handleOpen = () => {
    setOpen(true);
    reset({});
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    reset({});
  };
  const handleEdit = (row) => {
    setSelectedProduct(row);
    reset(row);
    setOpen(true);
  };

  const handleDelete = async (row) => {
    try {
      await deleteProduct(row._id);
      toast.success("Product deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete product");
    }
  };
  const handleAddProduct = async (data) => {
    const responseData = await createProduct(data);

    if (responseData.status === "success") {
      toast.success("Product created successfully");
    }

    return responseData;
  };

  const handleUpdateProduct = async (data) => {
    const responseData = await updateProduct(selectedProduct._id, data);
    if (responseData.status === "success") {
      toast.success("Product updated successfully");
    }

    return responseData;
  };
  const onSubmit = async (data) => {
    try {
      if (selectedProduct) {
        await handleUpdateProduct(data);
      } else {
        await handleAddProduct(data);
      }
      handleClose();

      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.error("Submission failed:", error);
    }
  };
  return (
    <>
      <ProductTable
        headers={headers}
        accessors={accessors}
        data={data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Toolbar sx={{ display: "flex" }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ marginLeft: "auto", backgroundColor: "black" }}
        >
          Add Product
        </Button>
      </Toolbar>
      <AddProductModal
        open={open}
        onClose={handleClose}
        title="Add New Product"
      >
        <AddProductForm
          fields={productFields}
          register={register}
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel={selectedProduct ? "Update Product" : "Add Product"}
        />
      </AddProductModal>
    </>
  );
}
