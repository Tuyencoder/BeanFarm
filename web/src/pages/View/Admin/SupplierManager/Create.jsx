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
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Dashboard from "../index";
import { CreateSuppliersAPI } from "../../../../apis";

const SupplierCreate = ({ supplier }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false); // For phone validation error
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (supplier) {
      setName(supplier.name || "");
      setAddress(supplier.address || "");
      setPhone(supplier.phone || "");
    }
  }, [supplier]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone validation check (10 to 15 characters)
    if (phone.length < 10 || phone.length > 15) {
      setPhoneError(true);
      return;
    }

    setPhoneError(false); // Reset error if phone is valid

    try {
      const newSupplier = {
        name,
        address,
        phone,
      };

      const createdSupplier = await CreateSuppliersAPI(newSupplier);

      setSnackbar({
        open: true,
        message: "Nhà cung cấp được thêm thành công!",
        severity: "success",
      });

      navigate("/admin/suppliermanager");
    } catch (error) {
      console.error("Failed to create supplier:", error);
      setSnackbar({
        open: true,
        message: "Thêm nhà cung cấp thất bại.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/suppliermanager");
  };

  return (
    <Dashboard>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Thêm Nhà Cung Cấp
              </Typography>
            </Toolbar>
          </AppBar>
          <form onSubmit={handleSubmit} style={{ padding: 16 }}>
            <Grid container spacing={3} style={{ marginTop: 16 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên Nhà Cung Cấp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa Chỉ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số Điện Thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  error={phoneError} // Show error state
                  helperText={phoneError ? "Số điện thoại phải từ 10 đến 15 ký tự" : ""}
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
                Thêm Nhà Cung Cấp
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

export default SupplierCreate;
