import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { sendPasswordResetEmail } from './emailReset.services.js';

async function registerUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return { id: newUser.id, email: newUser.email, name: newUser.name };
}

async function loginUser(email, password) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    return { 
        token, 
        user: { 
            name: user.name, 
            email: user.email 
        } 
    };
}

/**
 * @param {string} email
 */
async function requestPasswordReset(email) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
        where: { email },
        data: { passwordResetToken, passwordResetExpires },
    });

    await sendPasswordResetEmail(email, resetToken);
};


/**
 * @param {string} token
 * @param {string} newPassword
 */
async function resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
        where: {
            passwordResetToken: hashedToken,
            passwordResetExpires: {
                gt: new Date(),
            },
        },
    });

    if (!user) {
        throw new Error('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null,
        },
    });
}

export default {
    registerUser,
    loginUser,
    requestPasswordReset,
    resetPassword,
};