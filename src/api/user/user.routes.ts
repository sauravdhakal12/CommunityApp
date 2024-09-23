import express from "express";
import { demoRoute } from "./user.controllers";

// Router for user routes
const userRouter = express.Router();

userRouter.get("/", demoRoute);

export default userRouter;