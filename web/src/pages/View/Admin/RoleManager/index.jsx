import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton as MuiIconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { DeleteOutlineOutlined as DeleteOutlineOutlinedIcon, EditCalendarOutlined as EditCalendarOutlinedIcon, FilterList, GetApp } from "@mui/icons-material";
import Dashboard from "../index";
import RoleEdit from "../RoleManager/Edit"; // Update with your RoleEdit component path

import { fetchAllRolesAPI, deleteRoleAPI } from "../../../../apis"; // Update with your API paths

const RoleManager = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;
const StyledTableContainer = styled(TableContainer)`
  margin-top: 16px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border: 1px solid #ccc;
    text-align: center;
  }

  th {
    background-color: #f8f9fa;
  }

  
`;

const StyledTableCell = styled(TableCell)`
  && {
    border: 1px solid #cccc;
    padding: 8px;
    text-align: center;
    vertical-align: middle;
  }
`;

const StyledTableRow = styled(TableRow)`
  &:not(:first-child) {
    &:hover {
      background-color: #f1f1f1;
      cursor: pointer;
    }
  }

  &:nth-of-type(even) {
    background-color: #f9f9f9;
  }
`;

const RoleIndex = () => {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    // Fetch roles when component mounts
    fetchAllRoles();
  }, []);

  const fetchAllRoles = async () => {
    try {
      const response = await fetchAllRolesAPI(); // Replace with your API call
      const sortedRoles = response.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setRoles(sortedRoles); // Assuming your API returns an array of roles // Assuming your API returns an array of roles
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRole = {
      id: String(roles.length + 1),
      name,
    };
    // For demo purposes, add the new role locally
    setRoles([...roles, newRole]);
    setName("");
    setSnackbar({
      open: true,
      message: "Thêm vai trò thành công!",
      severity: "success",
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteRoleId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRoleAPI(deleteRoleId); // Replace with your delete API call
      const updatedRoles = roles.filter(
        (role) => role.id !== deleteRoleId
      );
      setRoles(updatedRoles);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: "Xóa vai trò thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = (editedRole) => {
    const updatedRoles = roles.map((role) =>
      role.id === editedRole.id ? editedRole : role
    );
    setRoles(updatedRoles);
    setEditingRole(null);
    setOpenEditDialog(false);
    setSnackbar({
      open: true,
      message: "Cập nhật vai trò thành công!",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <Dashboard>
      <RoleManager>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          Quản lý vai trò
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tìm kiếm tên vai trò"
              variant="outlined"
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              style={{ marginRight: 8 }}
              onClick={() => setSearchName("")}
            >
              Đặt lại
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#4caf50" }}
              component={Link}
              to="/admin/rolemanager/create"
            >
              Thêm vai trò mới
            </Button>
          </Grid>
        </Grid>

        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Tên vai trò</StyledTableCell>
                <StyledTableCell>Tác vụ</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <MuiIconButton onClick={() => handleEdit(role)}>
                      <EditCalendarOutlinedIcon color="secondary" />
                    </MuiIconButton>
                    <MuiIconButton
                      onClick={() => handleDeleteClick(role.id)}
                    >
                      <DeleteOutlineOutlinedIcon color="error" />
                    </MuiIconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </RoleManager>

      {/* Edit Role Dialog */}
      <RoleEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        role={editingRole}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa vai trò</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa vai trò này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dashboard>
  );
};

export default RoleIndex;
