import express, { Application } from "express";

// Import Routes
import userRouter from "./api/user/user.routes";

import morganMiddleware from "@/utils/morgan";

// Create Application
const app: Application = express();

// Http log using Morgan
app.use(morganMiddleware);

//TODO: Strict Restful

// Register Routes
app.use("/demo", userRouter);

export default app;