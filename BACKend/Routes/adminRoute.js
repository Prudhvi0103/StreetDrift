import express from "express";
import {addCar,adminLogin,getCars,addAdmin,editCar} from '../Controllers/adminController.js';
import upload from "../Middleware/multer.js";
import {password,adminPassword } from "../Middleware/validations.js";


const adminRoute = express.Router();

adminRoute.post('/cars', upload.single("image"), addCar);
adminRoute.get("/cars" , getCars)
adminRoute.post('/login',adminLogin)
adminRoute.put('/cars/:id', upload.single('imagefile'), editCar);
adminRoute.post('/sign',adminPassword,addAdmin)


export default adminRoute;
