import express, { Application } from "express";

// Import Routes
import userRouter from "./api/user/user.routes";

// Create Application
const app: Application = express();


//TODO: Strict Restful

// Register Routes
app.use("/demo", userRouter);

export default app;