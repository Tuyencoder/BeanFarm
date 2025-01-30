import React, { useState, useEffect } from "react";
import { List, ListItemButton, ListItemText, ListItemIcon, Drawer, AppBar, Toolbar, Typography, CssBaseline, Divider, IconButton, Menu, MenuItem, InputBase } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from '@mui/icons-material/Groups';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArticleIcon from '@mui/icons-material/Article';
import DiscountIcon from '@mui/icons-material/Discount';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { styled } from "@mui/system";

const drawerWidth = 240;

const DrawerContainer = styled("div")(({ theme }) => ({
  display: "flex",
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
  },
}));

const Content = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const ListItemButtonStyled = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: "#4caf50",
    "&:hover": {
      backgroundColor: "#388e3c",
    },
  },
}));

const Dashboard = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState("/admin");

  const location = useLocation();

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location.pathname]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleListItemClick = (event, link) => {
    setSelectedItem(link);
  };

  return (
    <DrawerContainer>
      <CssBaseline />
      <AppBarStyled position="fixed">
        <Toolbar>
          <img
            src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/logo.png?1718181939137"
            alt="Logo"
            style={{ marginRight: "16px", height: "32px" }}
          />

          <div
            style={{
              position: "relative",
              borderRadius: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              marginLeft: "16px",
              width: "300px",
            }}
          >
            <IconButton style={{ padding: "10px", color: "#fff" }}>
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search…"
              style={{
                color: "#fff",
                paddingLeft: "16px",
                paddingRight: "16px",
              }}
            />
          </div>

          <div style={{ flexGrow: 1 }}></div>

          <IconButton onClick={toggleDarkMode} style={{ color: "#fff" }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton style={{ color: "#fff" }}>
            <NotificationsIcon />
          </IconButton>

          <IconButton onClick={handleMenuOpen} style={{ color: "#fff" }}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>
      <DrawerStyled variant="permanent">
        <Toolbar />
        <Divider />
        <List>
          <ListItemButtonStyled
            selected={selectedItem === "/admin"}
            onClick={(event) => handleListItemClick(event, "/admin")}
            component={Link}
            to="/admin"
          >
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Thông kê" />
          </ListItemButtonStyled>

          <ListItemButtonStyled
            selected={selectedItem === "/admin/categorymanager"}
            onClick={(event) =>
              handleListItemClick(event, "/admin/categorymanager")
            }
            component={Link}
            to="/admin/categorymanager"
          >
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý danh mục " />
          </ListItemButtonStyled>

          <ListItemButtonStyled
            selected={selectedItem === "/admin/suppliermanager"}
            onClick={(event) =>
              handleListItemClick(event, "/admin/suppliermanager")
            }
            component={Link}
            to="/admin/suppliermanager"
          >
            <ListItemIcon>
              <Inventory2Icon />
            </ListItemIcon>
            <ListItemText
              primary="Quản lý nhà cung cấp"
              primaryTypographyProps={{ style: { fontSize: '0.92rem' } }} 
            />
          </ListItemButtonStyled>

          <ListItemButtonStyled
            selected={selectedItem === "/admin/productmanager"}
            onClick={(event) =>
              handleListItemClick(event, "/admin/productmanager")
            }
            component={Link}
            to="/admin/productmanager"
          >
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý sản phẩm" />

          </ListItemButtonStyled>

          <ListItemButtonStyled
          selected={selectedItem === "/admin/vouchermanager"}
          onClick={(event) => handleListItemClick(event, "/admin/vouchermanager")}
          component={Link}
          to="/admin/vouchermanager"
        >
          <ListItemIcon>
            <DiscountIcon />
          </ListItemIcon>
          <ListItemText
            primary="Quản lý phiếu giảm giá"
            primaryTypographyProps={{ noWrap: true, fontSize: "0.91rem" }}
          />
        </ListItemButtonStyled>

          <ListItemButtonStyled
            selected={selectedItem === "/admin/RoleManager"}
            onClick={(event) =>
              handleListItemClick(event, "/admin/RoleManager")
            }
            component={Link}
            to="/admin/RoleManager"
          >
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý chức vụ" />
          </ListItemButtonStyled>
            
          <ListItemButtonStyled
            selected={selectedItem === "/admin/InternalManager"}
            onClick={(event) =>
              handleListItemClick(event, "/admin/InternalManager")
            }
            component={Link}
            to="/admin/InternalManager"
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý nội bộ" />
          </ListItemButtonStyled>

          <ListItemButtonStyled
            selected={selectedItem === "/admin/customermanager"}
            onClick={(event) =>
              handleListItemClick(event, "/admin/customermanager")
            }
            component={Link}
            to="/admin/customermanager"
          >
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý khách hàng" />
          </ListItemButtonStyled>

          <ListItemButtonStyled
            selected={selectedItem === "/admin/ordermanager"}
            onClick={(event) =>
              handleListItemClick(event, "/admin/ordermanager")
            }
            component={Link}
            to="/admin/ordermanager"
          >
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý hóa đơn" />
          </ListItemButtonStyled>

          <ListItemButtonStyled
            selected={selectedItem === "/admin/newsmanager"}
            onClick={(event) =>
              handleListItemClick(event, "/admin/newsmanager")
            }
            component={Link}
            to="/admin/newsmanager"
          >
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý tin tức" />
          </ListItemButtonStyled>

        </List>
      </DrawerStyled>
      <Content>
        <Toolbar />
        <Typography paragraph>{children}</Typography>
      </Content>
    </DrawerContainer>
  );
};

export default Dashboard;
