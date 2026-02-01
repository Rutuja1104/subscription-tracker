import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import SubscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', SubscriptionRouter);

app.use(express.json());// Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies (we send response in html forms using urlencoded format)
app.use(cookieParser());// Middleware to parse cookies from incoming requests

app.use(errorMiddleware);// Error handling middleware should be the last middleware

app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker App!');
});

app.listen(PORT, async () => {
    console.log(`Subscription Tracker App is running on http://localhost:${PORT}`);
    await connectToDatabase();
    
});

export default app;


// https://www.turboconsolelog.io/documentation/features/insert-log-message?event=extensionInactiveManualLog&variant=A&utm_source=extension&utm_medium=notification&utm_campaign=extension-inactive-manual-log&utm_content=variant-a