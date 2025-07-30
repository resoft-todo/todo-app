import express from 'express';
import authController from '../controllers/auth.controllers.js';
import { registerRules } from '../validators/registerRules.validator.js';
import { loginRules } from '../validators/loginRules.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.post('/register', registerRules(), validate, authController.register);
router.post('/login', loginRules(), validate, authController.login);
router.post('/forgot-password', authController.requestPasswordReset);
router.patch('/reset-password/:token', authController.resetPassword);

export default router;
