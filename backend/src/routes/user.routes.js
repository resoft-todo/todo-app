import express from 'express';
import userController from '../controllers/user.controllers.js';
import authMiddleware from '../middlewares/auth.middleware.js';
const router = express.Router();


router.use(authMiddleware);
router.get('/', userController.getAllUsers);
router.get('/me', userController.getMyProfile);
router.patch('/me/name', userController.changeUserName);
router.delete('/me', userController.deleteMyProfile);

export default router;