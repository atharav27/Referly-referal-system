import express, { Router } from 'express';
import  {signup , login } from '../controllers/auth.controller.js';

// signin, google, signOut

const authRouter = express.Router();

authRouter.post('/signup', signup)
authRouter.post('/signin', login)
// authRouter.post('/signin', signin)
// authRouter.post('/google', google)
// authRouter.get('/signout', signOut)

           
export default authRouter