import express from "express";
import {
  createCommunityHandler,
  deleteCommunityHandler,
  joinCommunityHandler,
  leaveCommunityHandler,
  returnAllCommunityHandler,
  returnCommunityHandler
} from "@/api/community/community.controllers";
import authCheck from "@/middleware/authCheck";

export const communityRouter = express.Router();

communityRouter.post("/", authCheck, createCommunityHandler);
communityRouter.get("/", returnAllCommunityHandler);
communityRouter.get("/:id", returnCommunityHandler);
communityRouter.post("/join", authCheck, joinCommunityHandler);
communityRouter.post("/leave", authCheck, leaveCommunityHandler);
communityRouter.post("/delete", authCheck, deleteCommunityHandler);
