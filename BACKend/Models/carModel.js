
import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    car_id: {
      type: String,
      required: [true, "Car ID is required"],
      unique: true, // Ensure car_id is unique
      trim: true, // Remove whitespace
    },
    car_name: {
      type: String,
      required: [true, "Car name is required"],
      trim: true,
    },
    car_model: {
      type: String,
      required: [true, "Car model is required"],
      trim: true,
    },
    car_type: {
      type: String,
      required: [true, "Car type is required"],
      enum: {
        values: ["Sedan", "SUV", "Hatchback", "Coupe", "Truck", "Van", "Convertible"], // Example values
        message: "{VALUE} is not a valid car type",
      },
      trim: true,
    },
    car_enginetype: {
      type: String,
      required: [true, "Engine type is required"],
      enum: {
        values: ["Petrol", "Diesel", "Electric", "Hybrid"], // Example values
        message: "{VALUE} is not a valid engine type",
      },
      trim: true,
    },
    car_price: {
      type: Number,
      required: [true, "Car price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      // Basic validation for URL format (optional, can be enhanced)
      match: [/^https?:\/\/.+/, "Please provide a valid image URL"],
    },
    available: {
      type: Boolean,
      required: [true, "Availability status is required"],
      default: true, // Default to true if not specified
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Use singular, capitalized model name for convention
const Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export default Car;