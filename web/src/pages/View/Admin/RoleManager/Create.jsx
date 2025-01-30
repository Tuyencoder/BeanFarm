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
import { CreateRoleAPI } from "../../../../apis";

const RoleCreate = ({ role }) => {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setIsActive(role.isActive || true);
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRole = {
        name,
        isActive,
      };

      const createdRole = await CreateRoleAPI(newRole);

      setSnackbar({
        open: true,
        message: "Role created successfully!",
        severity: "success",
      });

      // Optionally update the local state with the created role data
      // setName(createdRole.name);
      // setIsActive(createdRole.isActive);

      navigate("/admin/rolemanager");
    } catch (error) {
      console.error("Failed to create role:", error);
      setSnackbar({
        open: true,
        message: "Failed to create role.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/rolemanager");
  };

  return (
    <Dashboard>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Thêm vai trò
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
                  label="Tên vai trò"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                Thêm vai trò
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

export default RoleCreate;
