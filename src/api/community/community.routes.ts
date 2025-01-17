import express from "express";
import {
  createCommunityHandler,
  deleteCommunityHandler,
  joinCommunityHandler,
  leaveCommunityHandler,
  returnAllCommunityHandler,
  returnCommunityHandler,
  userPartOfCommunityHandler
} from "@/api/community/community.controllers";
import authCheck from "@/middleware/authCheck";

export const communityRouter = express.Router();

communityRouter.post("/", authCheck, createCommunityHandler);
communityRouter.get("/", returnAllCommunityHandler);
communityRouter.post("/part", authCheck, userPartOfCommunityHandler);
communityRouter.post("/join", authCheck, joinCommunityHandler);
communityRouter.post("/leave", authCheck, leaveCommunityHandler);
communityRouter.post("/delete", authCheck, deleteCommunityHandler);
communityRouter.get("/:id", returnCommunityHandler);