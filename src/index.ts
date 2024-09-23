import express, { Application } from "express";

// Import Routes
import userRouter from "@/api/user/user.routes";

import morganMiddleware from "@/utils/morgan";
import { errorHandler, unknownEndPoint } from "@/middleware/errorHandler";

// Create Application
const app: Application = express();


app.use(express.json());

// Http log using Morgan
app.use(morganMiddleware);

// Register Routes
app.use("/user", userRouter);
app.use(unknownEndPoint);

// Error handling middleware
app.use(errorHandler);

export default app;