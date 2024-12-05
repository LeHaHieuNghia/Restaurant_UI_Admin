import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

const TableMn = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State quản lý các bàn
  const [tables, setTables] = useState({
    Floor_1: [],
    Floor_2: [],
    Floor_3: [],
  });

  const [selectedFloor, setSelectedFloor] = useState("All"); // Quản lý tầng được chọn
  const [selectedTable, setSelectedTable] = useState(null); // Bàn được chọn

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://103.153.68.148/api/Ban/all");
        const data = response.data.map((item) => ({
          maBan: item.maBan,
          soBan: item.soBan,
          soChoNgoi: item.soChoNgoi,
          hinhAnh: item.hinhAnh.split(";"),
          maKhuVuc: item.maKhuVuc,
        }));

        // Gộp bàn theo khu vực
        const groupedTables = {
          Floor_1: data.filter((table) => table.maKhuVuc === "KV001"),
          Floor_2: data.filter((table) => table.maKhuVuc === "KV002"),
          Floor_3: data.filter((table) => table.maKhuVuc === "KV003"),
        };

        setTables(groupedTables);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  // Xử lý chọn tầng
  const handleFloorClick = (floor) => {
    setSelectedFloor(floor);
    setSelectedTable(null); // Reset bàn được chọn khi đổi tầng
  };

  // Xử lý click bàn
  const handleTableClick = (table) => {
    setSelectedTable(table); // Lưu bàn được chọn vào state
  };

  // Lấy danh sách bàn theo tầng
  const getTablesByFloor = () => {
    if (selectedFloor === "All") {
      return [...tables.Floor_1, ...tables.Floor_2, ...tables.Floor_3];
    }
    return tables[selectedFloor];
  };
  // Hàm sửa bàn


  // Hàm xóa bàn
  const handleDeleteTable = async (tableMaBan) => {
    try {
      // Gửi yêu cầu xóa bàn tới API
      const response = await axios.delete(`https://103.153.68.148/api/Ban/delete?ma=${tableMaBan}`);
      if (response.status === 200) {
        // Nếu xóa thành công, cập nhật lại danh sách bàn
        setTables((prevTables) => {
          const updatedTables = { ...prevTables };
          updatedTables.Floor_1 = updatedTables.Floor_1.filter(
            (table) => table.maBan !== tableMaBan
          );
          updatedTables.Floor_2 = updatedTables.Floor_2.filter(
            (table) => table.maBan !== tableMaBan
          );
          updatedTables.Floor_3 = updatedTables.Floor_3.filter(
            (table) => table.maBan !== tableMaBan
          );
          return updatedTables;
        });
        setSelectedTable(null); // Reset bàn được chọn
        alert("Bàn đã được xóa thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bàn:", error);
      alert("Lỗi khi xóa bàn.");
    }
  };

  // Render nút chọn tầng
  const renderFloorButton = (floor, label) => (
    <Button
      key={floor}
      onClick={() => handleFloorClick(floor)}
      sx={{
        backgroundColor: selectedFloor === floor ? colors.greenAccent[500] : colors.blueAccent[500],
        color: colors.grey[100],
        fontSize: "14px",
        fontWeight: "bold",
        padding: "1px 50px",
        height: "50px",
        margin: "5px",
        "&:hover": {
          backgroundColor: colors.greenAccent[400],
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <Box m="20px">
      <Header title="Quản Lý Bàn" subtitle="Danh sách bàn" />
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box justifyContent={"space-between"} display={"flex"}>
          
          <Box display="flex" mb={2}
          sx={{
          }}>
            {renderFloorButton("Floor_1", "Tầng 1")}
            {renderFloorButton("Floor_2", "Tầng 2")}
            {renderFloorButton("Floor_3", "Tầng 3")}
            {renderFloorButton("All", "Tất cả")}
          </Box>

          <Box display="flex"justifyContent={'space-between'}  sx={{
          
          }} >
            <Button
              onClick={() => console.log("Sửa bàn")}
              sx={{
                backgroundColor: colors.blueAccent[600],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                margin: "5px",
                padding: "1px 50px",
                height: "50px",
                "&:hover": {
                  backgroundColor: colors.blueAccent[500],
                },
              }}
            >
              Bàn đã đặt
            </Button>
            <Button
              component={Link}
              to="/addtable"
              onClick={() => console.log("Thêm bàn")}
              sx={{
                backgroundColor: colors.blueAccent[600],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 50px",
                margin: "5px",
                height: "50px",
                "&:hover": {
                  backgroundColor: colors.greenAccent[400],
                },
              }}
            >
              Thêm
            </Button>


          </Box>


        </Box>



      </Box>

      {/* Khu vực hiển thị bàn */}
      <Box display="flex" flexDirection="row" gap={3}>
        {/* Danh sách bàn */}
        <Box
          sx={{
            background: colors.blueAccent[700],
            width: "70%",
            height: "500px",
            overflowY: "auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "flex-start",
            p: 2,
            gap: 2,
          }}
        >
          {getTablesByFloor().map((table) => (
            <Box
              key={table.maBan}
              onClick={() => handleTableClick(table)}
              sx={{
                width: 200,
                height: 100,
                bgcolor:
                  selectedTable?.maBan === table.maBan
                    ? colors.redAccent[700] // Đổi màu nếu là bàn được chọn
                    : colors.greenAccent[500], // Màu mặc định
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 2,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Typography variant="h6" color={colors.grey[100]}>
                Bàn: {table.soBan}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Chi tiết bàn */}
        <Box
          sx={{
            backgroundColor: colors.blueAccent[700],
            width: "30%",
            height: "500px",
            p: 2,
            overflowY: "auto",
          }}
        >

          <Typography variant="h5" color={colors.grey[100]} mb={2}>
            Chi tiết bàn
          </Typography>
          {selectedTable ? (
            <Box
              sx={{
                bgcolor: colors.redAccent[600],
                color: colors.grey[100],
                p: 2,
                borderRadius: 1,
              }}
            >
              <Typography>Bàn: {selectedTable.soBan}</Typography>
              <Typography>Số chỗ ngồi: {selectedTable.soChoNgoi}</Typography>
              <Typography>
                Tầng:{" "}
                {selectedTable.maKhuVuc === "KV001"
                  ? "Tầng 1"
                  : selectedTable.maKhuVuc === "KV002"
                    ? "Tầng 2"
                    : "Tầng 3"}
              </Typography>

              <Box display={"flex"} justifyContent={"space-between"}>
                <Button
                  onClick={() => console.log("Sửa bàn")}
                  sx={{
                    backgroundColor: colors.blueAccent[600],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    margin: "5px",
                    padding: "1px 50px",
                    height: "50px",
                    "&:hover": {
                      backgroundColor: colors.greenAccent[400],
                    },
                  }}
                >
                  Sửa
                </Button>
                <Button
                  onClick={() => selectedTable && handleDeleteTable(selectedTable.maBan)} // Gọi hàm xóa khi có bàn được chọn
                  sx={{
                    backgroundColor: colors.blueAccent[600],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "1px 50px",
                    margin: "5px",
                    height: "50px",
                    "&:hover": {
                      backgroundColor: colors.greenAccent[400],
                    },
                  }}
                >
                  Xóa
                </Button>
              </Box>

            </Box>


          ) : (
            <Typography color={colors.grey[100]}>
              Nhấn vào một bàn để xem chi tiết
            </Typography>
          )}
          <Box>

          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default TableMn;
