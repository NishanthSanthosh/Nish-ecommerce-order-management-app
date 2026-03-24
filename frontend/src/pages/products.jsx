import { Toolbar, Button } from "@mui/material";
import ProductTable from "../components/table";
import AddProductForm from "../components/form";
import { useEffect } from "react";
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
      reset(selectedProduct); // pre-fill form
    } else {
      reset({}); // empty form
    }
  }, [selectedProduct, reset]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"], // query key
    queryFn: async () => {
      const response = await getProducts();
      return response?.data?.products || [];
    },
    staleTime: 5000, // optional
    refetchOnWindowFocus: true,
  });
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

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Error: {error.message}</div>;
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
          onClick={() => {
            openModal();
            reset({});
          }}
          sx={{ marginLeft: "auto", backgroundColor: "black" }}
        >
          Add Product
        </Button>
      </Toolbar>
      <AddProductModal
        open={open}
        onClose={handleClose}
        title={selectedProduct ? "Edit Product" : "Add Product"}
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
