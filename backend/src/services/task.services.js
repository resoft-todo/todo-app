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

async function getTasksByStatus(status, userId) {
    const whereClause = {
        list: {
            userId: userId,
        },
    };

    if (status) {
        const statuses = Array.isArray(status) ? status : [status];
        whereClause.status = { in: statuses };
    }

    const tasks = await prisma.task.findMany({
        where: whereClause,
        select: safeTaskSelect,
        orderBy: {
            createdAt: 'desc',
        }
    });

    return tasks;
};


async function getTasksFromList(listId, status, userId) {

    const list = await prisma.list.findFirst({
        where: {
            id: listId,
            userId: userId,
        },
    });

    if (!list) {
        throw new Error("Forbidden: You do not own this list or it does not exist.");
    }

    const queryOptions = {
        where: {
            listId: listId
        }
    };

    if (status) {
        const statuses = Array.isArray(status) ? status : [status];
        queryOptions.where.status = { in: statuses };
    }

    const tasks = await prisma.task.findMany(queryOptions);
    return tasks;
}

async function getDueTasksForReminders() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return prisma.task.findMany({
        where: {
            dueDate: {
                gte: startOfDay,
                lte: endOfDay,
            },
            list:{
                user: {
                    isNotificationOn: true,
                },
            },
        },
        include:{
            list:{
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
}


async function getTasksForToday(userId) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayTasks = await prisma.task.findMany({
        where: {
            dueDate: {
                gte: startOfDay,
                lte: endOfDay,
            },
            list:{
                user: {
                    id: userId
                },
            },
        },
        include:{
            list: {
                select: {
                    name: true
                }
            }
        }
    });

    if(todayTasks.length === 0) {
        throw new Error('No tasks found for reminders today');
    }

    return todayTasks;
}

export default {
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getDueTasksForReminders,
    getTasksForToday,
    getTasksByStatus,
    getTasksFromList
};