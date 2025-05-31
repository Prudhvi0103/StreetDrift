import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import  Car  from "../Models/carModel.js"; 
import nodemailer from 'nodemailer';
import { generateJWTToken, generateOtp } from "../utility/utility.js";
import jwt, { decode } from 'jsonwebtoken';
import userModel from '../Models/userModels.js'; // Adjust path as needed


export const Register = async (req, res) => {
  try {
    const userData = req.body;

    // Additional validation (already validated by middleware, but good practice to double-check)
    const requiredFields = ['name', 'email', 'password', 'mobileNumber', 'age', 'gender'];
    for (let field of requiredFields) {
      if (!userData[field] || (typeof userData[field] === 'string' && userData[field].trim() === '')) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    // Convert mobileNumber to Number
    const mobileNumber = Number(userData.mobileNumber);
    if (isNaN(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number must be a valid number',
      });
    }

    // Validate age
    const age = Number(userData.age);
    if (isNaN(age) || age < 18 || age > 100) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a number between 18 and 100',
      });
    }

    // Check for email uniqueness (schema enforces it, but explicit check for better error message)
    const existingUser = await userModel.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Generate userid (e.g., con001, con002)
    const userCount = await userModel.countDocuments();
    const nextIdNumber = userCount + 1;
    const userid = `con${String(nextIdNumber).padStart(3, '0')}`;

    // Set date as ISO string to match schema
    const date = new Date().toISOString();

    // Prepare user data
    const user = {
      ...userData,
      mobileNumber,
      age,
      userid,
      date,
    };

    // Save the user
    const newUser = new userModel(user);
    await newUser.save();

    // Generate JWT token (since Register.jsx expects it)
    const token = jwt.sign({ userId: newUser._id }, process.env.LOGIN_SECRET_KEY || 'your_LOGIN_SECRET_KEY', {
      expiresIn: '1h',
    });

    res.status(201).json({
      success: true,
      message: 'User Registered Successfully',
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to register',
      error: error.message,
    });
  }
};

export const Login = async (req, res) => {
    try {
        const userData = req.body;
        console.log(userData)
        const { email, password } = userData;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User Not Found' });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({ status: false, message: 'Invalid Credentials' });
        }

        const token = generateJWTToken(user);

        return res.status(200).json({
            status: true,
            message: "Login Successful",
            token,
            userid: user.userid
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

// Forgot password;
export const forgotpassword = async (req, res) => {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (user) {
        const otp = generateOtp()

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: "support@consulto.com",
            to: email,
            subject: "Your OTP TO RESET PASSWORD",
            text: `HI,
            ${otp} is your OTP to Reset Password.
            Please Do not share it with anyone.
            Team CONSULTO`,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "OTP sent successfully", otp });
        } catch (err) {
            console.error("Mail error:", err);
            res.status(500).json({ error: "Failed to send OTP" });
        }
    }
    else {
        return res.status(404).json({ status: false, message: 'User Not Found, Please Register First' });
    }


}

// Update Password
export const updatepassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Failed to update password." });
    }
};

export const updateUsers = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, email, mobileNumber, age, gender, address } = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

    // Verify token
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.LOGIN_SECRET_KEY || 'your_LOGIN_SECRET_KEY');
    const requestingUserId = decoded.userId; // Assuming token contains userId

    // Find user by user_id
    const user = await userModel.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Ensure the requesting user can only update their own profile
    if (user.user_id !== requestingUserId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this user' });
    }

    // Validate input fields
    if (email && email !== user.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
      user.email = email;
    }

    if (name && (typeof name !== 'string' || name.trim() === '')) {
      return res.status(400).json({ success: false, message: 'Name must be a non-empty string' });
    }

    if (mobileNumber) {
      const mobile = Number(mobileNumber);
      if (isNaN(mobile)) {
        return res.status(400).json({ success: false, message: 'Mobile number must be a valid number' });
      }
      user.mobileNumber = mobile;
    }

    if (age) {
      const ageNum = Number(age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        return res.status(400).json({ success: false, message: 'Age must be a number between 18 and 100' });
      }
      user.age = ageNum;
    }

    if (gender && !["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({ success: false, message: 'Gender must be Male, Female, or Other' });
    }

    // Update fields if provided
    if (name) user.name = name.trim();
    if (gender) user.gender = gender;
    if (address) user.address = address; // Assuming address is an object, e.g., { city: String }

    // Save updated user
    const updatedUser = await user.save();

    // Return updated user (excluding password)
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        user_id: updatedUser.user_id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobileNumber: updatedUser.mobileNumber,
        age: updatedUser.age,
        gender: updatedUser.gender,
        address: updatedUser.address,
        bookings: updatedUser.bookings,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error in updateUsers:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

// export const getUser = async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ success: false, message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.LOGIN_SECRET_KEY);
//     const user = await userModel.findOne({ user_id: decoded.Id }).select('user_id name -_id');
//     console.log('user:',decoded)
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     res.status(200).json({ success: true, user: { user_id: user.user_id, username: user.name } });
//   } catch (error) {
//     console.error('Error in getUser:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
//   }
// };
export const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.LOGIN_SECRET_KEY);
    console.log('Decoded token:', decoded); // Debug log to check token structure
    
    // Note: Using 'userid' (lowercase) to match your schema
    const user = await userModel.findOne({ userid: decoded.id || decoded.userId }).select('userid name -_id');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ 
      success: true, 
      user: { 
        user_id: user.userid,  // Map to user_id for frontend
        username: user.name 
      } 
    });
  } catch (error) {
    console.error('Error in getUser:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};


export const getCarsCat = async (req, res) => {
  try {
    const category = req.params.category;
    // Use case-insensitive search for car_type
    const cars = await Car.find({ car_type: { $regex: `^${category}$`, $options: 'i' } });
    if (!cars || cars.length === 0) {
      return res.status(404).json({ success: false, message: 'No cars found in this category' });
    }
    res.status(200).json({ success: true, cars });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to fetch cars', error: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { car_id } = req.params;
    const car = await Car.findOne({ car_id });
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.status(200).json({ success: true, car });
  } catch (error) {
    console.error('Error in getCarById:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch car', error: error.message });
  }
};



//bookings

export const createBooking = async (req, res) => {
  try {
    const { car_id, booking_date } = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    if (!car_id) {
      return res.status(400).json({ success: false, message: 'Car ID is required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.LOGIN_SECRET_KEY); // Ensure LOGIN_SECRET_KEY is set in .env
    const userId = decoded.userId; // Assuming token contains userId

    // Find user
    const user = await userModel.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find car
    const car = await Car.findOne({ car_id });
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (!car.available) {
      return res.status(400).json({ success: false, message: 'Car is not available' });
    }

    // Create booking
    const booking = {
      car_id: car.car_id,
      car_name: car.car_name,
      car_model: car.car_model,
      car_type: car.car_type,
      car_price: car.car_price,
      booking_date: booking_date ? new Date(booking_date) : new Date(),
    };

    // Validate booking_date
    if (booking_date && isNaN(Date.parse(booking_date))) {
      return res.status(400).json({ success: false, message: 'Invalid booking date' });
    }

    // Add booking to user's bookings array
    user.bookings.push(booking);
    await user.save();

    // Update car availability
    car.available = false;
    await car.save();

    // Response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      user: {
        user_id: user.user_id,
        username: user.name, // Assuming name is username
        bookings: user.bookings,
      },
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message,
    });
  }
};