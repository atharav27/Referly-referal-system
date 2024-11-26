import express from 'express';
import { getAllUsersForAdmin, deleteUser } from '../controllers/admin.controller.js';
import { verifyRole } from '../utility/verifyRole.js';
import { verifyToken } from '../utility/verifyToken.js';
// import { adminMiddleware } from './middlewares/adminMiddleware.js';

const adminRouter = express.Router();

adminRouter.get('/users' , verifyToken,  verifyRole('admin') ,  getAllUsersForAdmin);
// router.put('/users/:userId',  updateUser);
adminRouter.delete('/delete-user/:userId',  deleteUser);
// adminRouter.patch('/users/:userId/toggle-status',  toggleUserStatus);

export default adminRouter;
