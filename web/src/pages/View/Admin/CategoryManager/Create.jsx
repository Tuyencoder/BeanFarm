import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Grid,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Dashboard from "../index";
import { CreateCategoryAPI } from "../../../../apis";

const CategoryCreate = ({ category }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setIsActive(category.isActive || true);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = {
        name,
        description,
        isActive,
      };

      const createdCategory = await CreateCategoryAPI(newCategory);

      setSnackbar({
        open: true,
        message: "Category created successfully!",
        severity: "success",
      });

      // Optionally update the local state with the created category data
      // setName(createdCategory.name);
      // setDescription(createdCategory.description);
      // setIsActive(createdCategory.isActive);

      navigate("/admin/categorymanager");
    } catch (error) {
      console.error("Failed to create category:", error);
      setSnackbar({
        open: true,
        message: "Failed to create category.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/categorymanager");
  };

  return (
    <Dashboard>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Thêm danh mục
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                  />
                }
                label="Hoạt động"
              />
            </Toolbar>
          </AppBar>
          <form onSubmit={handleSubmit} style={{ padding: 16 }}>
            <Tabs value={0}>
              <Tab label="Thông tin cơ bản" />
            </Tabs>
            <Grid container spacing={3} style={{ marginTop: 16 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên danh mục"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Mô tả danh mục"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
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
                Thêm danh mục
              </Button>
            </div>
          </form>
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

export default CategoryCreate;
