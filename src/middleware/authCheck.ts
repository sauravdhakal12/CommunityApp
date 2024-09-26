import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authCheck(req: Request, res: Response, next: NextFunction) {
  const cookieInfo = req.headers["cookie"]?.split("=");
  if (!cookieInfo || cookieInfo.length !== 2) {
    return res.status(200).json({
      success: false,
      message: "User not logged in",
    });
  }
  try {
    const userInfo = jwt.decode(cookieInfo[1]);
    res.locals.userInfo = userInfo;
  }
  catch (err) {
    next(err);
  }

  next();
}