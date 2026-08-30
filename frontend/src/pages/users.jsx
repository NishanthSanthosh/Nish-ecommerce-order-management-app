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
import { toast } from "react-toastify";
import UserModal from "../components/modal";
import useModal from "../hooks/useModal";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../services/userService";

const emptyUserForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  role: "Customer",
  status: "Active",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{7,20}$/;

export default function Users() {
  const { open, selectedItem: selectedUser, openModal, closeModal } = useModal();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(emptyUserForm);
  const [formErrors, setFormErrors] = useState({});

  const isPasswordRequired = !selectedUser;

  useEffect(() => {
    let isCancelled = false;

    const loadUsers = async () => {
      try {
        const response = await getUsers();

        if (!isCancelled) {
          setUsers(response?.data?.users || []);
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

    loadUsers();

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
        <Typography color="text.secondary">Loading users...</Typography>
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
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      address: row.address || "",
      password: "",
      role: row.role || "Customer",
      status: row.status || "Active",
    });
    setFormErrors({});
    openModal(row);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}`)) {
      deleteUser(row._id)
        .then(() => {
          setUsers((currentUsers) =>
            currentUsers.filter((user) => user._id !== row._id),
          );
          toast.success("User deleted successfully");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete user");
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

    if (!formData.name.trim()) nextErrors.name = "Name is required";
    else if (formData.name.trim().length < 3) {
      nextErrors.name = "Minimum 3 characters";
    } else if (formData.name.trim().length > 60) {
      nextErrors.name = "Maximum 60 characters";
    }

    if (!formData.email.trim()) nextErrors.email = "Email is required";
    else if (!emailPattern.test(formData.email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) nextErrors.phone = "Phone number is required";
    else if (!phonePattern.test(formData.phone)) {
      nextErrors.phone = "Enter a valid phone number";
    }

    if (!formData.address.trim()) nextErrors.address = "Address is required";
    else if (formData.address.trim().length < 8) {
      nextErrors.address = "Enter a complete address";
    } else if (formData.address.trim().length > 200) {
      nextErrors.address = "Maximum 200 characters";
    }

    if (isPasswordRequired && !formData.password) {
      nextErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      nextErrors.password = "Minimum 6 characters";
    }

    if (!formData.role) nextErrors.role = "Please select a role";
    if (!formData.status) nextErrors.status = "Please select a status";

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
      const userPayload = { ...formData };

      if (selectedUser && !userPayload.password) {
        delete userPayload.password;
      }

      if (selectedUser) {
        const response = await updateUser(selectedUser._id, userPayload);
        const updatedUser = response?.data?.user;

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user._id === selectedUser._id ? updatedUser : user,
          ),
        );
        toast.success("User updated successfully");
      } else {
        const response = await createUser(userPayload);
        const newUser = response?.data?.user;

        setUsers((currentUsers) => [...currentUsers, newUser]);
        toast.success("User created successfully");
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
              Users
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Manage customer and admin account details.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              openModal();
              setFormData(emptyUserForm);
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
            Add User
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
              minWidth: { xs: 960, md: 900 },
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
                  "User ID",
                  "Name",
                  "Email",
                  "Phone",
                  "Address",
                  "Role",
                  "Status",
                  "Created By",
                  "Actions",
                ].map((header) => (
                  <TableCell key={header} sx={{ fontSize: 12, fontWeight: 800 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} sx={{ py: 6, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.createdBy}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(user)}
                      sx={{ bgcolor: "#eff6ff", mr: 0.75 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(user)}
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

      <UserModal
        open={open}
        onClose={handleClose}
        title={selectedUser ? "Edit User" : "Add User"}
      >
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., John Smith"
            fullWidth
            error={!!formErrors.name}
            helperText={formErrors.name}
          />

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            placeholder="e.g., john@example.com"
            fullWidth
            error={!!formErrors.email}
            helperText={formErrors.email}
          />

          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="e.g., 9876543210"
            fullWidth
            error={!!formErrors.phone}
            helperText={formErrors.phone}
          />

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Street, city, state, zip code"
            multiline
            rows={3}
            fullWidth
            error={!!formErrors.address}
            helperText={formErrors.address}
          />

          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            fullWidth
            helperText={
              formErrors.password ||
              "Required when creating. Leave blank while editing to keep current password."
            }
            error={!!formErrors.password}
          />

          <TextField
            select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            fullWidth
            label="Role"
            error={!!formErrors.role}
            helperText={formErrors.role}
          >
            <MenuItem value="Customer">Customer</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>

          <TextField
            select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            fullWidth
            label="Status"
            error={!!formErrors.status}
            helperText={formErrors.status}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>

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
            {selectedUser ? "Update User" : "Add User"}
          </Button>
        </Box>
      </UserModal>
    </Stack>
  );
}
