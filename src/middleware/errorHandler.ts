import { NextFunction, Request, Response } from "express";
import { DatabaseError } from "pg";
import Logger from "../utils/logger";

export const unknownEndPoint = (_: Request, res: Response) => {
  res.status(404).end();
};

export const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof DatabaseError)
    return res.status(200).json({
      success: false,
      message: dbErrorHandler(err)
    });

  else
    return res.status(200).json({
      success: false,
      message: "Something went wrong"
    });
};

const dbErrorHandler = (err: DatabaseError) => {
  const code = err.code;

  Logger.error(`${err.code} :: ${err.name}  ==>  ${err.message}`);

  if (code === "23505") {
    return ("User with this email already exists");
  }
  else {
    return ("Something went wrong");
  }
};