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

        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: false, 
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken: data.accessToken,
            user: data.user,
        });
    }
    catch (error) {
        if (error.message.includes('Invalid credentials')) {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

async function refresh(req, res) {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is missing' });
        }
        const data = await authService.refreshAccessToken(refreshToken);
        res.status(200).json({ accessToken: data.accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid session. Please log in again' });
    }
};

async function logout(req, res) {
    try {
        const userId = req.user.id;
        
        if(!userId){
            return res.status(401).json({ message: 'Unauthorized'});
        }

        await authService.logoutUser(userId);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false, 
            sameSite: 'strict',
            path: '/' 
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
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
        
        if(error.message.includes('Invalid credentials')){
            return res.status(400).json({ message: 'Bad request', error: error.message });
        }

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
    refresh,
    logout
};
