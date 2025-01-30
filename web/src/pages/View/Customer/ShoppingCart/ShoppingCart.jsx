import React, { useState, useEffect } from "react";
import AppBarComponent from "../../../../Components/AppBar/AppBar";
import Footer from "../../../../Components/Footer/Footer";
import {
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCartItemsAPI, updateCartItemAPI, deleteCartItemAPI, fetchAllVoucherAPI } from '../../../../apis';
import { toast } from 'react-toastify';
import ChatAI from '../../../../Components/ChatAI/ChatAI';
import VoucherDialog from "./Voucher";

// Hàm kiểm tra nếu khuyến mãi đã hết hạn
const isDiscountExpired = (discountExpirationDate) => {
  return new Date() > new Date(discountExpirationDate);
};

// Hàm kiểm tra nếu voucher đã hết hạn
const isVoucherExpired = (expirationDate) => {
  return new Date() > new Date(expirationDate);
};

const ShoppingCart = () => {
  const [products, setProducts] = useState([]);
  const [vouchers, setVouchers] = useState([]); // State to store fetched vouchers
  const [openVoucherDialog, setOpenVoucherDialog] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState('');
  const accountId = localStorage.getItem('id');

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const data = await fetchCartItemsAPI(accountId);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error("Lỗi khi tải sản phẩm trong giỏ hàng");
    }
  };

