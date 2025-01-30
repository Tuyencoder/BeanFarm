import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchUserInfoAPI,
  updateUserAPI,
  checkOldPasswordAPI,
} from "../../../../apis";
import { useAuth } from "../../../Account/AuthContext";

function AccountManagement() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [totalSpent, setTotalSpent] = useState(0); // Tổng số tiền đã chi tiêu
  const [rank, setRank] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(false);
  const [point, setPoint] = useState("");
  const rankIcons = {
    Đồng: "https://cdn-icons-png.freepik.com/256/14791/14791357.png?semt=ais_hybrid",
    Bạc: "https://cdn-icons-png.freepik.com/512/5355/5355724.png",
    Vàng: "https://cdn-icons-png.freepik.com/512/686/686380.png",
    "Bạch kim": "https://cdn-icons-png.freepik.com/512/8283/8283866.png",
    "Kim cương": "https://cdn-icons-png.freepik.com/512/13572/13572692.png",
  };

  const rankThresholds = [
    {
      rank: "Đồng",
      totalSpent: 0,
      description: "Khởi đầu hành trình mua sắm của bạn.",
    },
    {
      rank: "Bạc",
      totalSpent: 300000,
      description: "Hưởng các ưu đãi đầu tiên với hạng Bạc.",
    },
    {
      rank: "Vàng",
      totalSpent: 1000000,
      description: "Tận hưởng quyền lợi cao cấp ở hạng Vàng.",
    },
    {
      rank: "Bạch kim",
      totalSpent: 2500000,
      description: "Đẳng cấp và ưu tiên với hạng Bạch kim.",
    },
    {
      rank: "Kim cương",
      totalSpent: 5000000,
      description: "Trải nghiệm đỉnh cao tại hạng Kim cương.",
    },
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const id = localStorage.getItem("id");
        const userData = await fetchUserInfoAPI(id);
        setUser(userData);
        setUsername(userData.username);
        setEmail(userData.email);
        setImage(userData.image);
        setTotalSpent(userData.totalSpent); // Giả sử API trả về totalSpent
        setRank(userData.rank);
        setPoint(userData.points);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        toast.error("Không thể lấy thông tin tài khoản.");
      }
    };
    fetchUserInfo();
  }, [userId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCheckOldPassword = async () => {
    if (!oldPassword) {
      toast.error("Vui lòng nhập mật khẩu cũ.");
      return;
    }

    try {
      const isValid = await checkOldPasswordAPI({ email, oldPassword });
      if (isValid) {
        setIsOldPasswordValid(true);
        toast.success("Mật khẩu cũ đúng.");
      } else {
        setIsOldPasswordValid(false);
        toast.error("Mật khẩu cũ không đúng.");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra mật khẩu cũ:", error);
      toast.error("Lỗi khi kiểm tra mật khẩu cũ.");
    }
  };

  const handleUpdateUser = async () => {
    // Check if the new password and confirmation match
    if (password && password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    // Check if the old password is valid before updating
    if (password && !isOldPasswordValid) {
      toast.error("Vui lòng kiểm tra lại mật khẩu cũ.");
      return;
    }

    // If the user wants to change the password, validate the old password one more time
    if (password) {
      const isOldPasswordCorrect = await checkOldPasswordAPI({
        email,
        oldPassword,
      });

      if (!isOldPasswordCorrect) {
        toast.error("Mật khẩu cũ không đúng.");
        return;
      }
    }

    try {
      const id = userId || localStorage.getItem("id");
      const updatedUser = {
        username,
        ...(email && { email }),
        image: selectedImage || image,
        ...(password && { password }),
      };

      // Call the API to update the user details
      await updateUserAPI(id, updatedUser);
      toast.success("Cập nhật thông tin thành công.");
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi cập nhật tài khoản:", error);
      toast.error("Không thể cập nhật tài khoản.");
    }
  };

  const currentRank = rankThresholds.find((r) => r.rank === rank);
  const nextRank = rankThresholds.find((r) => r.totalSpent > totalSpent);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {/* Nút quay lại */}
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Quay lại
      </Button>

      {/* Thông tin chi tiết */}
      <Card sx={{ borderRadius: 3, mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  src={selectedImage || image}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    border: "2px solid #ddd",
                  }}
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="upload-avatar"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="upload-avatar">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadFileIcon />}
                  >
                    Đổi ảnh đại diện
                  </Button>
                </label>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                {username}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Hạng:{" "}
                <Avatar
                  src={rankIcons[rank]}
                  sx={{ width: 24, height: 24, mr: 1 }}
                />{" "}
                <b>{rank}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {currentRank?.description}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Hiện tại điểm của bạn là: <b>{point} </b>
                </Typography>
                <Button href="/Customer/Voucher">Quy điểm đổi điểm</Button>
              </Box>
              <Box mt={1}>
                <Typography variant="body2" gutterBottom>
                  Tổng chi tiêu: <b>{totalSpent.toLocaleString("vi-VN")} VND</b>
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(totalSpent / (nextRank?.totalSpent || 5000000)) * 100}
                  sx={{ mt: 1 }}
                />
                {nextRank && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Đạt <b>{nextRank.rank}</b> khi tổng chi tiêu đạt{" "}
                    <b>{nextRank.totalSpent.toLocaleString("vi-VN")} VND</b>
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Cập nhật thông tin */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Cập nhật thông tin tài khoản
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField
            label="Tên người dùng"
            fullWidth
            margin="dense"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={email}
            disabled
          />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <TextField
                label="Mật khẩu cũ"
                type="password"
                fullWidth
                margin="dense"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                onClick={handleCheckOldPassword}
                sx={{ height: "100%" }}
              >
                Kiểm tra
              </Button>
            </Grid>
          </Grid>
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isOldPasswordValid}
          />
          <TextField
            label="Xác nhận mật khẩu"
            type="password"
            fullWidth
            margin="dense"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!isOldPasswordValid}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpdateUser}>
            Lưu thay đổi
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AccountManagement;
