import express from "express";
import { userLoginHandler, userRegisterHandler } from "./user.controllers";

// Router for user routes
const userRouter = express.Router();

userRouter.post("/auth/register", userRegisterHandler);
userRouter.post("/auth/login", userLoginHandler);

export default userRouter;