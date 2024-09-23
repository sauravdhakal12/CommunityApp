import { Request, Response } from "express";

export const demoRoute = async (req: Request, res: Response) => {
  return res.json({ "hello": "world" });
};