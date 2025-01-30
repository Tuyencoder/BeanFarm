import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppBarComponent from "../../../../../../Components/AppBar/AppBar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { fetchOneOrderAPI } from "../../../../../../apis";
import Footer from "../../../../../../Components/Footer/Footer";
import ChatAI from "../../../../../../Components/ChatAI/ChatAI";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', '₫');
};

const formatDate = (dateString) => {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);
  return `${year}${month}${day}`;
};

const OrderInvoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await fetchOneOrderAPI(orderId);
        setOrder(response);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };

    getOrder();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>; // Render loading indicator while fetching data
  }

  const formattedTotal = formatCurrency(order.total);
  const formattedDate = formatDate(order.date);

  return (
    <>
      <AppBarComponent />
      <Container>
        <Typography variant="h6" component="div" marginTop="20px" sx={{ flexGrow: 1 }}>
          Chi tiết đơn hàng #{order.id}
        </Typography>
        <Box sx={{ my: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">
                Trạng thái thanh toán: <span style={{ color: 'orange' }}>{order.paymentStatus}</span>
              </Typography>
              <Typography variant="body1">
                Trạng thái vận chuyển: <span style={{ color: 'gray' }}><strong>Chưa chuyển</strong></span>
              </Typography>
              <Typography variant="body1">
                {order.date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, marginBottom: "50px" }}>
              <Box sx={{ flex: 1, mr: 2, minHeight: '100px' }}>
                <Typography variant="h6">Địa Chỉ Giao Hàng</Typography>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography>{order.customerName}</Typography>
                  <Typography>{order.address}</Typography>
                </Paper>
              </Box>
              <Box sx={{ flex: 1, mr: 2, minHeight: '100px' }}>
                <Typography variant="h6">Thanh Toán</Typography>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography>{order.paymentMethod || "Chuyển Khoản VNPAY"}</Typography>
                </Paper>
              </Box>
              <Box sx={{ flex: 1, minHeight: '100px' }}>
                <Typography variant="h6">Ghi Chú</Typography>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography>{order.note || "Không có ghi chú"}</Typography>
                </Paper>
              </Box>
            </Box>

            <TableContainer>
              <Table aria-label="order items table">
                <TableHead>
                  <TableRow>
                    <TableCell>Hình ảnh</TableCell>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Tổng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderDetails.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img src={item.product.image} alt={item.product.name} style={{ width: "100px", height: "100px" }} />
                      </TableCell>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{formatCurrency(item.product.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.product.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" fontSize="17px" marginTop="10px">
                  Khuyến mại: {order.discount ? formatCurrency(order.discount) : "Không có"}
                </Typography>
                <Typography variant="h5" fontSize="17px" marginTop="10px">
                  Phí vận chuyển: {formatCurrency(40000)} (Giao hàng tận nơi)
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Tổng tiền: <span style={{ color: 'red' }}>{formattedTotal}</span>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
      <ChatAI/>
      <Footer />
    </>
  );
};

export default OrderInvoice;
  