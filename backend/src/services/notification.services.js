import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILTRAP_SENDER_EMAIL,
        pass: process.env.MAILTRAP_SENDER_PASSWORD,
    },
});

/**
 * @param {string} userEmail 
 * @param {Array<object>} tasks
 * @returns {Promise<void>}
 */
async function sendEmailReminder(userEmail, tasks) {
    const emailContent = `Hello! This is a reminder for your tasks due today:\n\n` +
                        tasks.map(t => `- ${t.title}`).join('\n');

    const mailOptions = {
        from: `TodoList <${process.env.MAILTRAP_SENDER_EMAIL}>`,
        to: userEmail,
        subject: `You have ${tasks.length} tasks due today`,
        text: emailContent,
    };

    await transporter.sendMail(mailOptions);
};

export default {
    sendEmailReminder
}