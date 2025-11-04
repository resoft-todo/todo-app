import express from 'express';
import taskControllers from '../controllers/task.controllers.js';
import authMiddleware from '../middlewares/auth.middleware.js';
const router = express.Router();

router.use(authMiddleware);
router.post('/', taskControllers.createTask);
router.get('/', taskControllers.getTasksByStatus);
router.get('/today', taskControllers.getTasksForToday);
router.get('/:taskId', taskControllers.getTaskById);
router.patch('/:taskId', taskControllers.updateTask);
router.delete('/:taskId', taskControllers.deleteTask);

export default router;
