import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
  Snackbar,
  Alert,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Edit, Delete, Visibility, FilterList, GetApp } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import Dashboard from "../index";
import ProductEdit from "../ProductManager/Edit";
import styled from "styled-components";
import { fetchManagerAdminProductsAPI, deleteProductAPI } from '../../../../apis'; // Import deleteProductAPI

const index = () => {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchManagerAdminProductsAPI();
        setProjects(response);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch products.",
          severity: "error",
        });
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state && location.state.newProduct) {
      const { newProduct } = location.state;
      setProjects((prevProjects) => {
        if (prevProjects.find((product) => product.id === newProduct.id)) {
          return prevProjects;
        }
        return [...prevProjects, newProduct];
      });
      setSnackbar({
        open: true,
        message: "Thêm sản phẩm thành công!",
        severity: "success",
      });
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state, location.pathname]);

  const handleEditClick = (project) => {
    setCurrentProject(project);
    setOpen(true);
  };

  const handleSave = (updatedProduct) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProduct.id ? updatedProduct : project
      )
    );
    setOpen(false);
    setCurrentProject(null);
    setSnackbar({
      open: true,
      message: "Cập nhật sản phẩm thành công!",
      severity: "success",
    });
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProductAPI(projectToDelete.id); // Assuming deleteProductAPI takes product ID as argument
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectToDelete.id)
      );
      setConfirmDialogOpen(false);
      setProjectToDelete(null);
      setSnackbar({
        open: true,
        message: "Xóa sản phẩm thành công!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete product.",
        severity: "error",
      });
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProject(null);
  };

  const handleFilterChange = (e) => {
    setFilterPrice(e.target.value);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = filterPrice === "" || project.price.toString().includes(filterPrice);
  
    // Kiểm tra sản phẩm đã hết hạn (so sánh với ngày hiện tại)
    const isExpired = project.expirationDate ? new Date(project.expirationDate) < new Date() : false;
    
    return (matchesSearch && matchesPrice) || isExpired;
  });
  
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  return (
    <Dashboard>
      <ProductManager>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          Quản lý sản phẩm
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tìm kiếm..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />  
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Lọc giá sản phẩm"
              variant="outlined"
              value={filterPrice}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} style={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              style={{ marginRight: 8 }}
              onClick={() => {
                setFilterPrice("");
                setSearchTerm("");
              }}
            >
              Đặt lại
            </Button>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              style={{ marginRight: 8 }}
            >
              Xuất
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/admin/productmanager/create"
            >
              Thêm sản phẩm mới
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} style={{ marginTop: 16 }}>
  <StyledTable>
    <TableHead>
      <StyledTableRow>
        <StyledTableCell align="center">ID</StyledTableCell>
        <StyledTableCell align="center">Hình ảnh</StyledTableCell>
        <StyledTableCell align="center">Tên sản phẩm</StyledTableCell>
        <StyledTableCell align="center">Chú thích</StyledTableCell>
        <StyledTableCell align="center">Giá</StyledTableCell>
        <StyledTableCell align="center">Trạng thái</StyledTableCell>
        <StyledTableCell align="center">Tác vụ</StyledTableCell>
      </StyledTableRow>
    </TableHead>
    <TableBody>
      {filteredProjects.map((project) => {
        const isExpired = project.expirationDate ? new Date(project.expirationDate) < new Date() : false;

        return (
          <StyledTableRow key={project.id} expired={isExpired}>
            <TableCell align="center">{project.id}</TableCell>
            <TableCell align="center">
              <img src={project.image} alt={project.name} style={{ width: 50, height: 50, objectFit: "cover" }} />
            </TableCell>
            <TableCell align="center">{project.name}</TableCell>
            <TableCell align="center">{project.description}</TableCell>
            <TableCell align="center">
              {project.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </TableCell>
            <TableCell align="center">
              {isExpired ? (
                <Typography color="error">Hết hạn</Typography>
              ) : (
                <Typography color="primary">Còn hiệu lực</Typography>
              )}
            </TableCell>
            <TableCell align="center">
              <IconButton color="secondary" onClick={() => handleEditClick(project)}>
                <EditCalendarOutlinedIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteClick(project)}>
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </TableCell>
          </StyledTableRow>
        );
      })}
    </TableBody>
  </StyledTable>
</TableContainer>

      </ProductManager>

        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Xóa sản phẩm</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn chắc chắn muốn xóa sản phẩm này?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Hủy
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <ProductEdit
          open={open}
          onClose={handleClose}
          product={currentProject}
          onSave={handleSave}
        />
        
    </Dashboard>
  );
};

// Styled components
const ProductManager = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const StyledTableCell = styled(TableCell)`
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border: 1px solid #ccc;
    text-align: center;
  }

  th {
    background-color: #f8f9fa;
  }
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }

  /* Thay đổi màu nền cho sản phẩm hết hạn */
  ${({ expired }) => expired && `
    background-color: #f8d7da; /* Màu đỏ nhạt cho sản phẩm hết hạn */
  `}
`;


export default index;
