import { NextFunction, Request, Response } from "express";
import db from "@/utils/db";
import { RegisterFormUserType, LoginFormUserType, DbUserType } from "@/api/user/user.types";

/*
#######################
##  REGISTER HANDLER ##
#######################
*/
export const userRegisterHandler = async (req: Request, res: Response, next: NextFunction) => {

  // Get register data
  const body: RegisterFormUserType = req.body;

  // No empty fields
  if (!body.email || !body.name || !body.password) {
    return res.status(200).json({
      success: false,
      message: "All fields are required",
    });
  }
  // Password length validation
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
    next(err);
  };
};


/*
####################
##  LOGIN HANDLER ##
####################
*/
export const userLoginHandler = async (req: Request, res: Response, next: NextFunction) => {

  // Data from login form
  const body: LoginFormUserType = req.body;

  // No empty fields
  if (!body.email || !body.password) {
    return res.status(200).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Get user data using email
    const userDataDb = await db("SELECT * FROM users WHERE email=$1", [body.email]);

    // User dosen't exist
    if (userDataDb.rowCount === 0) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    // Get a row
    const userData: DbUserType = userDataDb.rows[0];

    // Match password
    if (userData.password !== body.password) {
      return res.status(200).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: "User found",
    });
  }
  catch (err) {
    next(err);
  };
};