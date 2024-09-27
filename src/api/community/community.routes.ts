import express from "express";
import {
  createCommunityHandler,
  joinCommunityHandler,
  leaveCommunityHandler,
  returnCommunityHandler
} from "@/api/community/community.controllers";
import authCheck from "@/middleware/authCheck";

export const communityRouter = express.Router();

communityRouter.post("/", authCheck, createCommunityHandler);
communityRouter.get("/:id", returnCommunityHandler);
communityRouter.post("/join", authCheck, joinCommunityHandler);
communityRouter.post("/leave", authCheck, leaveCommunityHandler);