const fetchVouchers = async () => {
  try {
    const data = await fetchAllVoucherAPI();
    // Lọc voucher hết hạn và có type là 'FREE'
    const validVouchers = data.filter(voucher => 
      !isVoucherExpired(voucher.expirationDate) && voucher.type === 'FREE'
    );
    setVouchers(validVouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    toast.error("Lỗi khi tải mã giảm giá");
  }
};

  useEffect(() => {
    fetchCartItems();
    fetchVouchers();
  }, [accountId]);

  // Update cart items
  const updateCartItems = async () => {
    try {
      const data = await fetchCartItemsAPI(accountId);
      setProducts(data);
    } catch (error) {
      console.error('Error updating cart items:', error);
      toast.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng");
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (id, delta) => {
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        const newQuantity = product.quantity + delta;
        return {
          ...product,
          quantity: newQuantity > 0 ? newQuantity : 1
        };
      }
      return product;
    });

    setProducts(updatedProducts);

    try {
      await updateCartItemAPI(id, updatedProducts.find(p => p.id === id).quantity);
      updateCartItems();
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error("Lỗi khi cập nhật số lượng sản phẩm");
    }
  };

  // Handle remove product
  const handleRemoveProduct = async (id) => {
    try {
      await deleteCartItemAPI(id);
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      toast.success("Xóa sản phẩm thành công");
      updateCartItems();
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  // Handle open voucher dialog
  const handleOpenVoucherDialog = () => {
    setOpenVoucherDialog(true);
  };

  // Handle close voucher dialog
  const handleCloseVoucherDialog = () => {
    setOpenVoucherDialog(false);
  };

  // Handle apply voucher
  const handleApplyVoucher = (voucherCode) => {
    setAppliedVoucher(voucherCode);
    // Xử lý logic áp dụng mã giảm giá vào giỏ hàng
    toast.success(`Áp dụng mã giảm giá: ${voucherCode}`);
  };

  return (
    <>
      <AppBarComponent updateCartItems={updateCartItems} />
      <Container>
        <Typography variant="h4" gutterBottom>
          Giỏ hàng
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper style={{ padding: 16 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <Typography variant="h6" fontSize="16px" style={{ minWidth: 150 }}>
                    Thông tin sản phẩm
                  </Typography>
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={2.5}>
                  <Typography variant="h6" fontSize="16px">Đơn giá</Typography>
                </Grid>
                <Grid item xs={2.5}>
                  <Typography variant="h6" fontSize="16px">Số lượng</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="h6" fontSize="16px">Thành tiền</Typography>
                </Grid>
              </Grid>
              <Divider />
              {products.map((product, index) => (
                <div key={product.id}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                      <img
                        src={product.product.image}
                        alt={product.product.name}
                        style={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>{product.product.name}</Typography>
                      <Button startIcon={<DeleteIcon />} onClick={() => handleRemoveProduct(product.id)}>Xóa</Button>
                    </Grid>
                    <Grid item xs={2}>
                      <div>
                        {isDiscountExpired(product.product.discountExpiration) ? (
                          <Typography style={{ color: 'red' }}>
                            {product.product.price ? product.product.price.toLocaleString() + '₫' : 'Giá không có sẵn'}
                          </Typography>
                        ) : (
                          <>
                            <Typography style={{ textDecoration: 'line-through', color: 'gray' }}>
                              {product.product.price ? product.product.price.toLocaleString() + '₫' : 'Giá không có sẵn'}
                            </Typography>
                            <Typography style={{ color: 'red' }}>
                              {((product.product.price * (1 - product.product.discount / 100)) || 0).toLocaleString() + '₫'}
                            </Typography>
                          </>
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton onClick={() => handleQuantityChange(product.id, -1)}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <TextField 
                        value={product.quantity} 
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) - product.quantity)}
                        size="small" 
                        style={{ width: '50px', textAlign: 'center' }} 
                      />
                      <IconButton onClick={() => handleQuantityChange(product.id, 1)}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography style={{ color: 'red' }}>
                        {product.quantity && product.product.discount && !isDiscountExpired(product.product.discountExpiration)
                          ? (product.product.price * product.quantity * (1 - product.product.discount / 100)).toLocaleString() + '₫'
                          : product.quantity && product.product.price
                          ? (product.product.price * product.quantity).toLocaleString() + '₫'
                          : 'Tổng không có sẵn'}
                      </Typography>
                    </Grid>
                  </Grid>
                  {index < products.length - 1 && <Divider style={{ margin: '16px 0' }} />}
                </div>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6">Thời gian giao hàng</Typography>
              <TextField
                label="Chọn ngày"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                style={{ marginTop: 16 }}
              />
              <TextField
                label="Chọn thời gian"
                select
                SelectProps={{ native: true }}
                fullWidth
                style={{ marginTop: 16 }}
              >
                <option value="" />
                <option value="All day">Cả ngày</option>
                <option value="morning">Buổi sáng</option>
                <option value="afternoon">Buổi chiều</option>
              </TextField>
              <FormControlLabel
                control={<Checkbox name="invoice" />}
                label="Xuất hóa đơn công ty"
                style={{ marginTop: 16 }}
              />
              <Typography variant="h6" fullWidth style={{ marginTop: 16, fontSize: '1.2rem' }}>Các mã giảm giá có thể áp dụng:</Typography>
              {vouchers.map(voucher => (
                <Button
                  key={voucher.code}
                  variant="outlined"
                  onClick={() => handleOpenVoucherDialog()}
                  style={{ margin: 4, border: '2px dashed #008b4b', fontSize: '0.8rem' }}
                >
                  {voucher.code}
                </Button>
              ))}
              <Typography variant="h6" style={{ marginTop: 16, color: 'red' }}>
                Tổng tiền: {products.reduce((total, product) => 
                  total + (product.product.price * product.quantity * (1 - (isDiscountExpired(product.product.discountExpiration) ? 0 : (product.product.discount || 0) / 100)) || 0), 0
                ).toLocaleString()}₫
              </Typography>
              <Button variant="contained" color="primary" href="/customer/checkout" fullWidth style={{ marginTop: 16 }}>
                Thanh toán
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <VoucherDialog 
        open={openVoucherDialog} 
        onClose={handleCloseVoucherDialog} 
        onApplyVoucher={handleApplyVoucher} 
        vouchers={vouchers} // Pass vouchers to the dialog
      />
      <ChatAI />
      <Footer />
    </>
  );
};

export default ShoppingCart;
