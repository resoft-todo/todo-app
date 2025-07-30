import express from 'express';
import groupControllers from '../controllers/group.controllers.js';
import authMiddleware from '../middlewares/auth.middleware.js';
const router = express.Router();

router.use(authMiddleware);
router.post('/', groupControllers.createGroup);
router.get('/', groupControllers.getUserGroups);
router.get('/:groupId', groupControllers.getGroupById);
router.put('/:groupId', groupControllers.updateGroupName);
router.delete('/:groupId', groupControllers.deleteGroup);

export default router;
