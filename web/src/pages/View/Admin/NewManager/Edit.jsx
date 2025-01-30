import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateNewsAPI } from "../../../../apis";

const NewsEdit = ({ open, onClose, newsItem, onSave }) => {
  const [editedNews, setEditedNews] = useState({ ...newsItem });

  useEffect(() => {
    setEditedNews({ ...newsItem });
  }, [newsItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNews((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedNews = await updateNewsAPI(editedNews.id, editedNews);
      onSave(updatedNews);
      onClose();
    } catch (error) {
      console.error("Failed to update news:", error);
      // Handle error, show snackbar, etc.
    }
  };

  const handleCancel = () => {
    onClose();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedNews((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Drawer anchor="right" open={open} onClose={handleCancel}>
      <Box p={3} width="450px" display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            Chỉnh sửa tin tức
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin tin tức từ đây
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Tiêu đề"
          name="title"
          value={editedNews.title || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
       <Button
          variant="contained"
          component="label"
          style={{
            backgroundColor: "#4caf50",
            marginTop: "16px",
          }}
        >
          Thêm/Sửa hình ảnh
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <img
            src={editedNews.image || "https://via.placeholder.com/150"}
            alt=""
            style={{ maxWidth: "100%", maxHeight: 200 }}
          />
        </Box>
        <TextField
          fullWidth
          margin="normal"
          label="Mô tả"
          name="description"
          value={editedNews.description || ""}
          onChange={handleChange}
          multiline
          rows={4}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Ngày"
          name="date"
          value={editedNews.date || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button
            onClick={handleCancel}
            variant="outlined"
            style={{
              borderColor: "#ff4d4f",
              color: "#ff4d4f",
              padding: "10px 20px",
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#4caf50",
              padding: "10px 20px",
            }}
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NewsEdit;
