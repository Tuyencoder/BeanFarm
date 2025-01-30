import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Components/Account/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Profiles from './Menus/Profiles';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { fetchCartItemsAPI } from '../../apis';
import { Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton as MuiIconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  borderRadius: theme.shape.borderRadius,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '45ch',
    },
  },
}));

const LogoImage = styled('img')({
  maxHeight: '50px',
  marginRight: '20px',
});

const AppBarComponent = ({ updateCartItems }) => {
  const { isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await fetchCartItemsAPI(localStorage.getItem('id'));
        setCartItems(data);
        
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [updateCartItems]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" sx={{ background: '#f2f3f4' }} elevation={0}>
        <Toolbar>
          <LogoImage src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/logo.png?1718181939137" alt="Logo"  />
          <Search sx={{ backgroundColor: 'white' }}>
            <SearchIconWrapper sx={{ backgroundColor: 'white' }}>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Bạn muốn tìm gì?"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <div style={{ flexGrow: 1 }} />
          <Button color="inherit" href='/'>Trang chủ</Button>
          <Button color="inherit" href='/Introduce'>Giới thiệu</Button>
          <Button color="inherit" href='/Customer/Product'>Sản phẩm</Button>
          <Button color="inherit" href='/Customer/Voucher'>Khuyến mãi</Button>
          <Button color="inherit" href='/News' >Tin tức</Button>
          <Button color="inherit" href='/ContactPage'>Liên hệ</Button>
          <IconButton color="inherit">
            <Badge badgeContent={0} color="success">
              <FavoriteBorderOutlinedIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" href='/customer/ShoppingCart'>
            <Badge badgeContent={cartItems.length} color="success">
              <ShoppingBagOutlinedIcon />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <Badge badgeContent={0} color="success">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
          {isAuthenticated ? (
            <Profiles />
          ) : (
            <IconButton color="inherit" href='/account/login'>
              <AccountCircleOutlinedIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default AppBarComponent;
