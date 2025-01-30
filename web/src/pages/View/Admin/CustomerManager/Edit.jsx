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

const CustomerEdit = ({ open, onClose, customer, onSave }) => {
  const [editedCustomer, setEditedCustomer] = useState(customer);

  useEffect(() => {
    setEditedCustomer(customer);
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedCustomer);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={3} width="450px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            Update Customer
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Update your Customer necessary information from here
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={editedCustomer?.name || ""}
          onChange={handleChange}
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
          variant="filled"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={editedCustomer?.email || ""}
          onChange={handleChange}
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
          variant="filled"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Phone"
          name="phone"
          value={editedCustomer?.phone || ""}
          onChange={handleChange}
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
          variant="filled"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Address"
          name="address"
          value={editedCustomer?.address || ""}
          onChange={handleChange}
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
          variant="filled"
        />
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button
            onClick={onClose}
            variant="outlined"
            style={{
              borderColor: "#ff4d4f",
              color: "#ff4d4f",
              padding: "10px 20px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#00b894",
              color: "white",
              padding: "10px 20px",
            }}
            onClick={handleSave}
          >
            Update Customer
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CustomerEdit;
