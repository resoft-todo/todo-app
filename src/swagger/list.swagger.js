/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: API to manage user's lists. Requires authentication.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     List:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the list.
 *         name:
 *           type: string
 *           description: The name of the list.
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The id of the user who owns the list.
 *         groupId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: The id of the group this list belongs to (optional).
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the list was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the list was last updated.
 *       example:
 *         id: "d9a8a7a6-b5c4-4d3e-8f2a-1b9c8d7e6f5a"
 *         name: "Groceries"
 *         userId: "c8b7a6b5-a4d3-3c2b-2a1b-9c8d7e6f5a4d"
 *         groupId: null
 *         createdAt: "2023-10-27T10:00:00.000Z"
 *         updatedAt: "2023-10-27T10:00:00.000Z"
 */

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a new list
 *     tags: [Lists]
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
 *                 description: The name for the new list.
 *               groupId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional ID of the group to associate the list with.
 *     responses:
 *       201:
 *         description: List created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       400:
 *         description: Bad Request - List name is required.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       409:
 *         description: Conflict - A list with this name already exists for the user.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Get all lists for the current user
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's lists.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/List'
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/lists/{listId}:
 *   get:
 *     summary: Get a specific list by ID
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the list to retrieve.
 *     responses:
 *       200:
 *         description: The requested list object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: List not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/lists/{listId}:
 *   patch:
 *     summary: Update a list's name
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the list to update.
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
 *                 description: The new name for the list.
 *     responses:
 *       200:
 *         description: List updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       400:
 *         description: Bad Request - List name is required.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: List not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/lists/{listId}/group:
 *   patch:
 *     summary: Add a list to a group
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the list to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupId
 *             properties:
 *               groupId:
 *                 type: string
 *                 description: The ID of the group to add the list to.
 *     responses:
 *       200:
 *         description: List updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       400:
 *         description: Bad Request - Group ID is required.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: List not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/lists/{listId}:
 *   delete:
 *     summary: Delete a list by ID
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the list to delete.
 *     responses:
 *       204:
 *         description: No Content - List deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: List not found.
 *       500:
 *         description: Internal Server Error.
 */