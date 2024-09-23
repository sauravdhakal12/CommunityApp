import { NextFunction, Request, Response } from "express";
import db from "@/utils/db";
import { FormUserType } from "@/api/user/user.types";

export const userRegisterHandler = async (req: Request, res: Response, next: NextFunction) => {

  // Get register data
  const body: FormUserType = req.body;

  // Validate email, name and password
  if (!body.email || !body.name || !body.password) {
    return res.status(200).json({
      success: false,
      message: "All fields are required",
    });
  }
  else if (body.password.length < 6) {
    return res.status(200).json({
      success: false,
      message: "Password must be atleast 6 characters"
    });
  }

  // Insert data into DB
  try {
    await db(`
      INSERT INTO users (name, email, password) 
      VALUES ($1, $2, $3);
    `, [body.name, body.email, body.password]);

    return res.status(200).json({
      success: true,
      message: `Successfully registered user ${body.name}`,
    });
  }
  catch (err) {
    // TODO: next
    next(err);
  };
};