import express from "express";
import { createCommunityHandler } from "@/api/community/community.controllers";
import authCheck from "@/middleware/authCheck";

export const communityRouter = express.Router();

communityRouter.post("/", authCheck, createCommunityHandler);