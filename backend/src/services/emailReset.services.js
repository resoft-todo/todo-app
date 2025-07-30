import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILTRAP_SENDER_EMAIL,
        pass: process.env.MAILTRAP_SENDER_PASSWORD,
    },
});

/**
 * @param {string} email
 * @param {string} token
 */
export const sendPasswordResetEmail = async (userEmail, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
        from: `TodoList <${process.env.MAILTRAP_SENDER_EMAIL}>`,
        to: userEmail,
        subject: 'Request to Reset Password',
        html: `
        <h1>Request to Reset Password</h1>
        <p>To reset your password, click the link below:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>The link will be valid for 10 minutes</p>
        <p>If you did not make this request, please ignore this email</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};