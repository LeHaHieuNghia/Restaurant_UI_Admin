import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State để lưu dữ liệu và trạng thái tải
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://103.153.68.148/api/KhachHang/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setRows(
          data.map((item, index) => ({
            id: index + 1, // Tạo ID duy nhất cho từng dòng
            ...item,
          }))
        ); // Lưu dữ liệu vào state và thêm ID
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
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "hoTen", headerName: "Họ Tên", flex: 1 },
    { field: "diaChi", headerName: "Địa Chỉ", flex: 1.5 },
    {
      field: "gioiTinh",
      headerName: "Giới Tính",
      flex: 0.5,
      renderCell: ({ value }) => (value ? "Nam" : "Nữ"), // Hiển thị giới tính Nam/Nữ
    },
    { field: "sdt", headerName: "SĐT", flex: 1 },
    { field: "diem", headerName: "Điểm", flex: 0.5, type: "number" },
    {
      field: "ngaySinh",
      headerName: "Ngày Sinh",
      flex: 1,
      renderCell: ({ value }) =>
        new Date(value).toLocaleDateString("vi-VN"), // Hiển thị ngày sinh dạng dd/mm/yyyy
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="DANH SÁCH KHÁCH HÀNG"
        subtitle="Quản lý thông tin khách hàng"
      />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          loading={loading}
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
