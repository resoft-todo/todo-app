import authService from '../services/auth.services.js';

async function register(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if(!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Name, email, password, and confirm password are required' });
    }

    try{
        const newUser = await authService.registerUser(name, email, password);
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    }
    catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

async function login(req, res) {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try{
        const data = await authService.loginUser(email, password);
        res.status(200).json({
            message: 'Login successful',
            token: data.token,
            user: data.user,
        });
    }
    catch (error) {
        if (error.message.includes('invalid credentials')) {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

async function requestPasswordReset(req, res) {
    const { email } = req.body;
    if(!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        await authService.requestPasswordReset(email);
        res.status(200).json({ message: 'Password reset email sent if the email exists' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

async function resetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    try {
        await authService.resetPassword(token, password);
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export default {
    register,
    login,
    requestPasswordReset,
    resetPassword,
};
