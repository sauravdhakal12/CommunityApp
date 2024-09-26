import { Request, Response, NextFunction } from "express";
import { NewCommunityFormType } from "@/api/community/community.types";
import db from "@/utils/db";

export function createCommunityHandler(req: Request, res: Response, next: NextFunction) {
  const body: NewCommunityFormType = req.body;

  if (!body.name || !body.description) {
    return res.status(200).json({
      success: false,
      message: "Required fields not filled"
    });
  }

  return res.status(200).json({
    success: true,
  });
}