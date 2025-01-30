import { useState, useEffect } from "react";
import { Typography, Grid, Paper, Box } from "@mui/material";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from "chart.js";
import Dashboard from "../index";
import { fetchTotalPriceOrdersAPI, fetchCountOrdersAPI, fetchCountCustomerAPI, fetchMonthlyRevenue } from '../../../../apis';

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);



const DashboardContent = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [pieData, setPieData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const total = await fetchTotalPriceOrdersAPI();
        const orders = await fetchCountOrdersAPI();
        const customers = await fetchCountCustomerAPI();
        const revenue = await fetchMonthlyRevenue();

        setTotalIncome(total);
        setOrderCount(orders);
        setCustomerCount(customers);

        // Chuyển đổi doanh thu hàng tháng
        const formattedRevenue = formatMonthlyRevenue(revenue);
        setMonthlyRevenue(formattedRevenue);

        // Cập nhật dữ liệu cho biểu đồ pie
        // Kiểm tra nếu total, orders, customers có dữ liệu hợp lệ
        if (total !== undefined && orders !== undefined && customers !== undefined) {
          const newPieData = {
            labels: ["Đơn đặt hàng", "Khách hàng"],
            datasets: [
              {
                data: [orders, customers], // Sử dụng giá trị đã fetch được
                backgroundColor: ["#f18973", "#80ced6"],
                hoverBackgroundColor: ["#f18973", "#80ced6"],
              },
            ],
          };
          setPieData(newPieData);
        } else {
          console.error("Data is undefined or null");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);  // Lưu ý: useEffect không có các dependencies như totalIncome, orderCount, customerCount nữa


  const formatMonthlyRevenue = (data) => {
    return data && typeof data === 'object' ? Object.keys(data).map((key) => ({
      month: key,
      revenue: data[key],
      sales: data[key], // Giả sử doanh thu và doanh số giống nhau
    })) : [];
  };
  const lineData = {
    labels: monthlyRevenue.length > 0 ? monthlyRevenue.map((data) => data.month) : [],
    datasets: [
      {
        label: "Doanh số",
        data: monthlyRevenue.length > 0 ? monthlyRevenue.map((data) => data.sales) : [],
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };
  //Dữ liệu cho biểu đồ doanh thu hàng tháng (Bar Chart)
  const barData = {
    labels: monthlyRevenue.length > 0 ? monthlyRevenue.map((data) => data.month) : [],
    datasets: [
      {
        label: "Doanh thu",
        data: monthlyRevenue.length > 0 ? monthlyRevenue.map((data) => data.revenue) : [],
        backgroundColor: "#00bfae",
        borderColor: "#00bfae",
        borderWidth: 1,
      },
    ],
  };

  // Chuyển đổi số thành định dạng hàng triệu
  const formatCurrency = (value) => {
    // Đảm bảo giá trị là một số hợp lệ
    if (isNaN(value)) return "0 VND";

    // Kiểm tra nếu giá trị lớn hơn 1 triệu và định dạng thành hàng triệu
    if (value >= 1000000) {
      return value
        .toLocaleString('vi-VN') // Định dạng với tiếng Việt
        .replace(',', '.') + " VND"; // Thay dấu phẩy thành dấu chấm
    }

    // Nếu không, định dạng thông thường với dấu phẩy ngàn
    return value.toLocaleString('vi-VN') + " VND";
  };

  return (
    <Dashboard>
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          backgroundColor: "#F5F5F5",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Thống kê
        </Typography>
        <Grid container spacing={3}>
          {/* Các chỉ số KPI */}
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#4CAF50",
                color: "#FFF",
              }}
            >
              <Typography variant="h6">Tổng thu nhập</Typography>
              <Typography variant="h4">{formatCurrency(totalIncome)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#92a8d1",
                color: "#FFF",
              }}
            >
              <Typography variant="h6">Đơn đặt hàng</Typography>
              <Typography variant="h4">{orderCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#80ced6",
                color: "#FFF",
              }}
            >
              <Typography variant="h6">Khách hàng</Typography>
              <Typography variant="h4">{customerCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f18973",
                color: "#FFF",
              }}
            >
              <Typography variant="h6">Đơn vận chuyển</Typography>
              <Typography variant="h4">{orderCount}</Typography>
            </Paper>
          </Grid>

          {/* Biểu đồ doanh số */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6">Doanh số bán hàng</Typography>
              <Line data={lineData} />
            </Paper>
          </Grid>

          {/* Biểu đồ doanh thu hàng tháng */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6">Doanh thu hàng tháng</Typography>
              <Bar
                data={barData}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </Paper>
          </Grid>

          {/* Biểu đồ trạng thái đơn hàng */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6">Tình trạng đặt hàng</Typography>
              {console.log(pieData)}  {/* Log kiểm tra pieData */}
              {pieData && pieData.datasets && pieData.datasets.length > 0 ? (
                <Doughnut data={pieData} />
              ) : (
                <Typography variant="body2">Đang tải dữ liệu...</Typography>
              )}
            </Paper>
          </Grid>
          {/* Giao dịch */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Dashboard>
  );
};

export default DashboardContent;
