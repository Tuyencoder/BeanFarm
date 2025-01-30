import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateSuppliersAPI } from "../../../../apis";

const SupplierEdit = ({ open, onClose, supplier, onSave }) => {
  const [editedSupplier, setEditedSupplier] = useState(supplier);
  const [error, setError] = useState("");

  useEffect(() => {
    setEditedSupplier(supplier);
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d+$/.test(value)) {
        setError("Số điện thoại chỉ được chứa chữ số");
        return;
      } else {
        setError("");
      }
    }

    setEditedSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (error) return;

    try {
      const updatedSupplier = await updateSuppliersAPI(editedSupplier.id, {
        name: editedSupplier.name,
        address: editedSupplier.address,
        phone: editedSupplier.phone,
        createdAt: editedSupplier.createdAt, // Có thể bỏ qua nếu không cần cập nhật
        updatedAt: new Date().toISOString(),
      });
      onSave(updatedSupplier);
      onClose();
    } catch (err) {
      console.error("Failed to update supplier:", err);
    }
  };

  const handleCancel = () => {
    onClose();
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
            Cập nhật nhà cung cấp
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin nhà cung cấp của bạn từ đây
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Tên nhà cung cấp"
          name="name"
          value={editedSupplier?.name || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Địa chỉ"
          name="address"
          value={editedSupplier?.address || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Số điện thoại"
          name="phone"
          value={editedSupplier?.phone || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        {error && <FormHelperText error>{error}</FormHelperText>}

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
          >
            Lưu Thay Đổi
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SupplierEdit;
