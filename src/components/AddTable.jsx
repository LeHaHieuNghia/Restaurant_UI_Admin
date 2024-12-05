import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Box,
    Container,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AddTable = () => {
    const [formData, setFormData] = useState({
        soBan: '',
        soChoNgoi: '',
        soKhuVuc: '',
        image: null,
    });

    const [khuVucList, setKhuVucList] = useState([]); // Danh sách khu vực từ API
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Gọi API để lấy danh sách khu vực
    useEffect(() => {
        const fetchKhuVuc = async () => {
            try {
                const response = await axios.get('https://103.153.68.148/api/Ban/create');
                setKhuVucList(response.data.khuVuc || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách khu vực:', error);
                setSnackbarMessage('Không thể tải danh sách khu vực');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        };

        fetchKhuVuc();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value,
        }));
    };

    const handleDropdownChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            soKhuVuc: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('soBan', formData.soBan);
        formDataToSubmit.append('soChoNgoi', formData.soChoNgoi);
        formDataToSubmit.append('soKhuVuc', formData.soKhuVuc);
        if (formData.image) {
            formDataToSubmit.append('image', formData.image);
        }

        try {
            await axios.post('https://103.153.68.148/api/Ban/create', formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSnackbarMessage('Thêm bàn thành công!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            setFormData({
                soBan: '',
                soChoNgoi: '',
                soKhuVuc: '',
                image: null,
            });
        } catch (error) {
            setSnackbarMessage('Có lỗi xảy ra: ' + error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            console.error('Lỗi khi submit form:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "#4B4376",
                }}
            >
                <Typography component="h1" variant="h5" color="white">
                    Đăng Ký Bàn
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="soBan"
                        label="Số Bàn"
                        name="soBan"
                        value={formData.soBan}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="number"
                        id="soChoNgoi"
                        label="Số Chỗ Ngồi"
                        name="soChoNgoi"
                        inputProps={{ min: 1, style: { color: 'white' } }}
                        value={formData.soChoNgoi}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: 'white' } }}
                    />

                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="select-khu-vuc-label" style={{ color: 'white' }}>
                                Mã khu vực
                            </InputLabel>
                            <Select
                                labelId="select-khu-vuc-label"
                                id="soKhuVuc"
                                name="soKhuVuc"
                                value={formData.soKhuVuc}
                                onChange={handleDropdownChange}
                                inputProps={{ style: { color: 'white' } }}
                            >
                                <MenuItem value="KV001">KV001</MenuItem>
                                <MenuItem value="KV002">KV002</MenuItem>
                                <MenuItem value="KV003">KV003</MenuItem>
                                {khuVucList.map((khuVuc) => (
                                    <MenuItem key={khuVuc.id} value={khuVuc.id}>
                                        {khuVuc.tenKhuVuc}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mt: 2, mb: 2, color: 'white', borderColor: 'white' }}
                    >
                        Tải Hình Ảnh
                        <input
                            type="file"
                            name="image"
                            hidden
                            accept="image/*"
                            onChange={handleChange}
                            multiple={false}
                        />
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Đăng Ký
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddTable;
