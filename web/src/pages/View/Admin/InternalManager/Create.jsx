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
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { CreateInternalAPI, fetchAllRolesAPI } from "../../../../apis";
import Dashboard from "../index";
import { useDropzone } from "react-dropzone";

const InternalCreate = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(""); // Changed to store image as Data URL
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await fetchAllRolesAPI();
        setRoles(rolesData);
        if (rolesData.length > 0 && !role) {
          setRole(rolesData[0].id.toString());
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, [role]);

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
    const newInternal = {
      username: username,
      email: email,
      password: password,
      image: image, // Use Data URL for image
      role: {
        id: parseInt(role),
        name: roles.find(r => r.id.toString() === role)?.name || ""
      },
    };

    try {
      const requesterId = localStorage.getItem('id');
      await CreateInternalAPI(newInternal, requesterId);

      setSnackbar({
        open: true,
        message: "Thêm người dùng thành công!",
        severity: "success",
      });

      // Optionally reset form fields
      setUsername("");
      setEmail("");
      setPassword("");
      setImage(""); // Clear image
      setRole("");
      navigate("/admin/internalManager");
    } catch (error) {
      console.error("Error creating internal resource:", error);
      setSnackbar({
        open: true,
        message: "Quản lý chỉ được phép thêm thông tin của khách hàng.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/internalManager");
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
                Thêm Người Dùng
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
                    label="Tên người dùng"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mật Khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <FormControl fullWidth variant="filled" required>
                    <InputLabel id="role-label">Chức Vụ</InputLabel>
                    <Select
                      labelId="role-label"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                  Thêm Người Dùng
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

export default InternalCreate;
