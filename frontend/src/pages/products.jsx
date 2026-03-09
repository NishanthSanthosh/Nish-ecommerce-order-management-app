import { Toolbar, Button } from "@mui/material";
import ProductTable from "../components/table";
import AddProductForm from "../components/form";
import { useState } from "react";
import AddProductModal from "../components/modal";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
const headers = [
  "Product ID",
  "Product Name",
  "Category",
  "Price ($)",
  "Stock",
  "Rating",
];
const accessors = ["id", "name", "category", "price", "stock", "rating"];
const data = [
  {
    id: "P001",
    name: "Organic Apples",
    category: "Fruits",
    price: 3.99,
    stock: 120,
    rating: 4.5,
  },
  {
    id: "P002",
    name: "Bananas",
    category: "Fruits",
    price: 1.29,
    stock: 150,
    rating: 4.8,
  },
  {
    id: "P003",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 2.49,
    stock: 50,
    rating: 4.2,
  },
  {
    id: "P004",
    name: "Almond Milk",
    category: "Dairy",
    price: 3.29,
    stock: 30,
    rating: 4.7,
  },
  {
    id: "P005",
    name: "Brown Rice",
    category: "Grains",
    price: 1.99,
    stock: 200,
    rating: 4.3,
  },
  {
    id: "P006",
    name: "Spinach",
    category: "Vegetables",
    price: 2.19,
    stock: 80,
    rating: 4.6,
  },
  {
    id: "P007",
    name: "Carrots",
    category: "Vegetables",
    price: 1.99,
    stock: 100,
    rating: 4.5,
  },
  {
    id: "P008",
    name: "Greek Yogurt",
    category: "Dairy",
    price: 2.99,
    stock: 60,
    rating: 4.6,
  },
  {
    id: "P001",
    name: "Organic Apples",
    category: "Fruits",
    price: 3.99,
    stock: 120,
    rating: 4.5,
  },
  {
    id: "P002",
    name: "Bananas",
    category: "Fruits",
    price: 1.29,
    stock: 150,
    rating: 4.8,
  },
  {
    id: "P003",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 2.49,
    stock: 50,
    rating: 4.2,
  },
  {
    id: "P004",
    name: "Almond Milk",
    category: "Dairy",
    price: 3.29,
    stock: 30,
    rating: 4.7,
  },
  {
    id: "P005",
    name: "Brown Rice",
    category: "Grains",
    price: 1.99,
    stock: 200,
    rating: 4.3,
  },
  {
    id: "P006",
    name: "Spinach",
    category: "Vegetables",
    price: 2.19,
    stock: 80,
    rating: 4.6,
  },
  {
    id: "P007",
    name: "Carrots",
    category: "Vegetables",
    price: 1.99,
    stock: 100,
    rating: 4.5,
  },
  {
    id: "P008",
    name: "Greek Yogurt",
    category: "Dairy",
    price: 2.99,
    stock: 60,
    rating: 4.6,
  },
  {
    id: "P001",
    name: "Organic Apples",
    category: "Fruits",
    price: 3.99,
    stock: 120,
    rating: 4.5,
  },
  {
    id: "P002",
    name: "Bananas",
    category: "Fruits",
    price: 1.29,
    stock: 150,
    rating: 4.8,
  },
  {
    id: "P003",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 2.49,
    stock: 50,
    rating: 4.2,
  },
  {
    id: "P004",
    name: "Almond Milk",
    category: "Dairy",
    price: 3.29,
    stock: 30,
    rating: 4.7,
  },
  {
    id: "P005",
    name: "Brown Rice",
    category: "Grains",
    price: 1.99,
    stock: 200,
    rating: 4.3,
  },
  {
    id: "P006",
    name: "Spinach",
    category: "Vegetables",
    price: 2.19,
    stock: 80,
    rating: 4.6,
  },
  {
    id: "P007",
    name: "Carrots",
    category: "Vegetables",
    price: 1.99,
    stock: 100,
    rating: 4.5,
  },
  {
    id: "P008",
    name: "Greek Yogurt",
    category: "Dairy",
    price: 2.99,
    stock: 60,
    rating: 4.6,
  },
  {
    id: "P001",
    name: "Organic Apples",
    category: "Fruits",
    price: 3.99,
    stock: 120,
    rating: 4.5,
  },
  {
    id: "P002",
    name: "Bananas",
    category: "Fruits",
    price: 1.29,
    stock: 150,
    rating: 4.8,
  },
  {
    id: "P003",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 2.49,
    stock: 50,
    rating: 4.2,
  },
  {
    id: "P004",
    name: "Almond Milk",
    category: "Dairy",
    price: 3.29,
    stock: 30,
    rating: 4.7,
  },
  {
    id: "P005",
    name: "Brown Rice",
    category: "Grains",
    price: 1.99,
    stock: 200,
    rating: 4.3,
  },
  {
    id: "P006",
    name: "Spinach",
    category: "Vegetables",
    price: 2.19,
    stock: 80,
    rating: 4.6,
  },
  {
    id: "P007",
    name: "Carrots",
    category: "Vegetables",
    price: 1.99,
    stock: 100,
    rating: 4.5,
  },
  {
    id: "P008",
    name: "Greek Yogurt",
    category: "Dairy",
    price: 2.99,
    stock: 60,
    rating: 4.6,
  },
];

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
      { label: "Electronics", value: "Electronics" },
      { label: "Grocery", value: "Grocery" },
    ],
    validation: {
      required: "Category is required",
    },
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    validation: {
      required: "Price is required",
      min: {
        value: 1,
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
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };
  return (
    <>
      <ProductTable headers={headers} data={data} accessors={accessors} />
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
        {/* <AddProductForm
          fields={productFields}
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel="Add Product"
        /> */}
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
