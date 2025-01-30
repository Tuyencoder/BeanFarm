import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateInternalAPI, fetchAllRolesAPI } from "../../../../apis";

const InternalEdit = ({ open, onClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState({ ...user });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success, error, warning, info

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetchAllRolesAPI();
        setRoles(response);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const selectedRole = roles.find((role) => role.name === e.target.value);
    setEditedUser((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const requesterId = localStorage.getItem('id');
      const updatedUser = await updateInternalAPI(editedUser.id, editedUser, requesterId);
      onSave(updatedUser); // Update user in the parent component (index.js)
      onClose(); // Close the drawer after saving
      showSnackbar({
        message: "Cập nhật người dùng thành công!",
        severity: "success",
      });
    } catch (error) {
      showSnackbar({
        open: true,
        message: "Quản lý chỉ được phép thay đổi thông tin của khách hàng.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onClose(); // Close the drawer without saving changes
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedUser((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showSnackbar = ({ message, severity }) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Drawer anchor="right" open={open} onClose={handleCancel}>
        <Box p={3} width="450px" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer anchor="right" open={open} onClose={handleCancel}>
        <Box p={3} width="450px" display="flex" flexDirection="column">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Chỉnh sửa người dùng
            </Typography>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Cập nhật thông tin người dùng của bạn từ đây
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Tên người dùng"
            name="username"
            value={editedUser.username || ""}
            onChange={handleChange}
            variant="filled"
            InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={editedUser.email || ""}
            onChange={handleChange}
            variant="filled"
            InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
          />
          <Button
            variant="contained"
            component="label"
            style={{
              backgroundColor: "#4caf50",
              marginTop: "16px",
            }}
          >
            Thêm/Sửa hình ảnh
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          <Box display="flex" justifyContent="center" mt={2} mb={2}>
            <img
              src={editedUser.image || "https://via.placeholder.com/150"}
              alt="User"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          </Box>
          <TextField
            fullWidth
            select
            margin="normal"
            label="Vai trò"
            name="role"
            value={editedUser.role?.name || ""}
            onChange={handleRoleChange}
            variant="filled"
            InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              onClick={handleCancel}
              variant="outlined"
              style={{
                borderColor: "#ff4d4f",
                color: "#ff4d4f",
                padding: "10px 20px",
              }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4caf50",
                padding: "10px 20px",
              }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </Box>
        </Box>
      </Drawer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InternalEdit;
