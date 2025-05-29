import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Modal,
    Box,
    TextField,
    MenuItem,
    Grid,
    CircularProgress,
    Fade,
    Input,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [editCar, setEditCar] = useState(null);
    const [addCar, setAddCar] = useState({
        car_name: '',
        car_model: '',
        car_type: '',
        car_enginetype: '',
        car_price: '',
        imagefile: null,
        available: true,
    });
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        let admin;
        try {
            const storedAdmin = localStorage.getItem('Admin');
            console.log('Raw Admin from localStorage:', storedAdmin);
            admin = storedAdmin ? JSON.parse(storedAdmin) : null;
            console.log('Admin Token Check:', admin);
        } catch (error) {
            console.error('Error parsing Admin from localStorage:', error);
            localStorage.removeItem('Admin');
            admin = null;
        }
        if (!admin?.adminToken) {
            console.log('No valid token, redirecting to /admin/login');
            navigate('/admin/login', { replace: true });
        } else {
            fetchCars(admin.adminToken);
        }
    }, [navigate]);

    const fetchCars = async (token) => {
        setLoading(true);
        try {
            console.log('Fetching cars with token:', token);
            const response = await fetch('http://localhost:3277/admin/cars', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 401) {
                    throw new Error(errorData.message || 'Unauthorized: Invalid or expired token');
                }
                throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch cars`);
            }
            const data = await response.json();
            console.log('Cars fetched:', data);
            setCars(data);
            setError(null);
        } catch (error) {
            const errorMessage = error.message || 'Failed to fetch cars';
            console.error('Fetch Cars Error:', errorMessage, error);
            setError(errorMessage);
            toast.error(
                <div>
                    <span style={{ marginRight: '8px' }}>!</span>
                    {errorMessage}
                </div>,
                {
                    position: 'top-center',
                    autoClose: 3000,
                    style: {
                        background: '#d32f2f',
                        color: '#ffffff',
                        fontSize: '1rem',
                        borderRadius: '8px',
                    },
                }
            );
            if (errorMessage.includes('Unauthorized')) {
                console.log('Clearing invalid token and redirecting');
                localStorage.removeItem('Admin');
                navigate('/admin/login', { replace: true });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (car_id) => {
        try {
            const token = JSON.parse(localStorage.getItem('Admin')).adminToken;
            const response = await fetch(`http://localhost:3277/cars/${car_id}/approve`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                toast.success(
                    <div>
                        <span style={{ marginRight: '8px' }}>✔</span>
                        {data.message || 'Car approved/unapproved successfully'}
                    </div>,
                    {
                        position: 'top-center',
                        autoClose: 1500,
                        style: {
                            background: '#4caf50',
                            color: '#ffffff',
                            fontSize: '1rem',
                            borderRadius: '8px',
                        },
                    }
                );
                setCars(cars.map((car) => (car.car_id === car_id ? data.car : car)));
            } else {
                throw new Error(data.message || 'Approval failed');
            }
        } catch (error) {
            const errorMessage = error.message || 'Approval failed';
            console.error('Approve Error:', errorMessage, error);
            toast.error(
                <div>
                    <span style={{ marginRight: '8px' }}>!</span>
                    {errorMessage}
                </div>,
                {
                    position: 'top-center',
                    autoClose: 3000,
                    style: {
                        background: '#d32f2f',
                        color: '#ffffff',
                        fontSize: '1rem',
                        borderRadius: '8px',
                    },
                }
            );
        }
    };

    const handleEdit = (car) => {
        console.log('Editing car with ID:', car.car_id);
        setEditCar({ ...car });
        setImageFile(null);
        setOpenEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name === 'imagefile') {
            setImageFile(e.target.files[0]);
        } else {
            setEditCar((prev) => ({
                ...prev,
                [name]: name === 'car_price' ? parseFloat(value) : value,
            }));
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editCar?.car_id) {
            console.error('No car_id provided for edit');
            toast.error(
                <div>
                    <span style={{ marginRight: '8px' }}>!</span>
                    Invalid car ID
                </div>,
                {
                    position: 'top-center',
                    autoClose: 3000,
                    style: {
                        background: '#d32f2f',
                        color: '#ffffff',
                        fontSize: '1rem',
                        borderRadius: '8px',
                    },
                }
            );
            return;
        }
        try {
            const token = JSON.parse(localStorage.getItem('Admin')).adminToken;
            const formData = new FormData();
            formData.append('car_name', editCar.car_name || '');
            formData.append('car_model', editCar.car_model || '');
            formData.append('car_type', editCar.car_type || '');
            formData.append('car_enginetype', editCar.car_enginetype || '');
            formData.append('car_price', editCar.car_price || 0);
            formData.append('available', editCar.available ?? false);
            if (imageFile) {
                formData.append('image', imageFile);
            } else {
                formData.append('imagefile', editCar.image || '');
            }

            console.log('Submitting edit with FormData:', {
                id: editCar.car_id,
                formData: Object.fromEntries(formData),
            });

            const response = await fetch(`http://localhost:3277/admin/cars/${editCar.car_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                toast.success(
                    (
                        <div>
                            <span style={{ marginRight: '8px' }}>✔</span>
                            Car updated successfully
                        </div>
                    ),
                    {
                        position: 'top-center',
                        autoClose: 1500,
                        style: {
                            background: '#4caf50',
                            color: '#ffffff',
                            fontSize: '1rem',
                            borderRadius: '8px',
                        },
                    },
                );
                setCars(cars.map((car) => (car.car_id === editCar.car_id ? data.car : car)));
                setOpenEditModal(false);
                setEditCar(null);
                setImageFile(null);
            } else {
                throw new Error(data.message || 'Update failed');
            }
        } catch (error) {
            const errorMessage = error.message || 'Update failed';
            console.error('Edit Error:', errorMessage, error);
            toast.error(
                <div>
                    <span style={{ marginRight: '8px' }}>!</span>
                    {errorMessage}
                </div>,
                {
                    position: 'top-center',
                    autoClose: 3000,
                    style: {
                        background: '#d32f2f',
                        color: '#ffffff',
                        fontSize: '1rem',
                        borderRadius: '8px',
                    },
                }
            );
        }
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        if (name === 'imagefile') {
            setAddCar((prev) => ({ ...prev, imagefile: e.target.files[0] }));
        } else {
            setAddCar((prev) => ({
                ...prev,
                [name]: name === 'car_price' ? parseFloat(value) : value,
            }));
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('Admin')).adminToken;
            const formData = new FormData();
            formData.append('car_name', addCar.car_name || '');
            formData.append('car_model', addCar.car_model || '');
            formData.append('car_type', addCar.car_type || '');
            formData.append('car_enginetype', addCar.car_enginetype || '');
            formData.append('car_price', addCar.car_price || 0);
            formData.append('available', addCar.available ?? false);
            if (addCar.imagefile) {
                formData.append('image', addCar.imagefile);
            }

            console.log('Submitting add with FormData:', {
                formData: Object.fromEntries(formData),
            });

            const response = await fetch('http://localhost:3277/admin/cars', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                toast.success(
                    <div>
                        <span style={{ marginRight: '8px' }}>✔</span>
                        Car added successfully
                    </div>,
                    {
                        position: 'top-center',
                        autoClose: 1500,
                        style: {
                            background: '#4caf50',
                            color: '#ffffff',
                            fontSize: '1rem',
                            borderRadius: '8px',
                        },
                    }
                );
                setCars([...cars, data.car]);
                setOpenAddModal(false);
                setAddCar({
                    car_name: '',
                    car_model: '',
                    car_type: '',
                    car_enginetype: '',
                    car_price: '',
                    imagefile: null,
                    available: true,
                });
            } else {
                throw new Error(data.message || 'Failed to add car');
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to add car';
            console.error('Add Error:', errorMessage, error);
            toast.error(
                <div>
                    <span style={{ marginRight: '8px' }}>!</span>
                    {errorMessage}
                </div>,
                {
                    position: 'top-center',
                    autoClose: 3000,
                    style: {
                        background: '#d32f2f',
                        color: '#ffffff',
                        fontSize: '1rem',
                        borderRadius: '8px',
                    },
                }
            );
        }
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('Admin');
            toast.success(
                <div>
                    <span style={{ marginRight: '8px' }}>✔</span>
                    Logged out successfully
                </div>,
                {
                    position: 'top-center',
                    autoClose: 1500,
                    style: {
                        background: '#4caf50',
                        color: '#ffffff',
                        fontSize: '1rem',
                        borderRadius: '8px',
                    },
                }
            );
            console.log('Logging out, redirecting to /admin/login');
            setTimeout(() => navigate('/admin/login', { replace: true }), 1000);
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    const groupedCars = useMemo(() => {
        return cars.reduce((acc, car) => {
            acc[car.car_type] = acc[car.car_type] || [];
            acc[car.car_type].push(car);
            return acc;
        }, {});
    }, [cars]);
    //----------------------------------------------------------------------------------------------------------------------------------------
    return (
        <div className="admin-dashboard" role="main" aria-labelledby="dashboard-title">
            <Button
                variant="outlined"
                className="logout-button"
                onClick={handleLogout}
                aria-label="Logout"
                sx={{
                    position: 'fixed', // changed to fixed to keep it at the bottom right corner even when scrolling
                    bottom: 16, // adjusted the bottom position
                    right: 16,
                }}
            >
                Logout
            </Button>
            <Typography id="dashboard-title" variant="h4" className="dashboard-title">
                Admin Dashboard
            </Typography>
            {loading && (
                <Box className="loading-container">
                    <CircularProgress color="error" />
                </Box>
            )}
            {error && (
                <Typography color="error" className="error-message">
                    {error}
                </Typography>
            )}
            {!loading && !error && Object.keys(groupedCars).length === 0 && (
                <Typography className="no-cars">No cars available.</Typography>
            )}
            {Object.keys(groupedCars).map((carType) => (
                <div key={carType} className="car-category">
                    <Typography variant="h5" className="category-title">
                        {carType}
                    </Typography>
                    <Grid container spacing={2}>
                        {groupedCars[carType].map((car) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={car.car_id}>
                                <Fade in={true} timeout={500}>
                                    <Card className="car-card" aria-label={`Car: ${car.car_name}`}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            width="180"
                                            image={car.image || '/placeholder.jpg'}
                                            alt={car.car_name}
                                            className="car-image"
                                            loading="lazy"
                                        />
                                        <CardContent>
                                            <Typography variant="h6" noWrap>
                                                {car.car_name}
                                            </Typography>
                                            <Typography variant="body2">ID: {car.car_id}</Typography>
                                            <Typography variant="body2">Model: {car.car_model}</Typography>
                                            <Typography variant="body2">Type: {car.car_type}</Typography>
                                            <Typography variant="body2">Engine: {car.car_enginetype}</Typography>
                                            <Typography variant="body2">Price: ₹{car.car_price.toLocaleString()}</Typography>
                                            <Typography variant="body2">
                                                Status: {car.available ? 'Available' : 'Unavailable'}
                                            </Typography>
                                            {/* <Typography variant="body2">
                                                Added: {new Date(car.createdAt).toLocaleDateString()}
                                            </Typography> */}
                                            <div className="card-actions">
                                                <Button
                                                    variant="contained"
                                                    className="approve-button"
                                                    onClick={() => handleApprove(car.car_id)}
                                                    aria-label={car.available ? `Unapprove ${car.car_name}` : `Approve ${car.car_name}`}
                                                >
                                                    {car.available ? 'Unapprove' : 'Approve'}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    className="edit-button"
                                                    onClick={() => handleEdit(car)}
                                                    aria-label={`Edit Car ${car.car_name}`}
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                    variant="contained"
                    className="add-car-button"
                    onClick={() => setOpenAddModal(true)}
                    aria-label="Add New Car"
                >
                    Add Car
                </Button>
            </Box>
            <Modal
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    setImageFile(null);
                }}
                aria-labelledby="edit-car-modal"
                closeAfterTransition
            >
                <Fade in={openEditModal}>
                    <Box className="edit-modal" role="dialog" aria-labelledby="edit-car-modal">
                        <Typography id="edit-car-modal" variant="h6" className="modal-title">
                            Edit Car
                        </Typography>
                        <form onSubmit={handleEditSubmit} noValidate>
                            <TextField
                                label="Car ID"
                                name="car_id"
                                value={editCar?.car_id || ''}
                                onChange={handleEditChange}
                                fullWidth
                                margin="normal"
                                disabled
                                InputProps={{ 'aria-readonly': true }}
                            />
                            <TextField
                                label="Car Name"
                                name="car_name"
                                value={editCar?.car_name || ''}
                                onChange={handleEditChange}
                                fullWidth
                                margin="normal"
                                required
                                inputProps={{ maxLength: 50 }}
                            />
                            <TextField
                                label="Car Model"
                                name="car_model"
                                value={editCar?.car_model || ''}
                                onChange={handleEditChange}
                                fullWidth
                                margin="normal"
                                required
                                inputProps={{ maxLength: 50 }}
                            />
                            <TextField
                                select
                                label="Car Type"
                                name="car_type"
                                value={editCar?.car_type || ''}
                                onChange={handleEditChange}
                                fullWidth
                                margin="normal"
                                required
                            >
                                {['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck', 'Van', 'Convertible'].map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Engine Type"
                                name="car_enginetype"
                                value={editCar?.car_enginetype || ''}
                                onChange={handleEditChange}
                                fullWidth
                                margin="normal"
                                required
                            >
                                {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Price"
                                name="car_price"
                                type="number"
                                value={editCar?.car_price || ''}
                                onChange={handleEditChange}
                                fullWidth
                                margin="normal"
                                required
                                inputProps={{ min: 0, step: 1 }}
                            />
                            <Box sx={{ margin: '16px 0' }}>
                                <Typography variant="body2">Current Image:</Typography>
                                {editCar?.image && (
                                    <img
                                        src={editCar.image}
                                        alt="Current car"
                                        style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '8px' }}
                                    />
                                )}
                            </Box>
                            <Input
                                type="file"
                                name="imagefile"
                                onChange={handleEditChange}
                                fullWidth
                                inputProps={{ accept: 'image/*', 'aria-label': 'Upload new car image' }}
                                sx={{ margin: '16px 0' }}
                            />
                            <TextField
                                select
                                label="Availability"
                                name="available"
                                value={editCar?.available ?? false}
                                onChange={handleEditChange}
                                fullWidth
                                margin="normal"
                                required
                            >
                                <MenuItem value={true}>Available</MenuItem>
                                <MenuItem value={false}>Unavailable</MenuItem>
                            </TextField>
                            <div className="modal-actions">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="save-button"
                                    aria-label="Save changes"
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    className="cancel-button"
                                    onClick={() => {
                                        setOpenEditModal(false);
                                        setImageFile(null);
                                    }}
                                    aria-label="Cancel"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={openAddModal}
                onClose={() => {
                    setOpenAddModal(false);
                    setAddCar({
                        car_name: '',
                        car_model: '',
                        car_type: '',
                        car_enginetype: '',
                        car_price: '',
                        imagefile: null,
                        available: true,
                    });
                }}
                aria-labelledby="add-car-modal"
                closeAfterTransition
            >
                <Fade in={openAddModal}>
                    <Box className="edit-modal" role="dialog" aria-labelledby="add-car-modal">
                        <Typography id="add-car-modal" variant="h6" className="modal-title">
                            Add New Car
                        </Typography>
                        <form onSubmit={handleAddSubmit} noValidate>
                            <TextField
                                label="Car Name"
                                name="car_name"
                                value={addCar.car_name}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                                required
                                inputProps={{ maxLength: 50 }}
                            />
                            <TextField
                                label="Car Model"
                                name="car_model"
                                value={addCar.car_model}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                                required
                                inputProps={{ maxLength: 50 }}
                            />
                            <TextField
                                select
                                label="Car Type"
                                name="car_type"
                                value={addCar.car_type}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                                required
                            >
                                {['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck', 'Van', 'Convertible'].map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Engine Type"
                                name="car_enginetype"
                                value={addCar.car_enginetype}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                                required
                            >
                                {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Price"
                                name="car_price"
                                type="number"
                                value={addCar.car_price}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                                required
                                inputProps={{ min: 0, step: 1 }}
                            />
                            <Input
                                type="file"
                                name="imagefile"
                                onChange={handleAddChange}
                                fullWidth
                                inputProps={{ accept: 'image/*', 'aria-label': 'Upload car image' }}
                                sx={{ margin: '16px 0' }}
                                required
                            />
                            <TextField
                                select
                                label="Availability"
                                name="available"
                                value={addCar.available}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                                required
                            >
                                <MenuItem value={true}>Available</MenuItem>
                                <MenuItem value={false}>Unavailable</MenuItem>
                            </TextField>
                            <div className="modal-actions">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="save-button"
                                    aria-label="Add car"
                                >
                                    Add
                                </Button>
                                <Button
                                    variant="outlined"
                                    className="cancel-button"
                                    onClick={() => {
                                        setOpenAddModal(false);
                                        setAddCar({
                                            car_name: '',
                                            car_model: '',
                                            car_type: '',
                                            car_enginetype: '',
                                            car_price: '',
                                            imagefile: null,
                                            available: true,
                                        });
                                    }}
                                    aria-label="Cancel"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Box>
                </Fade>
            </Modal>
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
};

export default AdminDashboard;