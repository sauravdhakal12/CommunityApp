import express, { Application } from "express";

// Import Routes
import userRouter from "@/api/user/user.routes";
import { communityRouter } from "@/api/community/community.routes";

import morganMiddleware from "@/utils/morgan";
import { errorHandler, unknownEndPoint } from "@/middleware/errorHandler";

import cors from "cors";

// Create Application
const app: Application = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400,
  methods: ["GET, POST, PUT, DELETE"]
}));

app.use(express.json());

// Http log using Morgan
app.use(morganMiddleware);

// Register Routes
app.use("/user", userRouter);
app.use("/community", communityRouter);
app.use(unknownEndPoint);

// Error handling middleware
app.use(errorHandler);

export default app;
