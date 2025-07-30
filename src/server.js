import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import listRoutes from './routes/list.routes.js';
import taskRoutes from './routes/task.routes.js';
import groupRoutes from './routes/group.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {credentials: true, origin: process.env.FRONTEND_URL || '*'};


// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo List API',
            version: '1.0.0',
        },
        
        servers: [{ url: 'http://localhost:8000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    
    
    apis: ['./src/routes/*.js', './src/swagger/*.js'],
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/groups', groupRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;