import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Typography,
  Grid, 
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Visibility, FilterList, GetApp } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';  
import Dashboard from '../index';
import CustomerEdit from './Edit'; // Ensure the correct import path
import { GetAllCustomerAPI } from '../../../../apis';

const CustomerIndex = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GetAllCustomerAPI()
      .then((data) => {
        const mappedCustomers = data.map((user) => ({
          id: user.id,
          joiningDate: user.createdAt.substring(0, 10), // Assuming createdAt is in ISO format
          name: user.username,
          email: user.email,
          address: '', // Placeholder for address data from API
          role: user.role,
        }));
        setCustomers(mappedCustomers);
        setFilteredCustomers(mappedCustomers);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setCustomers([]);
        setFilteredCustomers([]);
        setLoading(false);
      });
  }, []);

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter((cust) => cust.id !== customerToDelete.id)
    );
    setFilteredCustomers((prevCustomers) =>
      prevCustomers.filter((cust) => cust.id !== customerToDelete.id)
    );
    setConfirmDialogOpen(false);
    setCustomerToDelete(null);
    setSnackbar({
      open: true,
      message: 'Customer deleted successfully!',
      severity: 'success',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  const handleSave = (updatedCustomer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((cust) =>
        cust.id === updatedCustomer.id ? updatedCustomer : cust
      )
    );
    setFilteredCustomers((prevCustomers) =>
      prevCustomers.map((cust) =>
        cust.id === updatedCustomer.id ? updatedCustomer : cust
      )
    );
    setOpen(false);
    setSelectedCustomer(null);
    setSnackbar({
      open: true,
      message: 'Customer updated successfully!',
      severity: 'success',
    });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleFilter = () => {
    setFilteredCustomers(
      customers.filter(
        (cust) =>
          cust.name.toLowerCase().includes(filter.toLowerCase()) ||
          cust.email.toLowerCase().includes(filter.toLowerCase()) ||
          cust.phone.includes(filter)
      )
    );
  };

  const handleReset = () => {
    setFilter('');
    setFilteredCustomers(customers);
  };

  return (
    <Dashboard>
      <CustomerManager>
      <Typography variant="h6" style={{ marginBottom: 16 }}>
          Quản lý khách hàng
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tìm kiếm tên"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
               label="Lọc theo chức vụ"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={12} style={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              style={{ marginRight: 8 }}
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
            
          </Grid>
        </Grid>
        {loading ? (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        ) : (
          <TableContainer component={Paper} sx={{marginTop:'20px'}} >
            <StyledTable>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Mã</StyledTableCell>
                  <StyledTableCell>Tên</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Ngày Tham gia</StyledTableCell>
                  <StyledTableCell>Chức vụ</StyledTableCell>
                  <StyledTableCell>Tác vụ</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.joiningDate}</TableCell>
                    <TableCell>{customer.role?.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(customer)}>
                        <EditCalendarOutlinedIcon color="secondary" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(customer)}>
                        <DeleteOutlineOutlinedIcon color="error" />
                      </IconButton>
                      
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </TableContainer>
        )}
        <CustomerEdit
          open={open}
          onClose={handleClose}
          customer={selectedCustomer}
          onSave={handleSave}
        />
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this customer?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
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
      </CustomerManager>
    </Dashboard>
  );
};

export default CustomerIndex;

const StyledTable = styled(Table)`
  && {
    border-collapse: collapse;
  }
`;

const StyledTableCell = styled(TableCell)`
  && {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    vertical-align: middle;
  }
`;

const StyledTableRow = styled(TableRow)`
  &&:nth-of-type(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

const CustomerManager = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
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


const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;
