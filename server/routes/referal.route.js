import express, { Router } from 'express';
import  { getReferredUsers } from '../controllers/referal.controller.js';
import { verifyToken } from '../utility/verifyToken.js';

// signin, google, signOut

const referalRouter = express.Router();

referalRouter.get("/referals/:userId", verifyToken, getReferredUsers);



           
export default referalRouter