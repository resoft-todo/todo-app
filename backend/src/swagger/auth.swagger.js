/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Routes for user authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 description: "User's name."
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "User's email address."
 *               password:
 *                 type: string
 *                 format: password
 *                 description: "User's password (min. 6 characters, at least one uppercase letter, one lowercase letter, and one number)."
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: "User's confirm password (min. 6 characters, at least one uppercase letter, one lowercase letter, and one number)."
 *     responses:
 *       201:
 *         description: User registered successfully. 
 *       400:
 *         description: Invalid input data.
 *       409:
 *         description: User with this email already exists.
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User login successful. Returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Invalid credentials.
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Auth]
 *     description: Obtains a new access token.
 *     responses:
 *       200:
 *         description: New access token generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: A new short-lived access token.
 *       401:
 *         description: Refresh token is missing from cookies.
 *       403:
 *         description: Invalid or expired refresh token. The session is no longer valid.
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: Logs out the user by invalidating the current session. Requires a valid access token in the Authorization header.
 *     responses:
 *       200:
 *         description: Logged out successfully.
 *       401:
 *         description: Unauthorized (missing access token).
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Initiate password reset process
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "The email address of the user who forgot their password."
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: "A confirmation message. For security, the response is the same whether the user exists or not."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "If a user with this email exists, a password reset link has been sent."
 *       400:
 *         description: Invalid input data (e.g., malformed email).
 *       500:
 *         description: Connection to host refused.
 */


/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   patch:
 *     summary: Reset user password using a token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: "The password reset token received via email."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: "The user's new password."
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: "Password has been successfully updated."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your password has been successfully updated."
 *       400:
 *         description: "Token is invalid, has expired, or the new password is weak."
 */