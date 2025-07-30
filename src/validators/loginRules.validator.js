import { body } from 'express-validator';

export const loginRules = () => {
    return [
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please enter a valid email address'),

        body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    ];
};