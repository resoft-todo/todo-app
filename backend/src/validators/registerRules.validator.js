import { body } from 'express-validator';
import prisma from '../prisma.js';


export const registerRules = () => {
    return [
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please enter a valid email address')
            .custom(async (value) => {

                const user = await prisma.user.findUnique({
                    where: { email: value },
                });

                if (user) {
                    throw new Error('Email already exists');
                }

                return true;
            }),

        body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

        body('confirmPassword')
            .custom((value, { req }) => {
                
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }

                return true;
            }),
    ];
};