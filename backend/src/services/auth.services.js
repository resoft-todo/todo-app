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
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });

    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        } 
    };
};

/**
 * @param {string} tokenFromCookie
 * @return {Promise<{ accessToken: string }>}
 */
async function refreshAccessToken(tokenFromCookie) {
    if (!tokenFromCookie) {
        throw new Error("Refresh token not provided");
    }

    const decoded = jwt.verify(tokenFromCookie, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || !user.refreshToken) {
        throw new Error("Invalid session");
    }

    const isTokenMatch = await bcrypt.compare(tokenFromCookie, user.refreshToken);
    if (!isTokenMatch) {
        throw new Error("Invalid session");
    }

    const newAccessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
    });

    return { accessToken: newAccessToken };
}

/**
 * @param {string} userId
 */
async function logoutUser(userId) {
    await prisma.user.updateMany({
        where: { id: userId, refreshToken: { not: null } },
        data: { refreshToken: null },
    });
};

/**
 * @param {string} email
 */
async function requestPasswordReset(email) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error('Invalid credentials');
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
    refreshAccessToken,
    logoutUser,
};