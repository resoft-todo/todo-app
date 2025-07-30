/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: API to manage user's groups. Requires authentication.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the group.
 *         name:
 *           type: string
 *           description: The name of the group.
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The id of the user who owns the group.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the group was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the group was last updated.
 *       example:
 *         id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *         name: "Work Projects"
 *         userId: "c8b7a6b5-a4d3-3c2b-2a1b-9c8d7e6f5a4d"
 *         createdAt: "2023-11-01T12:00:00.000Z"
 *         updatedAt: "2023-11-01T12:00:00.000Z"
 */

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name for the new group.
 *     responses:
 *       201:
 *         description: Group created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       400:
 *         description: Bad Request - Group name is required.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       409:
 *         description: Conflict - A group with this name may already exist.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups for the current user
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's groups.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/groups/{groupId}:
 *   get:
 *     summary: Get a specific group by ID
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the group to retrieve.
 *     responses:
 *       200:
 *         description: The requested group object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - You do not have permission to view this group.
 *       404:
 *         description: Group not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/groups/{groupId}:
 *   patch:
 *     summary: Update a group's name
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the group to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name for the group.
 *     responses:
 *       200:
 *         description: Group updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       400:
 *         description: Bad Request - Group name is required.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - You do not have permission to edit this group.
 *       404:
 *         description: Group not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/groups/{groupId}:
 *   delete:
 *     summary: Delete a group by ID
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the group to delete.
 *     responses:
 *       204:
 *         description: No Content - Group deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - You do not have permission to delete this group.
 *       404:
 *         description: Group not found.
 *       500:
 *         description: Internal Server Error.
 */