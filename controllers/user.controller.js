import { ApiError, catchAsync } from '../middleware/error.middleware';
import { User } from '../models/user.model.js';

export const createUserAccount = catchAsync(async (req, res) => {
    const { name, email, password, role='student' } = req.body;

    const existingUser = await User.findOne({email: email.toLowerCase()});

    if(existingUser) {
        throw new ApiError('User already exists', 400);
    }
})