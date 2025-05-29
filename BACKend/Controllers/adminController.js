import  Car  from "../Models/carModel.js"; 
import User from "../Models/userModels.js"; 
import adminModel from "../Models/adminModel.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config()


export const addCar = async (req, res) => {
  try {
    const data = req.body;
    const imagefile = req.file;

    // Generate unique car_id
    const carCount = await Car.countDocuments();
    const nextIdNumber = carCount + 1;
    const car_id = `CAR${String(nextIdNumber).padStart(3, "0")}`;

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imagefile.path, {
      resource_type: "image",
    });
    const image = imageUpload.secure_url;

    // Prepare car data
    const carData = {
      ...data,
      car_id,
      image,
      available: data.available ?? true, // Use default if not provided
    };

    // Save to DB
    const newCar = new Car(carData);
    await newCar.save();

    res.status(200).json({
      success: true,
      message: "Car added successfully",
    });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(400).json({ success: false, message: "Failed to add car" });
  }
};

export const editCar = async (req, res) => {
  try {
    const carId = req.params.id; // Changed from carId to id to match route
    const data = req.body;
    const imagefile = req.file;

    // Find the car to update
    const car = await Car.findOne({ car_id: carId });
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Update image if new image is provided
    let image = car.image;
    if (imagefile) {
      // Upload new image to Cloudinary
      const imageUpload = await cloudinary.uploader.upload(imagefile.path, {
        resource_type: "image",
      });
      image = imageUpload.secure_url;
    }

    // Prepare updated car data
    const updatedCarData = {
      car_name: data.car_name || car.car_name,
      car_model: data.car_model || car.car_model,
      car_type: data.car_type || car.car_type,
      car_enginetype: data.car_enginetype || car.car_enginetype,
      car_price: data.car_price || car.car_price,
      available: data.available !== undefined ? data.available : car.available,
      image: image
    };

    // Update car in DB
    const updatedCar = await Car.findOneAndUpdate(
      { car_id: carId },
      updatedCarData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update car",
    });
  }
};


export const getCars = async (req, res) => {
    try {
        const allCars = await Car.find()
        res.status(200).json(allCars)
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed get the Car', error })
    }
}

//admin login-------------------------------------------------------------------------------------------------------------------------------------

export const adminLogin = async (req, res) => {
    try {
        const { adminid, adminPassword } = req.body;

        const admin = await adminModel.findOne({ adminid })
        if (!admin) {
            return res.status(404).json({ sucess: false, message: 'Admin Not Found' })
        }
        const isValidPassword = adminPassword === admin.adminPassword
        if (!isValidPassword) {
            return res.status(401).json({ sucess: false, message: 'Enter Correct Password' })
        }

        let token = jwt.sign({ adminid }, process.env.LOGIN_SECRET_KEY)
        res.status(200).json({ sucess: true, message: 'Login Sucessful', token })


    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: 'Failed to Login' })
    }
}

export const addAdmin = async (req, res) => {
  try {
    const { adminid, adminPassword } = req.body;

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ adminid });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists',
      });
    }

    // Create new admin
    const newAdmin = new adminModel({
      adminid,
      adminPassword,
    });

    // Save admin to database
    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Admin added successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Failed to add admin',
    });
  }
};

//test
export const addUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    console.log("User saved:", savedUser);
    res.json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
};