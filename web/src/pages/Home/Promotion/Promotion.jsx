import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { fetchAllDiscountsAPI, addToCartAPI } from '../../../apis';

// Hàm tính toán giá khuyến mãi
const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toLocaleString('vi-VN');
};

// Hàm tính thời gian đếm ngược
const calculateTimeLeft = (endDate) => {
  // Lấy thời gian hiện tại với GMT+7, không dùng toLocaleString
  const now = new Date();
  const vietnamTimeOffset = 7 * 60; // GMT+7 (chênh lệch tính bằng phút)
  const nowInVietnamTime = new Date(now.getTime() + (now.getTimezoneOffset() + vietnamTimeOffset) * 60 * 1000);


  const difference = +new Date(endDate) - +nowInVietnamTime;
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
      hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
      minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
    };
  }

  
  return timeLeft;
};




const Promotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetchAllDiscountsAPI();
        const data = response || [];

        if (Array.isArray(data)) {
          const currentDate = new Date();
          const filteredPromotions = data.filter(item => !item.discountExpiration || new Date(item.discountExpiration) > currentDate);
          setPromotions(filteredPromotions);

          if (filteredPromotions.length > 0 && filteredPromotions[0].discountExpiration) {
            // Tính thời gian đếm ngược cho sản phẩm đầu tiên
            setTimeLeft(calculateTimeLeft(filteredPromotions[0].discountExpiration));
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu khuyến mãi:', error);
      }
    };

    fetchDiscounts();
  }, []); // Chỉ chạy lần đầu khi component mount

  useEffect(() => {
    const timer = setInterval(() => {
      if (promotions.length > 0 && promotions[0].discountExpiration) {
        setTimeLeft(calculateTimeLeft(promotions[0].discountExpiration));
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval khi component bị hủy
  }, [promotions]); // Sẽ chỉ chạy khi promotions thay đổi

  const quantity = 1;
  // Hàm thêm vào giỏ hàng
  const handleAddToCart = async (productId) => {
    try {
      await addToCartAPI(productId, quantity, localStorage.getItem('id')); // Gọi API để thêm vào giỏ hàng
      alert('Sản phẩm đã được thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      {/* Tiêu đề và thời gian */}
      <Box sx={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#008b4b', padding: '15px' }}>
        <Box>
          <Typography variant="h5" component="div" sx={{ fontSize: '30px', fontWeight: 'bold', color: '#f8c144', mb: 1 }}>
            Khuyến mãi đặc biệt <img width="32" height="32" src="//bizweb.dktcdn.net/100/514/629/themes/951567/assets/flash.png?1716945232631" alt="Khuyến mãi đặc biệt" />
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '16px', fontWeight: 'bold', color: '#ffff' }}>
            Đừng bỏ lỡ cơ hội giảm giá đặc biệt!
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '5px', borderRadius: '5px' }}>
          {/* Hiển thị thời gian khuyến mãi */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px' }}>
            <Typography variant="h6">{timeLeft.days || '00'}</Typography>
            <span>Ngày</span>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px' }}>
            <Typography variant="h6">{timeLeft.hours || '00'}</Typography>
            <span>Giờ</span>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px' }}>
            <Typography variant="h6">{timeLeft.minutes || '00'}</Typography>
            <span>Phút</span>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">{timeLeft.seconds || '00'}</Typography>
            <span>Giây</span>
          </Box>
        </Box>
      </Box>

      {/* Hiển thị sản phẩm khuyến mãi */}
      <Grid container spacing={3} sx={{ marginLeft: "2px", backgroundColor: '#fff', border: '2px dashed #008b4b', maxWidth: "100%" }}>
        {promotions.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', py: 3 }}>
            Không có sản phẩm khuyến mãi
          </Typography>
        ) : (
          promotions.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', backgroundColor: '#fff' }}>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ flex: 1 }}>
                    {/* Hiển thị hình ảnh sản phẩm */}
                    <CardMedia
                      component="img"
                      alt={item.name}
                      height="200"
                      image={item.image}
                      title={item.name}
                      sx={{
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#fff',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    />
                    <Box sx={{ position: 'absolute', top: '10px', left: '10px', background: 'red', color: '#fff', padding: '6px', borderRadius: '100px' }}>
                      {item.discount}%
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <CardContent>
                      {/* Hiển thị thông tin sản phẩm */}
                      <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '18px', fontWeight: 'bold' }}>
                        <a href="#" title={item.name} style={{ textDecoration: 'none', color: 'inherit' }}>{item.name}</a>
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ fontSize: '16px', color: '#f00' }}>
                        {calculateDiscountedPrice(item.price, item.discount)}₫ <span style={{ textDecoration: 'line-through', color: '#999' }}>{item.price.toLocaleString('vi-VN')}₫</span>
                      </Typography>

                      <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#008000', color: '#fff', fontSize: '14px' }}
                        onClick={() => handleAddToCart(item.id)} // Gọi hàm thêm vào giỏ hàng
                      >
                        Thêm vào giỏ
                      </Button>
                    </CardContent>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Promotion;
