import express from "express";
import {createUserAccount} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/signup', createUserAccount);



export default router;