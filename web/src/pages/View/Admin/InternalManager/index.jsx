import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
  Snackbar,
  Alert,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Edit, Delete, Visibility, FilterList, GetApp } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import Dashboard from "../index";
import styled from "styled-components";
import InternalEdit from './Edit';
import { GetAllInternalAPI, deleteUserAPI } from '../../../../apis';

const index = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await GetAllInternalAPI();
        setUsers(response);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch users.",
          severity: "error",
        });
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (location.state && location.state.newUser) {
      const { newUser } = location.state;
      setUsers((prevUsers) => {
        if (prevUsers.find((user) => user.id === newUser.id)) {
          return prevUsers;
        }
        return [...prevUsers, newUser];
      });
      setSnackbar({
        open: true,
        message: "Thêm người dùng thành công!",
        severity: "success",
      });
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state, location.pathname]);

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleSave = (updatedUser) => {
    try{
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    setOpen(false);
    setCurrentUser(null);
    setSnackbar({
      open: true,
      message: "Cập nhật người dùng thành công!",
      severity: "success",
    });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Quản lý chỉ được phép thay đổi thông tin của khách hàng.",
        severity: "error",
      });
  };
}

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const requesterId = localStorage.getItem('id');

      await deleteUserAPI(userToDelete.id,requesterId); // Assuming deleteUserAPI takes user ID as argument
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );
      setConfirmDialogOpen(false);
      setUserToDelete(null);
      setSnackbar({
        open: true,
        message: "Xóa người dùng thành công!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Quản lý chỉ được phép xóa thông tin của khách hàng.",
        severity: "error",
      });
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filteredUsers to prioritize users with role "Quản trị viên" first
  filteredUsers.sort((a, b) => {
    if (a.role.name === "Quản Trị Viên") return -1;
    if (b.role.name === "Quản Trị Viên") return 1;
    return 0;
  });
  return (
    <Dashboard>
      <UserManager>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          Quản lý người dùng
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tìm kiếm..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} style={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              style={{ marginRight: 8 }}
              onClick={() => {
                setSearchTerm("");
              }}
            >
              Đặt lại
            </Button>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              style={{ marginRight: 8 }}
            >
              Xuất
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/admin/Internalmanager/create"
            >
              Thêm người dùng mới
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} style={{ marginTop: 16 }}>
          <StyledTable>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">ID</StyledTableCell>
                <StyledTableCell align="center">Hình ảnh</StyledTableCell>
                <StyledTableCell align="center">Tên người dùng</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Ngày tạo</StyledTableCell>
                <StyledTableCell align="center">Vai trò</StyledTableCell>
                <StyledTableCell align="center">Tác vụ</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user?.id}>
                  <TableCell align="center">
                    {user?.id}
                  </TableCell>
                  <TableCell align="center">
                    <img
                      src={user?.image}
                      alt={user?.username}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {user?.username}
                  </TableCell>
                  <TableCell align="center">
                    {user?.email}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {user?.role.name}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="secondary"
                      onClick={() => handleEditClick(user)}
                    >
                      <EditCalendarOutlinedIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </UserManager>
        <InternalEdit
        open={open}
        onClose={handleClose}
        user={currentUser}
        onSave={handleSave}
      />
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>Xóa người dùng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn chắc chắn muốn xóa người dùng này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
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
      {/* Add user edit dialog component here */}
    </Dashboard>
  );
};

// Styled components
const UserManager = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const StyledTableCell = styled(TableCell)`
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

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
`;

export default index;
