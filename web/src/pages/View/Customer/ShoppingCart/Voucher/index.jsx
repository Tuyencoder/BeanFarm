import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Typography,
  Divider,
  TextField,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import { fetchAllVoucherAPI, AccountApplyVoucherAPI, checkVoucherAppliedAPI } from '../../../../../apis';

const VoucherDialog = ({ open, onClose, onApplyVoucher }) => {
  const [manualVoucher, setManualVoucher] = useState('');
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [appliedVouchers, setAppliedVouchers] = useState(new Set());

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await fetchAllVoucherAPI();
        const now = new Date();
        
        // Lọc các voucher còn hiệu lực
        const validVouchers = data.filter((voucher) => {
          if (!voucher.expirationDate) return true; // Không có ngày hết hạn thì mặc định còn hiệu lực
          const expirationDate = new Date(voucher.expirationDate);
          return expirationDate >= now;
        });
  
        setAvailableVouchers(validVouchers);
  
        const accountId = localStorage.getItem('id');
        const appliedSet = new Set();
  
        // Check if each voucher is applied
        for (const voucher of validVouchers) {
          try {
            const response = await checkVoucherAppliedAPI(accountId, voucher.code);
            
            if (response === true) {
              appliedSet.add(voucher.code);
            }
          } catch (error) {
            console.error(`Error checking voucher ${voucher.code}:`, error);
          }
        }
  
        setAppliedVouchers(appliedSet);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        toast.error('Lỗi khi tải mã giảm giá');
      }
    };
  
    fetchVouchers();
  }, [open]);
  

  const handleApplyVoucher = async (voucherCode) => {
    if (!voucherCode) return;
  
    // Kiểm tra mã giảm giá có tồn tại trong availableVouchers hay không
    const voucher = availableVouchers.find((v) => v.code === voucherCode);
  
    if (!voucher) {
      toast.error('Mã giảm giá không hợp lệ');
      return;
    }
  
    if (appliedVouchers.has(voucherCode)) {
      toast.warning('Voucher đã được áp dụng hoặc đã sử dụng trước đó');
      setManualVoucher('');
      return;
    }
  
    try {
      const accountId = localStorage.getItem('id');
      const response = await AccountApplyVoucherAPI(accountId, voucherCode);
  
      // Xử lý nếu voucher không thể áp dụng được
      if (response === false) {
        toast.warning('Voucher không thể áp dụng');
        return;
      }
  
      onApplyVoucher(voucherCode);
      setAppliedVouchers((prev) => new Set(prev).add(voucherCode));
    } catch (error) {
      console.error('Error applying voucher:', error);
      toast.error('Lỗi khi áp dụng mã giảm giá');
    }
  
    setManualVoucher('');
    onClose();
  };
  

  const handleCopyVoucher = async (code) => {
    if (appliedVouchers.has(code)) {
      toast.warning('Voucher đã được áp dụng hoặc đã sử dụng trước đó');
      return;
    }
  
    navigator.clipboard.writeText(code);
  
    try {
      const accountId = localStorage.getItem('id');
      await AccountApplyVoucherAPI(accountId, code);
  
      toast.success(`Đã sao chép và áp dụng mã: ${code}`);
      setAppliedVouchers((prev) => new Set(prev).add(code));
    } catch (error) {
      toast.error('Lỗi khi áp dụng mã giảm giá');
    }
  };
  
  const freeVouchers = availableVouchers.filter(voucher => voucher.type === 'FREE')
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Mã Khuyến Mãi
        <IconButton
          style={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {freeVouchers.map((voucher) => (
            <React.Fragment key={voucher.code}>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={2}>
                    <Typography variant="h6" style={{ color: 'green', fontWeight: 'bold' }}>
                      {voucher.code === 'FREESHIP' ? '0K' : voucher.code.replace(/\D/g, '')}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Mã giảm giá {voucher.code}
                    </Typography>
                    <Typography variant="body2">{voucher.description}</Typography>
                    {appliedVouchers.has(voucher.code) && (
                      <Typography variant="body2" color="success.main">
                        Đã lưu
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    {appliedVouchers.has(voucher.code) ? (
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        disabled
                      >
                        Đã lưu
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => handleCopyVoucher(voucher.code)}
                        endIcon={<ContentCopyIcon />}
                      >
                        Sao chép
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <Button color="primary" href='/Customer/Voucher'>Tìm kiếm voucher khác</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleApplyVoucher(manualVoucher)} variant="contained" color="primary">
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherDialog;
