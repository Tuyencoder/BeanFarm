import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateProductAPI, fetchAllCategoriesAPI,fetchAllSuppliersAPI } from "../../../../apis";

const ProductEdit = ({ open, onClose, product, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [categories, setCategories] = useState([]);
  const [suppliers, setsuppliers] = useState([]);

  useEffect(() => {
    setEditedProduct({ ...product });
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchAllCategoriesAPI();
        setCategories(response || []);  
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);  
      }
    };

    fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchSuplliers = async () => {
      try {
        const response = await fetchAllSuppliersAPI();
        setsuppliers(response || []);  
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);  
      }
    };

    fetchSuplliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    setEditedProduct((prev) => ({
      ...prev,
      category: selectedCategory
    }));
  };
  const handleSupplierChange = (e) => {
    const SupplierId = e.target.value;
    const selectedSupplier = suppliers.find(cat => cat.id === SupplierId);
    setEditedProduct((prev) => ({
      ...prev,
      supplier: selectedSupplier
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedProduct((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async () => {
    try {
      const updatedProduct = await updateProductAPI(editedProduct.id, editedProduct);
      onSave(updatedProduct);
      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
      // Handle error, show snackbar, etc.
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
            Chỉnh sửa sản phẩm
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin sản phẩm của bạn từ đây
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Tên sản phẩm"
          name="name"
          value={editedProduct.name || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Ghi chú sản phẩm"
          name="description"
          value={editedProduct.description || ""}
          onChange={handleChange}
          multiline
          rows={4}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Giá"
          name="price"
          value={editedProduct.price || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
        fullWidth
        margin="normal"
        label="Số lượng"
        name="quantity"
        value={editedProduct.quantity || ""}
        onChange={handleChange}
        variant="filled"
        InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
      />
        <FormControl fullWidth margin="normal" variant="filled">
          <InputLabel id="category-label">Danh mục</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={editedProduct.category?.id || ""}
            onChange={handleCategoryChange}
            style={{ backgroundColor: "#f9f9f9" }}
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">
                <em>Không có danh mục</em>
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" variant="filled">
          <InputLabel id="Supplier-label">Nhà cung cấp</InputLabel>
          <Select
            labelId="Supplier-label"
            name="Supplier"
            value={editedProduct.supplier?.id || ""}
            onChange={handleSupplierChange}
            style={{ backgroundColor: "#f9f9f9" }}
          >
            {suppliers.length > 0 ? (
              suppliers.map((Supplier) => (
                <MenuItem key={Supplier.id} value={Supplier.id}>
                  {Supplier.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">
                <em>Không có danh mục</em>
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Hạn sử dụng"
          name="expirationDate"
          type="datetime-local"
          value={editedProduct.expirationDate|| ""}
          onChange={handleChange}
          variant="filled"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />

        
        <TextField
          fullWidth
          margin="normal"
          label="Phần trăm khuyến mãi (%)"
          name="discount"
          type="number"
          value={editedProduct.discount|| ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
       <TextField
          fullWidth
          margin="normal"
          label="Ngày hết hạn khuyến mãi"
          name="discountExpiration"
          type="datetime-local"
          value={editedProduct.discountExpiration|| ""}
          onChange={handleChange}
          variant="filled"
          InputLabelProps={{
            shrink: true,
          }}
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
            src={editedProduct.image || "https://via.placeholder.com/150"}
            alt="Product"
            style={{ maxWidth: "100%", maxHeight: 200 }}
          />
        </Box>
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
            Lưu thay đổi
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ProductEdit;
