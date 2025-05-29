import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './Config/db.js';
import connectCloudinary from './Config/cloudinary.js';
import adminRoute from './Routes/adminroute.js';


const app = express()
dotenv.config()
app.use(cors({
    origin: '*', // Allow requests from all origins
}));
const port = process.env.PORT || 5000;
app.use(express.json())


app.use('/admin', adminRoute)
  

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started successfully at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("Database connection failed", err);
    process.exit(1);
  });
connectCloudinary()