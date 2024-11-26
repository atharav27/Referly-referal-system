import express, { Router } from 'express';
import  {signup , login ,sendVerificationOTP , verifyOTP } from '../controllers/auth.controller.js';
import { verifyToken } from '../utility/verifyToken.js';

// signin, google, signOut

const authRouter = express.Router();

authRouter.post('/signup', signup)
authRouter.post('/signin', login)
authRouter.post('/send-verification-otp', sendVerificationOTP);
authRouter.post('/verify-otp', verifyOTP);
// authRouter.post('/signin', signin)
// authRouter.post('/google', google)
// authRouter.get('/signout', signOut)

           
export default authRouter