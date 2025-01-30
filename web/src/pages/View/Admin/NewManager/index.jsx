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
import NewsEdit from "./Edit";
import styled from "styled-components";
import { fetchAllNewsAPI, deleteNewsAPI } from '../../../../apis'; // Import fetchAllNewsAPI and deleteNewsAPI

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetchAllNewsAPI();
        setNews(response);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch news.",
          severity: "error",
        });
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (location.state && location.state.newNews) {
      const { newNews } = location.state;
      setNews((prevNews) => {
        if (prevNews.find((newsItem) => newsItem.id === newNews.id)) {
          return prevNews;
        }
        return [...prevNews, newNews];
      });
      setSnackbar({
        open: true,
        message: "Thêm tin tức thành công!",
        severity: "success",
      });
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state, location.pathname]);

  const handleEditClick = (newsItem) => {
    setCurrentNews(newsItem);
    setOpen(true);
  };

  const handleSave = (updatedNews) => {
    setNews((prevNews) =>
      prevNews.map((newsItem) =>
        newsItem.id === updatedNews.id ? updatedNews : newsItem
      )
    );
    setOpen(false);
    setCurrentNews(null);
    setSnackbar({
      open: true,
      message: "Cập nhật tin tức thành công!",
      severity: "success",
    });
  };

  const handleDeleteClick = (newsItem) => {
    setNewsToDelete(newsItem);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteNewsAPI(newsToDelete.id); // Assuming deleteNewsAPI takes news ID as argument
      setNews((prevNews) =>
        prevNews.filter((newsItem) => newsItem.id !== newsToDelete.id)
      );
      setConfirmDialogOpen(false);
      setNewsToDelete(null);
      setSnackbar({
        open: true,
        message: "Xóa tin tức thành công!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete news.",
        severity: "error",
      });
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setNewsToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentNews(null);
  };

  const handleFilterChange = (e) => {
    setFilterDate(e.target.value);
  };
  const [expandedNewsId, setExpandedNewsId] = useState(null);


  const filteredNews = news.filter((newsItem) => {
    const matchesSearch = newsItem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate === "" || newsItem.date.includes(filterDate);
    return matchesSearch && matchesDate;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Dashboard>
      <NewsManagerContainer>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          Quản lý tin tức
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
              label="Lọc theo ngày"
              variant="outlined"
              value={filterDate}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} style={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              style={{ marginRight: 8 }}
              onClick={() => {
                setFilterDate("");
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
              to="/admin/newsmanager/create"
            >
              Thêm tin tức mới
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} style={{ marginTop: 16 }}>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Hình ảnh</TableCell>
                <TableCell align="center">Tiêu đề</TableCell>
                <TableCell align="center">Mô tả</TableCell>
                <TableCell align="center">Ngày</TableCell>
                <TableCell align="center">Tác vụ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNews.map((newsItem) => (
                <TableRow key={newsItem.id}>
                  <TableCell align="center">{newsItem.id}</TableCell>
                  <TableCell align="center">
                    <img src={newsItem.image} alt={newsItem.title} style={{ width: 100 }} />
                  </TableCell>
                  <StyledTableCell align="center">{newsItem.title}</StyledTableCell>
                  <StyledTableCell align="center">
                    {expandedNewsId === newsItem.id ? (
                      newsItem.description // Render full description if expanded
                    ) : (
                      `${newsItem.description.substring(0, 100)}...` // Otherwise, show truncated description
                    )}
                   
                  </StyledTableCell>
                  <StyledTableCell align="center">{newsItem.date}</StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton
                      color="secondary"
                      onClick={() => handleEditClick(newsItem)}
                    >
                      <EditCalendarOutlinedIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(newsItem)}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </NewsManagerContainer>

      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Xóa tin tức</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn chắc chắn muốn xóa tin tức này?
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
      <NewsEdit
        open={open}
        onClose={handleClose}
        newsItem={currentNews}
        onSave={handleSave}
      />
    </Dashboard>
  );
};

// Styled components
const NewsManagerContainer = styled.div`
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
`;
export default NewsManager;
