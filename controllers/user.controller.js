import { ApiError, catchAsync } from '../middleware/error.middleware';
import { User } from '../models/user.model.js';
import { uploadMedia, deleteMediaFromCloudinary } from '../utils/cloudinary.js';
import { generateToken } from '../utils/generateToken.js';

//create user account
export const createUserAccount = catchAsync(async (req, res) => {
    const { name, email, password, role='student' } = req.body;

    const existingUser = await User.findOne({email: email.toLowerCase()});

    if(existingUser) {
        throw new ApiError('User already exists', 400);
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role
    })

    await user.updateLastActive();
    generateToken(res, user, "Account created successfully");
})

export const authenticateUser = catchAsync(async (req, res) => {
    const {email, password} = req.body;

    const user = User.findOne(({email: email.toLowerCase()})).select('+password');

    if(!user || !(await user.comparePassword(password))) {
        throw new ApiError('Invalid email or password', 401);
    }

    await user.updateLastActive();
    generateToken(res, user, `Welcome back ${user.name}`);
})

export const signOutUser = catchAsync(async (_, res) => {
    res.cookie('token', '', {maxAge: 0});
    res.status(200).json({
        success: true,
        message: "Signed out successfully"
    })
})

export const getCurrentUserProfile = catchAsync(async (req, res) => {
    const user = User.findById(req.id).populate({
        path: "enrolledCourses.course",
        select: "title thumbnail description"
    })

    if(!user) {
        throw new ApiError("User not found", 404);
    }

    res.status(200).json({
        success: true,
        data: {
            ...user.toJSON(),
            totalEnrolledCourses: user.totalEnrolledCourses
        }
    })
})

export const updateUserProfile = catchAsync(async (req, res) => {
    const {name, email} = req.body;
    const updatedData = { 
        name, 
        email: email?.toLowerCase(), 
        bio
    };

    if(req.file) {
        const updatedAvatar = await uploadMedia(req.file.path);
        updatedData.avatar = updatedAvatar.secure_url;

        //delete old avatar
        const user = User.findById(req.id);
        if(user.avatar && user.avatar !== 'default-avatar.png') {
            await deleteMediaFromCloudinary(user.avatar);
        }
    }

    //update user and get updated doc
    const updatedUser = await User.findByIdAndUpdate(
        req.id, 
        updatedData, 
        {new: true, runValidators: true}
    );

    if(!updatedUser) {
        throw new ApiError("Failed to update user", 403);
    }

    res.status(200).json({
        success: true, 
        message: "User updated successfully",
        data: updatedUser
    })
})