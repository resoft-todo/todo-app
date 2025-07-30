import prisma from "../prisma.js";

const safeTaskSelect = {
    id: true,
    title: true,
    description: true,
    status: true,
    dueDate: true,
    createdAt: true,
    updatedAt: true,
    list: {
        select: {
            id: true,
            name: true,
        },
    },
};


async function createTask(taskData, userId) {
    const { listId, title, description, status, dueDate } = taskData;

    const list = await prisma.list.findFirst({
        where: {
            id: listId,
            userId: userId,
        },
    });

    if (!list) {
        throw new Error("Forbidden: You do not own this list or it does not exist.");
    }

    const task = await prisma.task.create({
        data: {
            listId,
            title,
            description,
            status,
            dueDate,
        },
        select: safeTaskSelect,
    });
    return task;
};


async function getTaskById(taskId, userId) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            list: { 
                userId: userId,
            },
        },
        select: safeTaskSelect,
    });
    return task; 
};

/**
 * @param {string} status 
 * @param {string} userId 
 * @returns {Promise<Array<object>>}  
 */
async function getTaskByStatus(status, userId) {
    try {
        if (!status) {
            throw new Error('Status is required');
        }

        const validStatuses = ['not_started', 'in_progress', 'completed'];

        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
        }

        const tasks = await prisma.task.findMany({
            where: {
                status: status,
                list: {
                    userId: userId,
                },
            },
            select: safeTaskSelect,
            orderBy: { createdAt: 'desc' },
        });
        return tasks;

    } catch (error) {
        console.error('Error fetching tasks by status:', error);
    }
    
};

async function getTasksByListId(listId, userId) {
    const list = await prisma.list.findFirst({
        where: {
            id: listId,
            userId: userId,
        }
    });

    if (!list) {
        throw new Error("Forbidden: You do not own this list or it does not exist.");
    }

    return prisma.task.findMany({
        where: { listId: listId },
        select: safeTaskSelect,
        orderBy: { createdAt: 'desc' },
    });
};


async function updateTask(taskId, data, userId) {

    const existingTask = await getTaskById(taskId, userId);
    if (!existingTask) {
        return null;
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: data, 
        select: safeTaskSelect,
    });
    return updatedTask;
}

async function deleteTask(taskId, userId) {
    const existingTask = await getTaskById(taskId, userId);
    if (!existingTask) {
        return null;
    }

    await prisma.task.delete({
        where: { id: taskId },
    });

    return { id: taskId }; 
}

export default {
    createTask,
    getTaskById,
    getTaskByStatus,
    getTasksByListId,
    updateTask,
    deleteTask
};