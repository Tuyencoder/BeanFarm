import React, { useState } from "react";
import {
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Dashboard from "../index";
import { createNewsAPI } from "../../../../apis";
import { useDropzone } from "react-dropzone";


const NewCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(""); // Changed to store image as Data URL
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result); // Set image as Data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newNews = {
      title: title,
      description: description,
      date: date,
      image: image, // Use Data URL for image
    };

    try {
      await createNewsAPI(newNews);

      setSnackbar({
        open: true,
        message: "News created successfully!",
        severity: "success",
      });

      // Optionally reset form fields
      setTitle("");
      setDescription("");
      setDate("");
      setImage(""); // Clear image
      navigate("/admin/newsManager");
    } catch (error) {
      console.error("Error creating news:", error);
      setSnackbar({
        open: true,
        message: "Failed to create news.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/newsManager");
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageChange({ target: { files: acceptedFiles } });
      }
    },
  });
  return (
    <Dashboard>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Tạo Bài Báo Mới
              </Typography>
              <IconButton onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box p={3}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tiêu đề bài báo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Nội dung bài báo"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ngày đăng"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    variant="filled"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                <div
                    {...getRootProps()}
                    style={{
                      border: "1px dashed #ccc",
                      padding: 16,
                      textAlign: "center",
                    }}
                  >
                    <input
                      {...getInputProps()}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Typography variant="body2">
                      Kéo hình ảnh của bạn vào đây (Chỉ *.jpeg, *.webp và *.png hình ảnh sẽ được chấp nhận)
                    </Typography>
                  </div>
                  {image && (
                    <Box mt={2}>
                      <img
                        src={image}
                        alt="Selected"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
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
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    padding: "10px 20px",
                  }}
                >
                  Tạo Bài Báo
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
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
    </Dashboard>
  );
};

export default NewCreate;
