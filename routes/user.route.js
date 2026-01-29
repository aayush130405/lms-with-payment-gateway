import express from "express";
import {authenticateUser, createUserAccount, getCurrentUserProfile, signOutUser, updateUserProfile} from '../controllers/user.controller.js';
import { isAuthenticated } from "../middleware/auth.middleware.js";
import upload from '../utils/multer.js';
import { validateSignup } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post('/signup', validateSignup, createUserAccount);
router.post('/signin', authenticateUser);
router.post('/signout', signOutUser);

router.get('/profile', isAuthenticated, getCurrentUserProfile);
router.patch('/profile', isAuthenticated, upload.single('avatar'), updateUserProfile);

export default router;