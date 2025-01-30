import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
  Box,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Dashboard from "../index";
import { CreateProductAPI, fetchAllCategoriesAPI,fetchAllSuppliersAPI } from "../../../../apis";

const ProductCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(""); // Changed to store image as Data URL
  const [categories, setCategories] = useState([]);
  const [expirationDate, setExpirationDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [discount, setDiscount] = useState("");
  const [suppliers, setsuppliers] = useState([]);
  const [discountExpiration, setDiscountExpiration] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await fetchAllCategoriesAPI();
        setCategories(categoriesData);
        if (categoriesData.length > 0 && !categoryId) {
          setCategoryId(categoriesData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [categoryId]);
  useEffect(() => {
    const fetchSuplliers = async () => {
      try {
        const response = await fetchAllSuppliersAPI();
        setsuppliers(response || []);  
        if (response.length > 0 && !supplierId) {
          setSupplierId(response[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);  
      }
    };

    fetchSuplliers();
  }, []);

  // Image change handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result); // Set image as Data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!title || !description || !price || !categoryId || !expirationDate) {
      setSnackbar({
        open: true,
        message: "Vui lòng điền tất cả các trường bắt buộc.",
        severity: "warning",
      });
      return;
    }

    const newProduct = {
      name: title,
      description: description,
      price: price,
      quantity:quantity,
      image: image, // Use Data URL for image
      category: {
        id: categoryId,
      },
      supplier:{
        id:supplierId
      },
      expirationDate: expirationDate,
      discount: discount,
      discountExpiration: discountExpiration,
    };

    try {
      await CreateProductAPI(newProduct);
      setSnackbar({
        open: true,
        message: "Product created successfully!",
        severity: "success",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(""); // Clear image
      setDiscount("");
      setDiscountExpiration("");
      navigate("/admin/productManager");
    } catch (error) {
      console.error("Error creating product:", error);
      setSnackbar({
        open: true,
        message: "Failed to create product.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/productManager");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageChange({ target: { files: acceptedFiles } });
      }
    },
  });

  return (
    <Dashboard>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Thêm Sản Phẩm
              </Typography>
              <IconButton onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box p={3}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên sản phẩm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Chú thích sản phẩm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <div
                    {...getRootProps()}
                    style={{
                      border: "1px dashed #ccc",
                      padding: 16,
                      textAlign: "center",
                    }}
                  >
                    <input
                      {...getInputProps()}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Typography variant="body2">
                      Kéo hình ảnh của bạn vào đây (Chỉ *.jpeg, *.webp và *.png hình ảnh sẽ được chấp nhận)
                    </Typography>
                  </div>
                  {image && (
                    <Box mt={2}>
                      <img
                        src={image}
                        alt="Selected"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    </Box>
                     )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Giá sản phẩm"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    variant="filled"
                    type="number" // Ensure numeric input
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="số lượng sản phẩm"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    variant="filled"
                    type="number" // Ensure numeric input
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="filled" required>
                    <InputLabel id="category-label">Danh mục</InputLabel>
                    <Select
                      labelId="category-label"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="filled" required>
                    <InputLabel id="supplier-label">Danh mục</InputLabel>
                    <Select
                      labelId="supplier-label"
                      value={supplierId}
                      onChange={(e) => setSupplierId(e.target.value)}
                    >
                      {suppliers.map((supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hạn sử dụng"
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    variant="filled"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phần trăm khuyến mãi (%)"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    type="number"
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ngày hết hạn khuyến mãi"
                    type="datetime-local"
                    value={discountExpiration}
                    onChange={(e) => setDiscountExpiration(e.target.value)}
                    variant="filled"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
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
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    padding: "10px 20px",
                  }}
                >
                  Thêm Sản Phẩm
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dashboard>
  );
};

export default ProductCreate;
