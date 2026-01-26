import express from "express";
import {createUserAccount} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', createUserAccount);



export default router;