import React, { useState } from "react";
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
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Dashboard from "../index";
import { createVoucherAPI } from "../../../../apis"; // Assuming createVoucherAPI function

const NewVoucher = () => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [type, setType] = useState("FREE"); // "FREE" or "POINTS"
  const [pointsRequired, setPointsRequired] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newVoucher = {
      code,
      discount,
      description,
      expirationDate,
      type,
      pointsRequired: type === "POINTS" ? pointsRequired : 0, // Only set pointsRequired if type is POINTS
    };

    try {
      // Call API to create voucher
      await createVoucherAPI(newVoucher);

      setSnackbar({
        open: true,
        message: "Voucher created successfully!",
        severity: "success",
      });

      // Reset the form
      setCode("");
      setDiscount("");
      setDescription("");
      setExpirationDate("");
      setType("FREE");
      setPointsRequired("");

      // Navigate to the voucher manager page
      navigate("/admin/voucherManager");
    } catch (error) {
      console.error("Error creating voucher:", error);
      setSnackbar({
        open: true,
        message: "Failed to create voucher.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/voucherManager");
  };

  return (
    <Dashboard>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Tạo Voucher Mới
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
                    label="Mã Voucher"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Giảm giá (%)"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    required
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    variant="filled"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ngày hết hạn"
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                    variant="filled"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required variant="filled">
                    <InputLabel>Loại Voucher</InputLabel>
                    <Select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      label="Loại Voucher"
                    >
                      <MenuItem value="FREE">Miễn Phí</MenuItem>
                      <MenuItem value="POINTS">Tích Điểm</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {type === "POINTS" && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Số điểm yêu cầu"
                      type="number"
                      value={pointsRequired}
                      onChange={(e) => setPointsRequired(e.target.value)}
                      required
                      variant="filled"
                    />
                  </Grid>
                )}
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
                  Tạo Voucher
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for success or error messages */}
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

export default NewVoucher;
