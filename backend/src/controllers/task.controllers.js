import taskServices from '../services/task.services.js';
import { formatDate } from '../utils/formatDate.utils.js';

async function createTask(req, res) {
    const { listId, title, description, status, dueDate } = req.body;
    const userId = req.user.id;

    if (!listId || !title) {
        return res.status(400).json({ message: 'List ID and title are required' });
    }

    if(!userId){
        return res.status(401).json({ message: 'Unauthorized'});
    }

    let finalDueDate = null;

    if (dueDate) {
        try {
            finalDueDate = formatDate(dueDate);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    try {
        const newTask = await taskServices.createTask({ listId, title, description, status, dueDate: finalDueDate }, userId);
        res.status(201).json(newTask);
    } catch (error) {
        if (error.message.includes('Forbidden')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}

async function getTaskById(req, res) {
    const { taskId } = req.params;
    const userId = req.user.id;

    if(!userId){
        return res.status(401).json({ message: 'Unauthorized'});
    }

    try {
        const task = await taskServices.getTaskById(taskId, userId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to view it.' });
        }
        res.status(200).json(task);
    } catch (error) {
        if (error.message.includes('Forbidden')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

async function updateTask(req, res) {
    const { taskId } = req.params;
    const userId = req.user.id;

    if(!userId){
        return res.status(401).json({ message: 'Unauthorized'});
    }

    const { title, description, status, dueDate } = req.body;

    let finalDueDate;

    if (dueDate) {
        try {
            finalDueDate = formatDate(dueDate);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    const dataToUpdate = { title, description, status, dueDate: finalDueDate };

    try {
        const updatedTask = await taskServices.updateTask(taskId, dataToUpdate, userId);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to edit it.' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function deleteTask(req, res) {
    const { taskId } = req.params;
    const userId = req.user.id;

    if(!userId){
        return res.status(401).json({ message: 'Unauthorized'});
    }

    try {
        const deletedTask = await taskServices.deleteTask(taskId, userId);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to delete it.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getTasksByStatus(req, res) {
    const { status } = req.query;
    const userId = req.user.id;

    if(!userId){
        return res.status(401).json({ message: 'Unauthorized'});
    }

    try {
        const tasks = await taskServices.getTasksByStatus(status, userId);
        res.status(200).json(tasks);
    } catch (error) {
        if (error.message.includes('Forbidden')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

async function getTasksFromList(req, res) {
    const { listId } = req.params;
    const { status } = req.query;
    const userId = req.user.id;

    if(!userId){
        return res.status(401).json({ message: 'Unauthorized'});
    }
    
    try {
        const tasks = await taskServices.getTasksFromList(listId, status, userId);
        res.status(200).json(tasks);
    } catch (error) {
        if (error.message.includes('Forbidden')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};


async function getTasksForToday(req, res) {
    const userId = req.user.id;

    if(!userId){
        return res.status(401).json({ message: 'Unauthorized'});
    }

    try {
        const tasks = await taskServices.getTasksForToday(userId);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default {
    createTask,
    getTaskById,
    getTasksByStatus,
    getTasksFromList,
    getTasksForToday,
    updateTask,
    deleteTask
};