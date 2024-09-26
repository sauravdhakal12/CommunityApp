import express from "express";
import { createCommunityHandler } from "@/api/community/community.controllers";

export const communityRouter = express.Router();

communityRouter.post("/", createCommunityHandler);