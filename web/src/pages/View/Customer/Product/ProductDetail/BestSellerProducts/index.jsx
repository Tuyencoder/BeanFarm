import React, { useEffect, useState } from 'react'; 
import { Box, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import Slider from 'react-slick';
import { fetchAllProductsAPI, addToCartAPI } from '../../../../../../apis';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Utility function to check if the discount is expired
const isDiscountExpired = (expiryDate) => {
  return new Date(expiryDate) < new Date();
};

const BestSellerProducts = () => {
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  useEffect(() => {
    const fetchBestSellerProducts = async () => {
      try {
        const data = await fetchAllProductsAPI();
        setBestSellerProducts(data);
      } catch (error) {
        console.error('Error fetching best seller products:', error);
      }
    };

    fetchBestSellerProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Sản phẩm bán chạy
      </Typography>
      <Slider {...settings}>
        {bestSellerProducts.map((product) => {
          const isExpired = isDiscountExpired(product.discountExpiration);
          const discountAmount = product.price * (product.discount / 100);
          const discountedPrice = product.price - discountAmount;

          return (
            <Box key={product.id} sx={{ padding: 1, position: 'relative' }}>
              {/* Discount Label */}
              {!isExpired && product.discount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '30px',  // Rounded corners
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {product.discount}%
                </Box>
              )}

              <Card>
                <CardMedia
                  component="img"
                  alt={product.name}
                  image={product.image}
                  title={product.name}
                  sx={{ objectFit: 'contain', height: '200px', width: '100%' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '14px' }}>
                    {isExpired ? (
                      <span style={{ color: 'red' }}>
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                    ) : (
                      <>
                        <span style={{ textDecoration: 'line-through', color: '#999' }}>
                          {product.price.toLocaleString('vi-VN')}đ
                        </span>
                        <span style={{ color: 'red', marginLeft: 8 }}>
                          {discountedPrice.toLocaleString('vi-VN')}đ
                        </span>
                      </>
                    )}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#008b4b', color: '#fff', marginTop: 1 }}
                    onClick={() => addToCart(product.id)}
                  >
                    Thêm vào giỏ
                  </Button>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
};

const addToCart = async (productId) => {
  try {
    await addToCartAPI(productId, 1, localStorage.getItem('id'));
    alert('Đã thêm vào giỏ hàng');
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
  }
};

export default BestSellerProducts;
