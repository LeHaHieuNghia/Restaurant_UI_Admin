import React, { useState } from "react";
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

const AddProduct = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    description: "",
    category: "NMA001",
    images: [],
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Xử lý thay đổi trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Xử lý chọn file
  const handleFileChange = (e) => {
    setFormValues({ ...formValues, images: e.target.files });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("TenMonAn", formValues.name);
    formData.append("Gia", formValues.price);
    formData.append("MoTa", formValues.description);
    formData.append("MaNhomMonAn", formValues.category);

    for (let i = 0; i < formValues.images.length; i++) {
      formData.append("Images", formValues.images[i]);
    }

    try {
      const response = await fetch("https://103.153.68.148/api/MonAn/create/food", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === true) {
        setDialogOpen(true); // Hiển thị dialog khi thành công
      } else {
        setErrorMessage(data.Message || "Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      setErrorMessage("Không thể kết nối tới server.");
    }
  };

  return (
    <Box m="20px">
      {/* Header và nút quay lại Menu */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Thêm Món Ăn" subtitle="Nhập thông tin món ăn mới vào danh sách" />
        <Button
          component={Link}
          to="/menu" // Chuyển hướng về Menu
          sx={{
            backgroundColor: "#4B4376",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          Quay lại Menu
        </Button>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 500,
          margin: "auto",
          padding: 3,
          backgroundColor: "#4B4376",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 2 }}>
          Thêm Món Ăn
        </Typography>

        {/* Tên Món Ăn */}
        <TextField
          label="Tên Món Ăn"
          name="name"
          value={formValues.name}
          onChange={handleInputChange}
          required
        />

        {/* Giá */}
        <TextField
          label="Giá (VNĐ)"
          name="price"
          value={formValues.price}
          onChange={handleInputChange}
          type="number"
          required
        />

        {/* Mô Tả */}
        <TextField
          label="Mô Tả"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          multiline
          rows={4}
          required
        />

        {/* Nhóm Món Ăn */}
        <Select
          name="category"
          value={formValues.category}
          onChange={handleInputChange}
          required
        >
          <MenuItem value="NMA001">Bữa sáng</MenuItem>
          <MenuItem value="NMA002">Bữa trưa</MenuItem>
          <MenuItem value="NMA003">Bữa tối</MenuItem>
        </Select>

        {/* Hình Ảnh */}
        <TextField
          type="file"
          name="images"
          onChange={handleFileChange}
          inputProps={{
            accept: "image/*",
            multiple: true,
          }}
          required
        />

        {/* Nút Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          Thêm Món Ăn
        </Button>

        {/* Hiển thị lỗi nếu có */}
        {errorMessage && (
          <Typography color="error" sx={{ textAlign: "center", marginTop: 2 }}>
            {errorMessage}
          </Typography>
        )}

        {/* Dialog thành công */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Thêm món ăn thành công!</DialogTitle>
          <DialogActions>
            <Button
              component={Link}
              to="/menu" // Chuyển hướng về Menu
              color="primary"
              variant="contained"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AddProduct;
