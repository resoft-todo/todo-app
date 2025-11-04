import cron from 'node-cron';
import taskService from '../services/task.services.js';
//import notificationService from '../services/notification.services.js';
import { userSocketMap } from '../webSocket/webSocket.js';

let ioInstance;

function start(socketIoInstance) {

    ioInstance = socketIoInstance;
    
    cron.schedule('*/10 * * * * ', async () => {
        try {
            const tasks = await taskService.getDueTasksForReminders();

            if (tasks.length === 0) {
                console.log('No tasks found for reminders today');
                return;
            }
        
            const tasksByUser = new Map();
            for (const task of tasks) {
                const user = task.list.user; 
                
                if (!tasksByUser.has(user.id)) {
                    tasksByUser.set(user.id, {
                        email: user.email,
                        tasks: [],
                    });
                }

                tasksByUser.get(user.id).tasks.push(task);
            }


            //const sendPromises = [];
            for (const [userId, data] of tasksByUser.entries()) {
                //sendPromises.push(notificationService.sendEmailReminder(data.email, data.tasks));

                const userSocketId = userSocketMap.get(userId);
                if (userSocketId) {
                    ioInstance.to(userSocketId).emit('todayTasks', data.tasks);
                }
                else {
                    console.log(`User ${userId} is not currently connected via WebSocket`);
                }
            }

            //await Promise.all(sendPromises);

        } catch (error) {
            console.error('An error occurred during the reminder job:', error);
        }
    });
};


export default{
    start
};