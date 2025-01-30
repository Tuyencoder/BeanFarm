import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  fetchCartItemsAPI,
  fetchAllVoucherForAccountAPI,
  addToOrderCustomerAPI,
  deleteCartItemAPI,
  initiateVNPAYPaymentAPI,
} from "../../../../apis";
import { useNavigate } from 'react-router-dom';
import qs from 'qs';

// Hàm kiểm tra nếu khuyến mãi đã hết hạn
const isDiscountExpired = (discountExpirationDate) => {
  return new Date() > new Date(discountExpirationDate);
};

// Hàm tính giá khuyến mãi hoặc giá gốc
const calculatePrice = (price, discount, isExpired) => {
  if (isExpired) return price;
  return price * (1 - discount / 100);
};

const CheckoutPage = () => {
  const [shippingMethod, setShippingMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("bankTransfer");
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    address: "",
    name: "",
    phone: "",
    note: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accountId = localStorage.getItem('id');
    fetchCartItemsAPI(accountId)
      .then(data => {
        setCartItems(data); 
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });

    fetchAllVoucherForAccountAPI(accountId)
      .then(data => {
        setVouchers(data);
      })
      .catch(error => {
        console.error('Error fetching vouchers:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handleApplyDiscount = () => {
    const selected = vouchers.find(v => v.code === selectedVoucher);
    if (selected) {
      const isExpired = isDiscountExpired(selected.expirationDate);
      if (!isExpired) {
        toast.success("Voucher applied successfully!");
      } else {
        toast.error("Voucher has expired.");
      }
    } else {
      toast.error("Invalid voucher code.");
    }
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    cartItems.forEach(item => {
        const isExpired = isDiscountExpired(item.product.discountExpiration);
        const price = isExpired 
            ? item.product.price // Giá gốc nếu khuyến mãi đã hết hạn
            : calculatePrice(item.product.price, item.product.discount, isExpired); // Giá đã giảm nếu còn hạn
        subtotal += price * item.quantity; // Tính tổng cho từng sản phẩm
    });
    return subtotal;
};

const applyVoucher = (subtotal, shippingFee) => {
  const selected = vouchers.find(v => v.code === selectedVoucher);
  if (selected) {
    console.log("Selected Voucher:", selected);
    if (selected.code.includes('FREESHIP')) {
      const shippingDiscount = (shippingFee * selected.discount) / 100;
      return { discountAmount: 0, shippingDiscount }; // Giảm giá cho phí vận chuyển
    } else {
      const discountAmount = (subtotal * selected.discount) / 100; // Giảm trên tổng tiền
      return { discountAmount, shippingDiscount: 0 };
    }
  }
  return { discountAmount: 0, shippingDiscount: 0 };
};
const calculateTotal = () => {
  const subtotal = calculateSubtotal();
  const shippingFee = 40000; // Giả sử phí vận chuyển là 40,000
  const totalBeforeDiscount = subtotal + shippingFee; // Tổng trước khi áp dụng giảm giá

  const { discountAmount, shippingDiscount } = applyVoucher(totalBeforeDiscount, shippingFee);
  const finalShippingFee = shippingFee - shippingDiscount; // Tính phí vận chuyển cuối cùng
  const total = totalBeforeDiscount - discountAmount; // Tính tổng cuối cùng

 
  return total;
};


console.log("calculateTotal:",calculateTotal())


  const handlePlaceOrder = () => {
    setLoading(true);
  
    // Đảm bảo selectedVoucher đã được gán giá trị
    const selectedVoucherCode = selectedVoucher; // Lưu mã voucher vào biến tạm thời
    const selectedVoucherData = vouchers.find(v => v.code === selectedVoucherCode);
  
    // Tính toán giá khuyến mãi cho từng sản phẩm
    const orderDetails = cartItems.map(item => {
      const isExpired = isDiscountExpired(item.product.discountExpiration);
      return {
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: calculatePrice(item.product.price, item.product.discount, isExpired),
          originalPrice: item.product.price,  // Thêm giá gốc
          discountPrice: calculatePrice(item.product.price, item.product.discount, isExpired), // Thêm giá khuyến mãi
          discountExpired: isExpired,  // Thêm thông tin về việc khuyến mãi đã hết hạn
        },
      };
    });
  
    // Thông tin về voucher được áp dụng
    const voucherInfo = selectedVoucherData ? {
      code: selectedVoucherData.code,
      discount: selectedVoucherData.discount,
      isExpired: isDiscountExpired(selectedVoucherData.expirationDate),
    } : null;
    const orderData = {

      customerName: customerInfo.name,
      date: new Date().toISOString(),
      address: customerInfo.address,
      total: calculateTotal(),
      paymentStatus: "Đã thanh toán",
      payment: paymentMethod === "bankTransfer" ? "Chuyển khoản VNPay" : "Thanh toán khi nhận hàng",
      shippingStatus: "Đang xử lý",
      account: {
        id: localStorage.getItem('id'),
        email: "tincui012gmail.com"
      },
      orderDetails: orderDetails,
      voucher: voucherInfo,  
    };
  
    console.log(orderData)
  
    if (paymentMethod === "bankTransfer") {
      // Call VNPAY API to initiate payment
      initiateVNPAYPaymentAPI(orderData)
        .then(paymentUrl => {
          window.location.href = paymentUrl; 
          const deletePromises = cartItems.map(item => deleteCartItemAPI(item.id));
          Promise.all(deletePromises)
            .then(() => {
              setCartItems([]);
            })
            .catch(error => {
              console.error('Error deleting cart items:', error);
              toast.error("Đã xảy ra lỗi khi xóa sản phẩm từ giỏ hàng.");
            });
        })
        .catch(error => {
          console.error('Error initiating VNPAY payment:', error);
          toast.error("Đã xảy ra lỗi khi khởi tạo thanh toán VNPAY.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Handle other payment methods (e.g., COD)
      addToOrderCustomerAPI(orderData)
        .then(response => {
          const { id: orderId } = response;
          toast.success("Đặt hàng thành công!");
          const queryString = qs.stringify({ orderData: encodeURIComponent(JSON.stringify({ ...orderData, orderId })) });
          navigate(`/customer/confirm?${queryString}`);
          const deletePromises = cartItems.map(item => deleteCartItemAPI(item.id));
          Promise.all(deletePromises)
            .then(() => {
              setCartItems([]);
            })
            .catch(error => {
              console.error('Error deleting cart items:', error);
              toast.error("Đã xảy ra lỗi khi xóa sản phẩm từ giỏ hàng.");
            });
  
          setShippingMethod("delivery");
          setPaymentMethod("bankTransfer");
          setSelectedVoucher("");
          setCustomerInfo({
            address: "Huỳnh Trọng Tín, Phường Tân Định, Quận 1, TP Hồ Chí Minh",
            name: "Huỳnh Trọng Tín",
            phone: "",
            note: "",
          });
        })
        .catch(error => {
          console.error('Error placing order:', error);
          toast.error("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  

  return (
    <Container>
      <Typography variant="body2" style={{ marginTop: 16, fontSize: "20px" }}>
        <a
          href="/customer/shoppingCart"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "#357ebd",
          }}
        >
          <ArrowBackIcon style={{ marginRight: 8, fontSize: "24px" }} /> Quay
          về giỏ hàng
        </a>
      </Typography>

      <Grid container spacing={2} style={{ marginTop: 16 }}>
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {/* Centered logo */}
          <img
            src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/logo.png?1718181939137"
            alt="Logo"
            style={{ height: 50 }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: 16 }}>
        <Grid item xs={12} sm={8}>
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Typography variant="h4" gutterBottom>
              Thông tin nhận hàng
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  label="Họ và tên"
                  fullWidth
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Số địa chỉ"
                  fullWidth
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Số điện thoại (tùy chọn)"
                  fullWidth
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ghi chú (tùy chọn)"
                  fullWidth
                  name="note"
                  value={customerInfo.note}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Typography variant="h4" fontSize="20px" gutterBottom>
              Vận chuyển
            </Typography>
            <RadioGroup
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
            >
              <FormControlLabel
                value="delivery"
                control={<Radio />}
                label="Giao hàng tận nơi (40.000đ)"
              />
            </RadioGroup>
          </Paper>

          <Paper style={{ padding: 16 }}>
            <Typography variant="h4" fontSize="20px" gutterBottom>
              Thanh toán
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="bankTransfer"
                control={<Radio />}
                label="Chuyển khoản (VNPAY)"
              />
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="Thu hộ (COD)"
              />
            </RadioGroup>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h4" fontSize="20px" gutterBottom>
              Đơn hàng ({cartItems.length} sản phẩm)
            </Typography>
            {cartItems.map((item, index) => {
              const isExpired = isDiscountExpired(item.product.discountExpiration);
              return (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  style={{ marginTop: 16, alignItems: "center" }}
                >
                  <Grid item xs={3}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="h6">{item.product.name}</Typography>
                    <Typography>
                      {isExpired
                        ? <span style={{ color: 'red' }}>
                            {(item.product.price).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        : (
                          <>
                            <span style={{ textDecoration: 'line-through', color: 'black' }}>
                              {item.product.price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                            <span style={{ color: 'red', marginLeft: 8 }}>
                              {calculatePrice(item.product.price, item.product.discount, false).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </>
                        )
                      }
                    </Typography>
                    <Typography>Số lượng: {item.quantity}</Typography>
                  </Grid>
                </Grid>
              );
            })}
{vouchers.length > 0 ? (
  <Grid container spacing={1} alignItems="center" style={{ marginTop: 16 }}>
    <Grid item xs={12}>
      <FormControl fullWidth>
        <Select
          value={selectedVoucher}
          onChange={(e) => setSelectedVoucher(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>Chọn voucher</MenuItem>
          <MenuItem value="none">Không áp dụng voucher</MenuItem> {/* Thêm lựa chọn không áp dụng voucher */}
          {vouchers
            .filter(voucher => !voucher.applied && voucher.active)
            .map((voucher) => (
              <MenuItem key={voucher.code} value={voucher.code}>
                {voucher.code} - {voucher.discount}% giảm giá
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12}>
      <Button
        variant="contained"
        fullWidth
        style={{ height: "45px", marginTop: 16 }}
        onClick={handleApplyDiscount}
      >
        Áp dụng
      </Button>
    </Grid>
  </Grid>
) : (
  <Typography variant="body1" color="textSecondary" style={{ marginTop: 16 }}>
    Bạn không có mã giảm giá nào.
  </Typography>
)}

            <Typography
              variant="h5"
              marginBottom="10px"
              fontSize="16px"
              style={{ marginTop: 16 }}
            >
              Tạm tính:{" "}
              <span style={{ color: "red" }}>
                {calculateSubtotal().toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </Typography>
            <Typography variant="h5" marginBottom="20px" fontSize="16px">
                Phí vận chuyển: 
                <span style={{ color: "red" }}>
                  {(40000 - applyVoucher(calculateSubtotal(), 40000).shippingDiscount).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </Typography>

            <Divider />
            <Typography variant="h5" marginTop="20px" fontSize="21px">
              Tổng tiền:{" "}
              <span style={{ color: "red" }}>
                {calculateTotal().toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 16, height: "40px" }}
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
