import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateRoleAPI } from "../../../../apis";

const RoleEdit = ({ open, onClose, role, onSave }) => {
  const [editedRole, setEditedRole] = useState(role);

  useEffect(() => {
    setEditedRole(role);
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedRole = await updateRoleAPI(editedRole.id, {
        name: editedRole.name,
        isActive: editedRole.isActive, // Assuming isActive is also updated
      });
      onSave(updatedRole); // Pass updated role to parent component
      onClose(); // Close the drawer
    } catch (error) {
      console.error("Failed to update role:", error);
      // Handle error (e.g., show error message)
    }
  };

  const handleCancel = () => {
    onClose(); // Close the drawer
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleCancel}>
      <Box p={3} width="450px" display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            Edit Role
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin chức vụ
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Tên Chức vụ"
          name="name"
          value={editedRole?.name || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
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
            hủy
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#4caf50",
              padding: "10px 20px",
            }}
            onClick={handleSave}
          >
            Lưu Thay Đổi
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default RoleEdit;
