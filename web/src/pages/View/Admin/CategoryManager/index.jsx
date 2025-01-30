import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton as MuiIconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  EditCalendarOutlined as EditCalendarOutlinedIcon,
  FilterList,
  GetApp,
} from "@mui/icons-material";
import Dashboard from "../index";
import CategoryEdit from "../CategoryManager/Edit";

// Import API functions
import { fetchAllCategoriesAPI, deleteCategoryAPI } from "../../../../apis";

const CategoryManager = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;
const StyledTableContainer = styled(TableContainer)`
  margin-top: 16px;
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

const StyledTableCell = styled(TableCell)`
  && {
    border: 1px solid #cccc;
    padding: 8px;
    text-align: center;
    vertical-align: middle;
  }
`;

const StyledTableRow = styled(TableRow)`
  &:not(:first-child) {
    &:hover {
      background-color: #f1f1f1;
      cursor: pointer;
    }
  }

  &:nth-of-type(even) {
    background-color: #f9f9f9;
  }
`;

const CategoryIndex = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchName, setSearchName] = useState("");
  const [searchDescription, setSearchDescription] = useState("");

  useEffect(() => {
    // Fetch categories when component mounts
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await fetchAllCategoriesAPI(); // Replace with your API call
      setCategories(response); // Assuming your API returns an array of categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCategory = {
      id: String(categories.length + 1),
      name,
      description,
    };
    // For demo purposes, add the new category locally
    setCategories([...categories, newCategory]);
    setName("");
    setDescription("");
    setSnackbar({
      open: true,
      message: "Thêm danh mục thành công!",
      severity: "success",
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteCategoryId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategoryAPI(deleteCategoryId); // Replace with your delete API call
      const updatedCategories = categories.filter(
        (category) => category.id !== deleteCategoryId
      );
      setCategories(updatedCategories);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: "Xóa danh mục thành công!",
        severity: "success",
      });
    } catch (error) {
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: error.response?.data,
        severity: "error",
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = (editedCategory) => {
    const updatedCategories = categories.map((category) =>
      category.id === editedCategory.id ? editedCategory : category
    );
    setCategories(updatedCategories);
    setEditingCategory(null);
    setOpenEditDialog(false);
    setSnackbar({
      open: true,
      message: "Cập nhật danh mục thành công!",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleSearchDescriptionChange = (event) => {
    setSearchDescription(event.target.value);
  };

  const handleResetSearch = () => {
    setSearchName("");
    setSearchDescription("");
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchName.toLowerCase()) &&
      category.description.toLowerCase().includes(searchDescription.toLowerCase())
  );

  return (
    <Dashboard>
      <CategoryManager>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          Danh mục sản phẩm
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tìm kiếm tên loại sản phẩm"
              variant="outlined"
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Lọc Loại xuất khẩu"
              variant="outlined"
              value={searchDescription}
              onChange={handleSearchDescriptionChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} style={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              style={{ marginRight: 8 }}
              onClick={handleResetSearch}
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
              style={{ backgroundColor: "#4caf50" }}
              component={Link}
              to="/admin/categorymanager/create"
            >
              Thêm Danh mục mới
            </Button>
          </Grid>
        </Grid>

        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Tên loại sản phẩm</StyledTableCell>
                <StyledTableCell>Ghi chú</StyledTableCell>
                <StyledTableCell>Tác vụ</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <MuiIconButton onClick={() => handleEdit(category)}>
                      <EditCalendarOutlinedIcon color="secondary" />
                    </MuiIconButton>
                    <MuiIconButton
                      onClick={() => handleDeleteClick(category.id)}
                    >
                      <DeleteOutlineOutlinedIcon color="error" />
                    </MuiIconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </CategoryManager>

      {/* Edit Category Dialog */}
      <CategoryEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        category={editingCategory}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa loại sản phẩm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn xóa loại sản phẩm này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dashboard>
  );
};

export default CategoryIndex;
