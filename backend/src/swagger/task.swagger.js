/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API to manage tasks within lists. Requires authentication.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - listId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [not_started, completed]
 *           default: not_started
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         list:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 * 
 *     TaskInput:
 *       type: object
 *       required:
 *         - title
 *         - listId
 *       properties:
 *         title:
 *           type: string
 *         listId:
 *           type: string
 *           format: uuid
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [not_started, completed]
 *           default: not_started
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Optional due date for the task in YYYY-MM-DD format
 *           example: 2023-12-31
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad Request - listId and title are required.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - User does not own the list.
 */


/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all of the authenticated user's tasks, by status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         description: find or filter tasks by one or more statuses
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [not_started, completed]
 *         style: form
 *         explode: true
 *         example: /api/tasks?status=not_started&status=in_progress
 *     responses:
 *       200:
 *         description: A list of the user's tasks matching the filter
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */


/**
 * @swagger
 * /api/tasks/today:
 *   get:
 *     summary: Get all of the authenticated user's tasks for today
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's tasks for today
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - User does not have permission to view these tasks.
 *       500:
 *         description: Internal Server Error.
 */


/**
 * @swagger
 *         name: status
 *         description: find or filter tasks by one or more statuses
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [not_started, completed]
 *         style: form
 *         explode: true
 *         example: /api/tasks?status=not_started&status=in_progress
 *     responses:
 *       200:
 *         description: A list of the user's tasks matching the filter
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/lists/{listId}/tasks:
 *   get:
 *     summary: Get all tasks for a specific list
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the list to get tasks from.
 *     responses:
 *       200:
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - User does not own the list.
 */

/**
 * @swagger
 * /api/lists/{listId}/tasks:
 *   get:
 *     summary: Get tasks for a specific list, filtered by status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the list to get tasks from.
 *       - in: query
 *         name: status
 *         description: Optional. Filter tasks by one or more statuses
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [not_started, completed]
 *         style: form
 *         explode: true
 *     responses:
 *       200:
 *         description: A list of tasks for the specified list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - User does not have access to this list.
 *       404:
 *         description: List not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the task to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [not_started, completed]
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Optional due date for the task in YYYY-MM-DD format
 *                 example: 2023-12-31
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Task not found or user lacks permission.
 */

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the task to delete.
 *     responses:
 *       204:
 *         description: No Content - Task deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Task not found or user lacks permission.
 */