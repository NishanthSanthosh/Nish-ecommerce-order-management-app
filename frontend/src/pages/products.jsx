import { Toolbar, Button } from "@mui/material";
import ProductTable from "../components/table";
import AddProductForm from "../components/form";
import { useState } from "react";
import AddProductModal from "../components/modal";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect } from "react";
const headers = [
  "Product ID",
  "Product Name",
  "Category",
  "Price ($)",
  "Stock",
  "Rating",
];
// const accessors = ["id", "name", "category", "price", "stock", "rating"];
const accessors = ["_id", "product", "category", "price", "stock", "rating"];

const productFields = [
  {
    name: "product",
    label: "Product Name",
    validation: {
      required: "Product name is required",
      minLength: {
        value: 3,
        message: "Minimum 3 characters",
      },
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
      required: "Category is required",
    },
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    inputProps: { step: "any" },
    validation: {
      required: "Price is required",
      min: {
        value: 0.01,
        message: "Price must be greater than 0",
      },
    },
  },
  {
    name: "stock",
    label: "Stock",
    type: "number",
    validation: {
      required: "Stock is required",
      min: {
        value: 0,
        message: "Stock cannot be negative",
      },
    },
  },
];

export default function Products() {
  const [open, setOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [products, setProducts] = useState([]);
  const fetchProducts = () => {
    fetch("http://127.0.0.1:3000/api/version1/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data.products);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/api/version1/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      const data1 = await response.json();
      console.log(data1);
      toast.success("Product created successfully");
      handleClose();
      fetchProducts();
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };
  return (
    <>
      <ProductTable headers={headers} data={products} accessors={accessors} />
      <Toolbar sx={{ display: "flex" }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ marginLeft: "auto", backgroundColor: "#0b7285" }}
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
          submitLabel="Add Product"
        />
      </AddProductModal>
    </>
  );
}
