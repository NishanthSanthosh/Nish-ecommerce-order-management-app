import {
  Box,
  Button,
  IconButton,
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
import { toast } from "react-toastify";
import CategoryModal from "../components/modal";
import useModal from "../hooks/useModal";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";

export default function Categories() {
  const {
    open,
    selectedItem: selectedCategory,
    openModal,
    closeModal,
  } = useModal();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ category: "" });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    let isCancelled = false;

    const loadCategories = async () => {
      try {
        const response = await getCategories();

        if (!isCancelled) {
          setCategories(response?.data?.categories || []);
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

    loadCategories();

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
        <Typography color="text.secondary">Loading categories...</Typography>
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
    setFormData({ category: row.category || "" });
    setFormErrors({});
    openModal(row);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.category}`)) {
      deleteCategory(row._id)
        .then(() => {
          setCategories((currentCategories) =>
            currentCategories.filter((category) => category._id !== row._id),
          );
          toast.success("Category deleted successfully");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete category");
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
    const category = formData.category.trim();

    if (!category) nextErrors.category = "Category name is required";
    else if (category.length < 3) nextErrors.category = "Minimum 3 characters";
    else if (category.length > 50) nextErrors.category = "Maximum 50 characters";
    else if (!/^[a-zA-Z0-9\s&'-]+$/.test(category)) {
      nextErrors.category = "Only alphanumeric characters allowed";
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
      if (selectedCategory) {
        const response = await updateCategory(selectedCategory._id, formData);
        const updatedCategory = response?.data?.category;

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category._id === selectedCategory._id ? updatedCategory : category,
          ),
        );
        toast.success("Category updated successfully");
      } else {
        const response = await createCategory(formData);
        const newCategory = response?.data?.category;

        setCategories((currentCategories) => [...currentCategories, newCategory]);
        toast.success("Category created successfully");
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
              Categories
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Create and manage product categories.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              openModal();
              setFormData({ category: "" });
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
            Add Category
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
              minWidth: { xs: 560, md: 640 },
              "& th, & td": {
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1.25, sm: 1.75 },
                whiteSpace: "nowrap",
              },
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                  Category ID
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                  Category Name
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} sx={{ py: 6, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No categories found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {categories.map((category) => (
                <TableRow key={category._id} hover>
                  <TableCell>{category._id}</TableCell>
                  <TableCell>{category.category}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(category)}
                      sx={{ bgcolor: "#eff6ff", mr: 0.75 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(category)}
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

      <CategoryModal
        open={open}
        onClose={handleClose}
        title={selectedCategory ? "Edit Category" : "Add Category"}
      >
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Category Name"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="e.g., Vegetables"
            fullWidth
            error={!!formErrors.category}
            helperText={formErrors.category}
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
            {selectedCategory ? "Update Category" : "Add Category"}
          </Button>
        </Box>
      </CategoryModal>
    </Stack>
  );
}
