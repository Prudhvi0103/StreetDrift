import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    mobileNumber: {
        type: Number,
        default: 0
    },
    userid: {
        type: String,
        required: true
    },
    bookings: {
        type: [{
            type: Object,
            required: false
        }]
    },
    date: {
        type: String,
    }
})

const userModel = mongoose.models.users || mongoose.model('users', userSchema)

export default userModel;