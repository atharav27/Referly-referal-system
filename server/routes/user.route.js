import express, { Router } from 'express';
import  { getProfile , deleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utility/verifyToken.js';
import { verifyRole } from '../utility/verifyRole.js';

// signin, google, signOut

const userRouter = express.Router();

userRouter.get("/profile/:userId", verifyToken,verifyRole('user'),  getProfile);
userRouter.delete('/delete-profile/:userId', verifyToken,verifyRole('user'), deleteUser);



           
export default userRouter