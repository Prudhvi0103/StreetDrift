import express from "express";
import upload from "../Middleware/multer.js";
import { email, mobileNumber, name, newPassword, password } from "../Middleware/validations.js";
import { Register, Login, forgotpassword, updatepassword, getUser, getCarsCat, updateUsers,createBooking,getCarById } from "../Controllers/userController.js";

const userRoute = express.Router()
userRoute.post('/register', name, email, mobileNumber, password, Register);
userRoute.post('/login',Login)
userRoute.put('/users/:user_id', updateUsers); // for user updatings
userRoute.post('/bookings', createBooking);
userRoute.get('/user',getUser)

userRoute.get('/cars/:car_id', getCarById);
userRoute.post('/forgotpassword', forgotpassword)
userRoute.patch('/updatepassword',newPassword, updatepassword)
userRoute.get('/carcat/:category',getCarsCat)


export default userRoute;