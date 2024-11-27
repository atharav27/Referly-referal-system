import express from 'express';
import { getAllUsersForAdmin, deleteUser, getAdmins } from '../controllers/admin.controller.js';
import { verifyRole } from '../utility/verifyRole.js';
import { verifyToken } from '../utility/verifyToken.js';
// import { adminMiddleware } from './middlewares/adminMiddleware.js';

const adminRouter = express.Router();

adminRouter.get('/users' , verifyToken,  verifyRole('admin') ,  getAllUsersForAdmin);
// router.put('/users/:userId',  updateUser);
adminRouter.delete('/delete-user/:userId',  deleteUser);
adminRouter.get('/admin' , verifyToken ,  getAdmins);
adminRouter.delete('/users/:id' , verifyToken , deleteUser );
// adminRouter.get('/admin-user/:userId', verifyToken, verifyRole('admin'), getUserById);


// adminRouter.patch('/users/:userId/toggle-status',  toggleUserStatus);

export default adminRouter;
