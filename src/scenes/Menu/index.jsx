import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import { tokens } from "../../theme";

const Menu = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // Danh sách sản phẩm được chọn
  const [isEditing, setIsEditing] = useState(false); // Trạng thái sửa
  const [formValues, setFormValues] = useState({}); // Lưu giá trị form sửa
  const colors = tokens(theme.palette.mode);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://103.153.68.148/api/MonAn/all/food");
        const data = response.data.map((item, index) => ({
          id: index + 1,
          maMonAn: item.maMonAn,
          tenMon: item.tenMon,
          gia: item.gia,
          moTa: item.moTa,
          hinhAnh: item.hinhAnh.split(";"),
          maNhomMonAn:
            item.maNhomMonAn === "NMA001"
              ? "Bữa sáng"
              : item.maNhomMonAn === "NMA002"
              ? "Bữa trưa"
              : "Bữa tối",
        }));
        setRows(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  // Xử lý mở dialog chi tiết
  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setFormValues({ ...params.row }); // Sao chép dữ liệu vào form
    setOpenDialog(true);
    setIsEditing(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Xử lý thay đổi giá trị form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý cập nhật dữ liệu
  const handleUpdate = async () => {
    try {
      const response = await axios.put("https://103.153.68.148/api/MonAn/update/food", {
        maMonAn: formValues.maMonAn,
        tenMon: formValues.tenMon,
        gia: formValues.gia,
        moTa: formValues.moTa,
        maNhomMonAn: formValues.maNhomMonAn,
        hinhAnh: formValues.hinhAnh.join(";"),
      });

      if (response.data.status === true) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.maMonAn === formValues.maMonAn ? { ...row, ...formValues } : row
          )
        );
        alert("Cập nhật thành công!");
        setOpenDialog(false);
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };

  // Xử lý thay đổi trạng thái checkbox
  const handleCheckboxChange = (event, id) => {
    const selectedIndex = selectedRows.indexOf(id);
    if (selectedIndex === -1) {
      setSelectedRows([...selectedRows, id]);
    } else {
      const newSelectedRows = selectedRows.filter((rowId) => rowId !== id);
      setSelectedRows(newSelectedRows);
    }
  };

  // Xử lý xóa món ăn đã chọn
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Chưa chọn món ăn để xóa!");
      return;
    }

    try {
      // Xóa từng món ăn đã chọn
      for (const id of selectedRows) {
        const response = await axios.delete(
          `https://103.153.68.148/api/MonAn/delete/food/${id}`
        );

        if (response.data.status === true) {
          setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        }
      }
      alert("Xóa thành công!");
      setSelectedRows([]); // Xóa danh sách món đã chọn
    } catch (error) {
      console.error("Lỗi khi xóa món ăn:", error);
      alert("Có lỗi xảy ra khi xóa món ăn!");
    }
  };

  const columns = [
    {
      field: "checkbox",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={(e) => handleCheckboxChange(e, params.row.id)}
        />
      ),
    },
    {
      field: "maMonAn",
      headerName: "Mã Món Ăn",
      flex: 1,
    },
    {
      field: "tenMon",
      headerName: "Tên Món Ăn",
      flex: 1,
    },
    {
      field: "gia",
      headerName: "Giá (đ)",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>{params.row.gia} đ</Typography>
      ),
    },
    {
      field: "moTa",
      headerName: "Mô Tả",
      flex: 1,
    },
    {
      field: "maNhomMonAn",
      headerName: "Loại Món Ăn",
      flex: 1,
    },
    {
      field: "hinhAnh",
      headerName: "Hình Ảnh",
      flex: 2,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {params.row.hinhAnh.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Ảnh ${params.row.tenMon}`}
              style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "5px" }}
            />
          ))}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Menu" subtitle="Danh sách món ăn của ManchilGarden" />
        <Box display="flex" gap={2}>
          <Button
            component={Link}
            to="/AddProduct"
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Thêm Món Ăn
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: colors.redAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Xóa Món Ăn
          </Button>
        </Box>
      </Box>

      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
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
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          onRowClick={handleRowClick}
        />
      </Box>

      {/* Dialog hiển thị chi tiết và sửa */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>
          {isEditing ? "Chỉnh sửa thông tin món ăn" : "Chi tiết món ăn"}
        </DialogTitle>
        <DialogContent>
          {selectedRow && (
            <Box display="flex" flexDirection="column" mt={2} gap={2}>
              <TextField
                label="Tên món ăn"
                name="tenMon"
                value={formValues.tenMon || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <TextField
                label="Giá"
                name="gia"
                value={formValues.gia || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <TextField
                label="Mô tả"
                name="moTa"
                value={formValues.moTa || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <TextField
                label="Loại món ăn"
                name="maNhomMonAn"
                value={formValues.maNhomMonAn || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <Box display="flex" gap={2}>
                {formValues.hinhAnh &&
                  formValues.hinhAnh.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={formValues.tenMon}
                      style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "5px" }}
                    />
                  ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              <Button onClick={handleUpdate} color="primary">
                Lưu
              </Button>
              <Button onClick={() => setIsEditing(false)} color="secondary">
                Hủy
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} color="primary">
              Sửa
            </Button>
          )}
          <Button onClick={handleCloseDialog} color="secondary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Menu;
