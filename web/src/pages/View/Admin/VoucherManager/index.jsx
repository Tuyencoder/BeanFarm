import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatDate } from "../../../../utils";
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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Edit, Delete, FilterList, GetApp } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import styled from "styled-components";
import Dashboard from "../index";
import VoucherEdit from "./Edit";
import { fetchAllVoucherAPI, deleteVoucherAPI } from "../../../../apis";

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetchAllVoucherAPI();
        setVouchers(response);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch vouchers.",
          severity: "error",
        });
      }
    };

    fetchVouchers();
  }, []);

  const handleEditClick = (voucherItem) => {
    setCurrentVoucher(voucherItem);
    setOpen(true);
  };

  const handleDeleteClick = (voucherItem) => {
    setVoucherToDelete(voucherItem);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteVoucherAPI(voucherToDelete.id);
      setVouchers((prevVouchers) =>
        prevVouchers.filter((voucherItem) => voucherItem.id !== voucherToDelete.id)
      );
      setConfirmDialogOpen(false);
      setVoucherToDelete(null);
      setSnackbar({
        open: true,
        message: "Voucher deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete voucher.",
        severity: "error",
      });
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setVoucherToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentVoucher(null);
  };

  const handleSave = async (updatedVoucher) => {
    try {
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          voucher.id === updatedVoucher.id ? updatedVoucher : voucher
        )
      );
      setOpen(false);
      setSnackbar({
        open: true,
        message: "Voucher updated successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update voucher.",
        severity: "error",
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVouchers = vouchers.filter((voucherItem) =>
    voucherItem.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dashboard>
      <VoucherManagerContainer>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          Quản lý Phiếu giảm giá
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tìm kiếm mã..."
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
              onClick={() => setSearchTerm("")}
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
              to="/admin/vouchermanager/create"
            >
              Thêm phiếu giảm giá 
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} style={{ marginTop: 16 }}>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Mã</TableCell>
                <TableCell align="center">Giảm giá (%)</TableCell>
                <TableCell align="center">Ngày hết hạn</TableCell>
                <TableCell align="center">Mô tả</TableCell>
                <TableCell align="center">Loại Voucher</TableCell> {/* Added column for type */}
                <TableCell align="center">Kích hoạt</TableCell>
                <TableCell align="center">Tác vụ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVouchers.map((voucherItem) => (
                <TableRow key={voucherItem.id}>
                  <TableCell align="center">{voucherItem.id}</TableCell>
                  <TableCell align="center">{voucherItem.code}</TableCell>
                  <TableCell align="center">{voucherItem.discount}</TableCell>
                  <TableCell align="center">{formatDate(voucherItem.expirationDate)}</TableCell>
                  <TableCell align="center">{voucherItem.description}</TableCell>
                  <TableCell align="center">
                    {voucherItem.type === "POINTS" ? (
                      `Tích điểm - ${voucherItem.pointsRequired} điểm`
                    ) : (
                      "Miễn phí"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={voucherItem.active}
                          onChange={(e) => {
                            const updatedVoucher = { ...voucherItem, active: e.target.checked };
                            handleSave(updatedVoucher);
                          }}
                          color="primary"
                        />
                      }
                      label={voucherItem.active ? "Hoạt động" : "Không hoạt động"}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="secondary"
                      onClick={() => handleEditClick(voucherItem)}
                    >
                      <EditCalendarOutlinedIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(voucherItem)}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>

        {/* Confirm delete dialog */}
        <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
          <DialogTitle>Xóa voucher</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn chắc chắn muốn xóa voucher này?
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

        {/* Snackbar */}
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

        {/* Voucher edit dialog */}
        <VoucherEdit
          open={open}
          onClose={handleClose}
          voucherItem={currentVoucher} // Sử dụng đúng thuộc tính
          onSave={handleSave}
        />
      </VoucherManagerContainer>
    </Dashboard>
  );
};

// Styled components
const VoucherManagerContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
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

export default VoucherManager;
