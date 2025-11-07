import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxLength: [50, "Name can not exceed 50 characters"]
    },
    email: {
        type: String, 
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ , 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password should have atleast 8 characters"],
        select: false       //remove this field from basic SELECT query
    },
    role: {
        type: String,
        enum: {
            values: ['student', 'admin', 'instructor'],
            message: "Please select a valid role"
        },
        default: 'student'
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    bio: {
        type: String,
        maxLength: [200, "Bio can not exceed 200 characters"]
    },
    enrolledCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

//hashing the password before saving the schema
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()      //to pass onto next task after executing this one
})

export const User = mongoose.model("User", userSchema)
