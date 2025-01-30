import { useState, useEffect } from "react";
import styled from "styled-components";
import Dashboard from "../index";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import OrderDetail from "../OrderDetail/index";
import { formatDate } from "../../../../utils";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { fetchAllOrdersAPI, updateOrderAPI, deleteOrderAPI } from "../../../../apis";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
const OrderIndex = () => {

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    customerName: "",
    status: "",
    payment: "",
    startDate: "",
    endDate: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchAllOrdersAPI();
        const formattedOrders = response.map((order) => ({
          invoiceNo: order.id.toString(),
          orderTime: order.date,
          customerName: order.customerName,
          method: order.payment,
          address: order.address,
          amount: `${order.total.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}`,
          paymentStatus: order.paymentStatus,
          status: order.shippingStatus,
          vnpTxnRef: order.vnpTxnRef,
        }));
        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders); // Set filteredOrders initially with all orders
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleViewDetail = (order) => {
    setSelectedOrderId(order.invoiceNo);
  };

  const handleCloseDetail = () => {
    setSelectedOrderId(null);
  };
  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm]);

  const applyFilters = () => {
    let filtered = orders;

    if (filters.customerName) {
      filtered = filtered.filter((order) =>
        order.customerName
          .toLowerCase()
          .includes(filters.customerName.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    if (filters.payment) {
      filtered = filtered.filter((order) => order.method === filters.payment);
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.orderTime) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.orderTime) <= new Date(filters.endDate)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    setFilters({
      customerName: "",
      status: "",
      payment: "",
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");
    setFilteredOrders(orders); // Reset filteredOrders to show all orders
  };

 
  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setOpenConfirmDialog(true);
  };

  const confirmDeleteOrder = async () => {
    try {
      await deleteOrderAPI(orderToDelete.invoiceNo);
      setOrders((prevOrders) =>
        prevOrders.filter(
          (order) => order.invoiceNo !== orderToDelete.invoiceNo
        )
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.filter(
          (order) => order.invoiceNo !== orderToDelete.invoiceNo
        )
      );
      setSnackbar({
        open: true,
        message: "Đơn hàng đã được xóa thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to delete order", error);
      setSnackbar({
        open: true,
        message: "Xóa đơn hàng thất bại!",
        severity: "error",
      });
    } finally {
      setOpenConfirmDialog(false);
      setOrderToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStatusChange = async (invoiceNo, newStatus) => {
    try {
      const orderToUpdate = orders.find(
        (order) => order.invoiceNo === invoiceNo
      );
      if (!orderToUpdate) {
        throw new Error(
          `Order with invoice number ${invoiceNo} not found.`
        );
      }

      const orderTimeISO = new Date(orderToUpdate.orderTime)
        .toISOString()
        .split("T")[0];

      const updateData = {
        customerName: orderToUpdate.customerName,
        date: orderTimeISO,
        address: orderToUpdate.address,
        total: parseInt(orderToUpdate.amount.replace(/\D/g, ""), 10),
        payment: orderToUpdate.method,
        paymentStatus: orderToUpdate.paymentStatus,
        shippingStatus: newStatus,
        vnpTxnRef: orderToUpdate.vnpTxnRef,
      };

      // Call updateOrderAPI and pass updateData
      const updatedOrder = await updateOrderAPI(
        invoiceNo,
        updateData
      );

      // Update orders state to reflect the updated order
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.invoiceNo === invoiceNo
            ? { ...order, shippingStatus: newStatus }
            : order
        )
      );

      // Update filteredOrders state similarly
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.invoiceNo === invoiceNo
            ? { ...order, shippingStatus: newStatus }
            : order
        )
      );

      setSnackbar({
        open: true,
        message: "Cập nhật trạng thái đơn hàng thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to update order status", error);
      setSnackbar({
        open: true,
        message: "Cập nhật trạng thái đơn hàng thất bại!",
        severity: "error",
      });
    }
  };

  return (
    <Dashboard>
      <OrderManager>
        <Header>
          <Typography variant="h6" style={{ marginBottom: 16 }}>
            Quản lý hóa đơn
          </Typography>
          <button style={{ color: 'black' }}>Xuất đơn hàng</button>

        </Header>
        <FilterSection>
          <TextField
            fullWidth
            label="Tìm kiếm tên khách hàng"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Vận chuyển</option>
            <option value="Hủy bỏ">Hủy bỏ</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã giao hàng">Đã giao hàng</option>
          </select>
          <select
            name="payment"
            value={filters.payment}
            onChange={handleFilterChange}
          >
            <option value="">Phương thức</option>
            <option value="Chuyển khoản VNPay">Chuyển khoản</option>
            <option value="Thanh toán khi nhận hàng">Tiền mặt</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <button onClick={applyFilters} style={{ background: "#4caf50",color: 'black' }}>
            Lọc
          </button>
          <button style={{ whiteSpace: "nowrap" }} onClick={resetFilters}>
            Đặt lại
          </button>
        </FilterSection>
        <OrderTable>
        <TableHead>
            <TableRow>
              <TableCell>Mã </TableCell>
              <TableCell>Thời gian đặt hàng</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>PHƯƠNG THỨC</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Thanh Toán</TableCell>
              <TableCell>Vận chuyển</TableCell>
              <TableCell>Tác vụ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.invoiceNo}>
                <TableCell>{order.invoiceNo}</TableCell>
                <TableCell>{formatDate(order.orderTime)}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.method}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell className={`status ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</TableCell>
                <TableCell>
                  <select defaultValue={order.status} onChange={(e) => handleStatusChange(order.invoiceNo, e.target.value)}>
                    <option value={order.status}>{order.status}</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Hủy bỏ">Hủy bỏ</option>
                    <option value="Đã giao hàng">Đã giao hàng</option>
                  </select>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetail(order)}>
                    <VisibilityOutlinedIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteOrder(order)}>
                    <DeleteOutlineOutlinedIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </OrderTable>
        {selectedOrderId && (
          <OrderDetail orderId={selectedOrderId} onClose={handleCloseDetail} />
        )}
      </OrderManager>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Xóa đơn hàng</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa đơn hàng này?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmDeleteOrder} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
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

export default OrderIndex;



const OrderManager = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    margin: 0;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #28a745;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    opacity: 0.8;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input[type="text"],
  select,
  input[type="date"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #28a745;
    color: white;
    cursor: pointer;
  }

  button:last-child {
    background-color: #dc3545;
  }

  button:nth-last-child(2) {
    background-color: #007bff;
  }

  button:hover {
    opacity: 0.8;
  }
`;

const OrderTable = styled.table`
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

  
  .status.pending {
    color: #ffc107;
  }

  .status.cancel {
    color: #dc3545;
  }

  .status.processing {
    color: #17a2b8;
  }

  .status.delivered {
    color: #28a745;
  }

  select {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  color: #007bff;

  &:hover {
    opacity: 0.8;
  }
`;
