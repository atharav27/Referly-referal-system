import express, { Router } from 'express';
import  { getProfile } from '../controllers/user.controller.js';
import { verifyToken } from '../utility/verifyToken.js';

// signin, google, signOut

const userRouter = express.Router();

userRouter.get("/profile/:userId", verifyToken('user'), getProfile);



           
export default userRouter