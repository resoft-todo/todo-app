import taskServices from '../services/task.services.js';

async function createTask(req, res) {
    const { listId, title, description, status, dueDate } = req.body;
    const userId = req.user.id;

    if (!listId || !title) {
        return res.status(400).json({ message: 'List ID and title are required' });
    }

    try {
        const newTask = await taskServices.createTask({ listId, title, description, status, dueDate }, userId);
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

async function getTaskByStatus(req, res) {
    const { status } = req.params;
    const userId = req.user.id;

    try {
        const tasks = await taskServices.getTaskByStatus(status, userId);
        res.status(200).json(tasks);
    } catch (error) {
        if (error.message.includes('Forbidden')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

async function getTasksByList(req, res) {
    const { listId } = req.params;
    const userId = req.user.id;

    try {
        const tasks = await taskServices.getTasksByListId(listId, userId);
        res.status(200).json(tasks);
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

    const { title, description, status, dueDate } = req.body;
    const dataToUpdate = { title, description, status, dueDate };

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

export default {
    createTask,
    getTaskById,
    getTaskByStatus,
    getTasksByList,
    updateTask,
    deleteTask
};