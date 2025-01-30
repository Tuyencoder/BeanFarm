import { useState, useEffect } from "react";
import styled from "styled-components";
import { formatDate} from '../../../../utils'
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
import {
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  EditCalendarOutlined as EditCalendarOutlinedIcon,
  FilterList,
  GetApp,
} from "@mui/icons-material";
import Dashboard from "../index";
import SupplierEdit from "../SupplierManager/Edit";

// Import API functions
import { fetchAllSuppliersAPI, deleteSuppliersAPI } from "../../../../apis";

const SupplierManager = styled.div`
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

const SupplierIndex = () => {
  const [suppliers, setsuppliers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingsupplier, setEditingsupplier] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletesupplierId, setDeletesupplierId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchName, setSearchName] = useState("");
  const [searchDescription, setSearchDescription] = useState("");

  useEffect(() => {
    // Fetch suppliers when component mounts
    fetchAllSuppliers();
  }, []);

  const fetchAllSuppliers = async () => {
    try {
      const response = await fetchAllSuppliersAPI(); 
      setsuppliers(response); 
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newsupplier = {
      id: String(suppliers.length + 1),
      name,
      description,
    };
    // For demo purposes, add the new supplier locally
    setsuppliers([...suppliers, newsupplier]);
    setName("");
    setDescription("");
    setSnackbar({
      open: true,
      message: "Thêm nhà cung cấp thành công!",
      severity: "success",
    });
  };

  const handleDeleteClick = (id) => {
    setDeletesupplierId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSuppliersAPI(deletesupplierId); // Replace with your delete API call
      const updatedsuppliers = suppliers.filter(
        (supplier) => supplier.id !== deletesupplierId
      );
      setsuppliers(updatedsuppliers);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: "Xóa nhà cung cấp thành công!",
        severity: "success",
      });
    } catch (error) {
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: error.response?.data,
        severity: "error",
      });
    }
  };

  const handleEdit = (supplier) => {
    setEditingsupplier(supplier);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = (editedsupplier) => {
    const updatedsuppliers = suppliers.map((supplier) =>
      supplier.id === editedsupplier.id ? editedsupplier : supplier
    );
    setsuppliers(updatedsuppliers);
    setEditingsupplier(null);
    setOpenEditDialog(false);
    setSnackbar({
      open: true,
      message: "Cập nhật nhà cung cấp thành công!",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };



  const handleResetSearch = () => {
    setSearchName("");
  };

  const filteredsuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <Dashboard>
      <SupplierManager>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          Nhà cung cấp sản phẩm
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tìm kiếm tên loại sản phẩm"
              variant="outlined"
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </Grid>
         
          <Grid item xs={12} sm={12} style={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              style={{ marginRight: 8 }}
              onClick={handleResetSearch}
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
              style={{ backgroundColor: "#4caf50" }}
              component={Link}
              to="/admin/suppliermanager/create"
            >
              Thêm nhà cung cấp mới
            </Button>
          </Grid>
        </Grid>

        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Tên loại sản phẩm</StyledTableCell>
                <StyledTableCell>Địa chỉ</StyledTableCell>
                <StyledTableCell>Số điện thoại</StyledTableCell>
                <StyledTableCell>Ngày Tạo</StyledTableCell>
                <StyledTableCell>Tác vụ</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filteredsuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.id}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{formatDate(supplier.createdAt)}</TableCell>
                  <TableCell>
                    <MuiIconButton onClick={() => handleEdit(supplier)}>
                      <EditCalendarOutlinedIcon color="secondary" />
                    </MuiIconButton>
                    <MuiIconButton
                      onClick={() => handleDeleteClick(supplier.id)}
                    >
                      <DeleteOutlineOutlinedIcon color="error" />
                    </MuiIconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </SupplierManager>

      {/* Edit supplier Dialog */}
      <SupplierEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        supplier={editingsupplier}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa loại sản phẩm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn xóa loại sản phẩm này?
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

export default SupplierIndex;
