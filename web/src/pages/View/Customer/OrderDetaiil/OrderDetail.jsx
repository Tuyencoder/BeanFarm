import React, { useState, useEffect } from "react";
import AppBarComponent from "../../../../Components/AppBar/AppBar";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Footer from "../../../../Components/Footer/Footer";
import { fetchAllOrdersCustomerAPI } from "../../../../apis"; 
import ChatAI from '../../../../Components/ChatAI/ChatAI';

const OrderDetail = ({ accountId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const accountId = localStorage.getItem('id');
        const response = await fetchAllOrdersCustomerAPI(accountId);
        setOrders(response);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    getOrders();
  }, [accountId]);
  const formatDate = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}${month}${day}`;
  };
  const getPaymentColor = (status) => {
    return status === "Chưa thanh toán" ? "#FF9933" : "#4caf50";
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', '₫');
  };
  
  return (
    <>
      <AppBarComponent />
      <Container>
        <Typography variant="h6" component="div" marginTop="20px" sx={{ flexGrow: 1 }}>
          ĐƠN HÀNG CỦA BẠN
        </Typography>
        <Box sx={{ my: 4 }}>
          <TableContainer component={Paper}>
            <Table aria-label="order details table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#008b4b" }}>
                  <TableCell sx={{ color: "#fff" }}>Đơn hàng</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Ngày</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Địa chỉ</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Giá trị đơn hàng</TableCell>
                  <TableCell sx={{ color: "#fff" }}>TT thanh toán</TableCell>
                  <TableCell sx={{ color: "#fff" }}>TT vận chuyển</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/customer/OrderDetail/${order.id}`}>#{order.id}</Link>
                    </TableCell>
                    <TableCell>{(order.date)}</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>{order.total}đ</TableCell>
                    <TableCell style={{ color: getPaymentColor(order.paymentStatus) }}>{order.paymentStatus}</TableCell>
                    <TableCell>{order.shippingStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
      <ChatAI/>
      <Footer />
    </>
  );
};

export default OrderDetail;
