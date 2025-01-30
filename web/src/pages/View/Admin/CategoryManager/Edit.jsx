import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  FormHelperText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateCategoryAPI } from "../../../../apis";

const CategoryEdit = ({ open, onClose, category, onSave }) => {
  const [editedCategory, setEditedCategory] = useState(category);
  const [error, setError] = useState('');

  useEffect(() => {
    setEditedCategory(category);
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate discount value if name is 'discount'
    if (name === 'discount') {
      const discountValue = Number(value);
      if (discountValue < 0 || discountValue > 100) {
        setError('Vui lòng chỉ được áp dụng khuyến mãi từ 0% đến 100%');
        return;
      } else {
        setError('');
      }
    }

    setEditedCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (error) return; // Prevent saving if there's an error

    try {
      const updatedCategory = await updateCategoryAPI(editedCategory.id, {
        name: editedCategory.name,
        description: editedCategory.description,
        discount: editedCategory.discount,
        discountExpiration: editedCategory.discountExpiration,
        isActive: editedCategory.isActive, // Assuming isActive is also updated
      });
      onSave(updatedCategory); // Pass updated category to parent component
      onClose(); // Close the drawer
    } catch (error) {
      console.error("Failed to update category:", error);
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
            Edit Category
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
         Cập nhật thông tin danh mục của bạn từ đây
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Tên danh mục"
          name="name"
          value={editedCategory?.name || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Chú thích"
          name="description"
          value={editedCategory?.description || ""}
          onChange={handleChange}
          multiline
          rows={4}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Phần trăm khuyến mãi (%)"
          name="discount"
          type="number"
          value={editedCategory?.discount || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        {error && (
          <FormHelperText error>{error}</FormHelperText>
        )}
        <TextField
          fullWidth
          margin="normal"
          label="Ngày hết hạn khuyến mãi"
          name="discountExpiration"
          type="datetime-local" // Sử dụng 'datetime-local' để chọn ngày giờ đầy đủ
          InputLabelProps={{ shrink: true }}
          value={editedCategory?.discountExpiration || ""} // Không cần substring, lưu toàn bộ giá trị
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

export default CategoryEdit;
