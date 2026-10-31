const mongoose = require('mongoose')

const { Schema} = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        default: ""
    },
    avatar:{
        type: String,
        default: ""
    },
    date:{
        type: Date,
        default: Date.now
    },
    role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
    // No default on purpose: accounts created before email verification
    // existed have no value and are treated as verified.
    isVerified: {
        type: Boolean
    },
    // OTP fields are hidden from queries unless explicitly selected
    otp: {
        type: String,
        select: false
    },
    otpPurpose: {
        type: String,
        enum: ["verify", "reset"],
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    },
    otpAttempts: {
        type: Number,
        default: 0,
        select: false
    },
    otpLastSent: {
        type: Date,
        select: false
    },
})

module.exports = mongoose.model('user', UserSchema);
