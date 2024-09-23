import express from "express";
import { userRegisterHandler } from "./user.controllers";

// Router for user routes
const userRouter = express.Router();

userRouter.post("/auth/register", userRegisterHandler);

export default userRouter;