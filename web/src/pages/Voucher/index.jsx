import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, Box, LinearProgress } from '@mui/material';
import { fetchAllVoucherAPI, fetchUserInfoAPI, AccountApplyVoucherAPI, checkVoucherAppliedAPI } from '../../apis';
import AppBarComponent from '../../Components/AppBar/AppBar';
import { useAuth } from '../../Components/Account/AuthContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs'; 

const Voucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [appliedVouchers, setAppliedVouchers] = useState(new Set()); // Lưu trữ các voucher đã được áp dụng
    const { userId } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const voucherData = await fetchAllVoucherAPI();
                setVouchers(voucherData);

                // Kiểm tra các voucher đã được lưu
                const accountId = localStorage.getItem('id');
                const applied = new Set();
                for (let voucher of voucherData) {
                    const isVoucherApplied = await checkVoucherAppliedAPI(accountId, voucher.code);
                    if (isVoucherApplied) {
                        applied.add(voucher.code);
                    }
                }
                setAppliedVouchers(applied);
              
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
   
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const id = localStorage.getItem('id');
                const userData = await fetchUserInfoAPI(id);
                setUserInfo(userData);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            }
        };
        fetchUserInfo();
    }, [userId]);

    const handleApplyVoucher = async (voucherCode) => {
        try {
            const accountId = localStorage.getItem('id');
            const isVoucherApplied = await checkVoucherAppliedAPI(accountId, voucherCode);
            if (isVoucherApplied) {
                toast.warning('Voucher đã được áp dụng.');
                return;
            }

            const response = await AccountApplyVoucherAPI(accountId, voucherCode);
            if (response === false) {
                toast.warning('Voucher không thể áp dụng');
                return;
            } else {
                toast.success('Voucher đã được lưu và áp dụng thành công!');
                setAppliedVouchers(prev => new Set(prev.add(voucherCode))); 
                const updatedUserInfo = await fetchUserInfoAPI(accountId);
                setUserInfo(updatedUserInfo);// Cập nhật voucher đã áp dụng
            }
        } catch (error) {
            console.error('Lỗi khi áp dụng voucher:', error);
            alert('Có lỗi xảy ra khi áp dụng voucher.');
        }
    };

   

    const freeVouchers = vouchers.filter(voucher => voucher.type === 'FREE' && voucher.valid);
    const pointsVouchers = vouchers.filter(voucher => voucher.type === 'POINTS' && voucher.valid);
    
    const isVoucherExpired = (expirationDate) => {
        return dayjs(expirationDate).isBefore(dayjs(), 'day'); // Kiểm tra nếu ngày hết hạn đã qua
    };

    return (
        <>
            <AppBarComponent />
            <Box sx={{ backgroundColor: '#f4f4f4', minHeight: '100vh', padding: 2 }}>
                {/* Add Banner here */}
                <Box sx={{ marginBottom: 4 }}>
                <img 
                src="https://www.bigc.vn/files/banners/2023/jan/megatet-sale-1080x540-go.jpg"
                alt="Voucher Banner"
                style={{ 
                    width: '100%', 
                    height: '260px', // Ensures the aspect ratio is preserved
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    objectFit: 'cover' // Ensures the image covers the space without distorting
                }}
            />

                </Box>

                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Voucher Miễn Phí
                </Typography>
                <Grid container spacing={2}>
                    {freeVouchers.map((voucher) => (
                        <Grid item xs={12} sm={6} md={4} key={voucher.id}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: 3,
                                    position: 'relative',
                                    maxWidth: 500,
                                    height: '150px',
                                    '&:hover': { transform: 'scale(1.05)' },
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: '#3e8e41',
                                        width: '33.33%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: 'white',
                                        padding: 1,
                                        position: 'relative',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            backgroundColor: 'red',
                                            borderRadius: '4px',
                                            padding: '2px 6px',
                                            fontSize: '12px',
                                            position: 'absolute',
                                            top: '8px',
                                            left: '8px',
                                        }}
                                    >
                                        khuyến mãi miễn phí
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                                    {voucher.code}
                                    </Typography>
                                </Box>

                                <CardContent sx={{ flex: 1, padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                                            {voucher.code}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Phần trăm khuyến mãi: {voucher.discount}%
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                        Ngày hết hạn: {dayjs(voucher.expirationDate).format('DD/MM/YYYY')}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                                        {/* Kiểm tra nếu voucher đã hết hạn hoặc đã được lưu */}
                                        {isVoucherExpired(voucher.expirationDate) ? (
                                            <Typography variant="body2" color="error">Voucher đã hết hạn</Typography>
                                        ) : appliedVouchers.has(voucher.code) ? (
                                            <Button variant="contained" disabled sx={{ backgroundColor: 'gray', color: 'white' }}>
                                                Đã lưu
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: '#008b4b',
                                                    color: 'white',
                                                    '&:hover': { backgroundColor: '#00793e' },
                                                }}
                                                onClick={() => handleApplyVoucher(voucher.code)}
                                            >
                                                Lưu
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
                    Voucher Tích Điểm
                </Typography>
                <Grid container spacing={2}>
                    {pointsVouchers.map((voucher) => (
                        <Grid item xs={12} sm={6} md={4} key={voucher.id}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: 3,
                                    position: 'relative',
                                    maxWidth: 500,
                                    height: '150px',
                                    '&:hover': { transform: 'scale(1.05)' },
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: '#3e8e41',
                                        width: '33.33%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: 'white',
                                        padding: 1,
                                        position: 'relative',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            backgroundColor: 'red',
                                            borderRadius: '4px',
                                            padding: '2px 6px',
                                            fontSize: '12px',
                                            position: 'absolute',
                                            top: '8px',
                                            left: '8px',
                                        }}
                                    >
                                        khuyến mãi tích điểm
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                                        {voucher.code}
                                    </Typography>
                                </Box>

                                <CardContent sx={{ flex: 1, padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                                            {voucher.code}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Phần trăm khuyến mãi: {voucher.discount}%
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                        Ngày hết hạn: {dayjs(voucher.expirationDate).format('DD/MM/YYYY')}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Điểm của bạn: {userInfo?.points || 0} / {voucher.pointsRequired}
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min((userInfo?.points || 0) / voucher.pointsRequired * 100, 100)}
                                            sx={{ height: 8, borderRadius: 4 }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                                        {appliedVouchers.has(voucher.code) ? (
                                            <Button variant="contained" disabled sx={{ backgroundColor: 'gray', color: 'white' }}>
                                                Đã lưu
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                disabled={(userInfo?.points || 0) < voucher.pointsRequired}
                                                sx={{
                                                    backgroundColor: (userInfo?.points || 0) >= voucher.pointsRequired ? '#008b4b' : 'gray',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: (userInfo?.points || 0) >= voucher.pointsRequired ? '#00793e' : 'gray',
                                                    },
                                                }}
                                                onClick={() => handleApplyVoucher(voucher.code)}
                                            >
                                                Quy đổi
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default Voucher;
