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
import useModal from "../hooks/useModal";
import AddProductModal from "../components/modal";
import { toast } from "react-toastify";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../services/productService";
import { getCategories } from "../services/categoryService";

const emptyProductForm = {
  product: "",
  category: "",
  price: "",
  stock: "",
};

export default function Products() {
  const {
    open,
    selectedItem: selectedProduct,
    openModal,
    closeModal,
  } = useModal();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(emptyProductForm);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    let isCancelled = false;

    const loadPageData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (!isCancelled) {
          setProducts(productsResponse?.data?.products || []);
          setCategories(categoriesResponse?.data?.categories || []);
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

    loadPageData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const categoryOptions = (categories || []).map((item) => ({
    label: item.category,
    value: item.category,
  }));

  if (
    selectedProduct?.category &&
    !categoryOptions.some((option) => option.value === selectedProduct.category)
  ) {
    categoryOptions.push({
      label: selectedProduct.category,
      value: selectedProduct.category,
    });
  }

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
        <Typography color="text.secondary">Loading products...</Typography>
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
      product: row.product || "",
      category: row.category || "",
      price: row.price ?? "",
      stock: row.stock ?? "",
    });
    setFormErrors({});
    openModal(row);
  };
  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.product}`)) {
      deleteProduct(row._id)
        .then(() => {
          setProducts((currentProducts) =>
            currentProducts.filter((product) => product._id !== row._id),
          );
          toast.success("Product deleted successfully");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete product");
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
    const productName = formData.product.trim();
    const price = Number(formData.price);
    const stock = Number(formData.stock);

    if (!productName) nextErrors.product = "Product name is required";
    else if (productName.length < 3) nextErrors.product = "Minimum 3 characters";
    else if (productName.length > 50) nextErrors.product = "Maximum 50 characters";
    else if (!/^[a-zA-Z0-9\s&'-]+$/.test(productName)) {
      nextErrors.product = "Only alphanumeric characters allowed";
    }

    if (!formData.category) nextErrors.category = "Please select a category";

    if (formData.price === "") nextErrors.price = "Price is required";
    else if (price < 0.01) nextErrors.price = "Price must be at least 0.01";
    else if (price > 100) nextErrors.price = "Price exceeds maximum limit";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(formData.price))) {
      nextErrors.price = "Maximum 2 decimal places allowed";
    }

    if (formData.stock === "") nextErrors.stock = "Stock is required";
    else if (stock < 0) nextErrors.stock = "Stock cannot be negative";
    else if (stock > 99999) nextErrors.stock = "Stock exceeds warehouse capacity";
    else if (!Number.isInteger(stock)) {
      nextErrors.stock = "Stock must be a whole number";
    }

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
      if (selectedProduct) {
        const response = await updateProduct(selectedProduct._id, formData);
        const updatedProduct = response?.data?.product;

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product._id === selectedProduct._id ? updatedProduct : product,
          ),
        );
        toast.success("Product updated successfully");
      } else {
        const response = await createProduct(formData);
        const newProduct = response?.data?.product;

        setProducts((currentProducts) => [...currentProducts, newProduct]);
        toast.success("Product created successfully");
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
              Products
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Manage grocery items, prices, stock, and categories.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              openModal();
              setFormData(emptyProductForm);
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
            Add Product
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
              minWidth: { xs: 760, md: 720 },
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
                  "Product ID",
                  "Product Name",
                  "Category",
                  "Price ($)",
                  "Stock",
                  "Rating",
                  "Actions",
                ].map((header) => (
                  <TableCell key={header} sx={{ fontSize: 12, fontWeight: 800 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(products || []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 6, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No products found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {(products || []).map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>{product._id}</TableCell>
                  <TableCell>{product.product}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.rating ?? "-"}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(product)}
                      sx={{ bgcolor: "#eff6ff", mr: 0.75 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(product)}
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
      <AddProductModal
        open={open}
        onClose={handleClose}
        title={selectedProduct ? "Edit Product" : "Add Product"}
      >
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Product Name"
            name="product"
            value={formData.product}
            onChange={handleInputChange}
            placeholder="e.g., Organic Red Apples"
            fullWidth
            error={!!formErrors.product}
            helperText={formErrors.product}
          />

          <TextField
            select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            fullWidth
            label="Category"
            disabled={categoryOptions.length === 0}
            error={!!formErrors.category}
            helperText={
              formErrors.category ||
              (categoryOptions.length === 0
                ? "Create a category before adding products."
                : undefined)
            }
          >
            {categoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            type="number"
            inputProps={{ step: "0.01", min: "0" }}
            fullWidth
            error={!!formErrors.price}
            helperText={formErrors.price}
          />

          <TextField
            label="Stock Quantity"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            type="number"
            fullWidth
            error={!!formErrors.stock}
            helperText={formErrors.stock}
          />

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
            {selectedProduct ? "Update Product" : "Add Product"}
          </Button>
        </Box>
      </AddProductModal>
    </Stack>
  );
}
