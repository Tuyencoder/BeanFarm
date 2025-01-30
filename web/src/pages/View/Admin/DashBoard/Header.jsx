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
  
        setPieData({
          labels: ["Doanh thu", "Sản phẩm", "Thu nhập"],
          datasets: [
            {
              data: [totalIncome, orderCount, customerCount],
              backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
              hoverBackgroundColor: ["#66BB6A", "#FFB74D", "#64B5F6"],
            },
          ],
        });
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [totalIncome, orderCount, customerCount]);
  
  // Chuyển đổi dữ liệu API cho doanh thu hàng tháng
  const formatMonthlyRevenue = (data) => {
    return data && typeof data === 'object' ? Object.keys(data).map((key) => ({
      month: key,
      revenue: data[key],
      sales: data[key], // Giả sử doanh thu và doanh số giống nhau
    })) : [];
  };

  // Chuyển đổi số thành định dạng hàng triệu
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + " VND";
    }
    return value.toLocaleString() + " VND";
  };

  // Dữ liệu cho biểu đồ đường (Doanh số)
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
              <Doughnut data={pieData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Dashboard>
  );
};

export default DashboardContent;
