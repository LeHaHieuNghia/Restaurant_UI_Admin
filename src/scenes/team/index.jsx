import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State để lưu dữ liệu và trạng thái tải
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://103.153.68.148/api/Authen/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setRows(data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    };

    fetchData();
  }, []);

  // Định nghĩa cột
  const columns = [
    { field: "tenDangNhap", headerName: "Tên Đăng Nhập", flex: 1 },
    {
      field: "matKhau",
      headerName: "Mật Khẩu (Mã Hóa)",
      flex: 2,
    },
    {
      field: "ngayTao",
      headerName: "Ngày Tạo",
      flex: 1,
      renderCell: ({ value }) => new Date(value).toLocaleDateString("vi-VN"), // Hiển thị ngày đẹp hơn
    },
    {
      field: "trangThai",
      headerName: "Trạng Thái",
      flex: 1,
      renderCell: ({ value }) => (
        <Typography
          color={value ? colors.greenAccent[400] : colors.redAccent[400]}
        >
          {value ? "Kích Hoạt" : "Không Hoạt Động"}
        </Typography>
      ),
    },
    {
      field: "maQuyen",
      headerName: "Quyền",
      flex: 1,
      renderCell: ({ value }) => {
        // Hiển thị tên quyền và icon tương ứng
        let label, icon;
        switch (value) {
          case "Q001":
            label = "Admin";
            icon = <AdminPanelSettingsOutlinedIcon />;
            break;
          case "Q002":
            label = "Manager";
            icon = <SecurityOutlinedIcon />;
            break;
          case "Q003":
            label = "Employee";
            icon = <LockOpenOutlinedIcon />;
            break;
          case "Q004":
            label = "Customer";
            icon = <LockOpenOutlinedIcon />;
            break;
          default:
            label = "Unknown";
            icon = null;
        }

        return (
          <Box display="flex" alignItems="center" gap="5px">
            {icon}
            <Typography>{label}</Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Quản Lý Người Dùng" subtitle="Danh sách tài khoản" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={loading}
          rows={rows}
          columns={columns}
          checkboxSelection
          getRowId={(row) => row.tenDangNhap} // Dùng `tenDangNhap` làm ID
        />
      </Box>
    </Box>
  );
};

export default Team;
