import { Request, Response, NextFunction } from "express";
import { NewCommunityFormType } from "@/api/community/community.types";
import { UserCookieType } from "../user/user.types";

import { pool } from "@/utils/db";

export async function createCommunityHandler(req: Request, res: Response, next: NextFunction) {

  // Get request body and data from cookie
  const body: NewCommunityFormType = req.body;
  const userInfo: UserCookieType = res.locals.userInfo;

  // Make sure no empty fields
  if (!body.name || !body.description) {
    return res.status(200).json({
      success: false,
      message: "Required fields not filled"
    });
  }

  // Get a db connection from pool
  const client = await pool.connect();

  try {

    // Begin transaction
    await client.query("BEGIN");

    // Create a new community
    const communityData = await client.query(`
      INSERT INTO communities (ownerId, name, description, paid, price)
      VALUES ($1::uuid, $2, $3, $4, $5) RETURNING "id";
    `, [userInfo.id, body.name, body.description, body?.paid ? body.paid : "no", body.price ? Number(body.price) : 0]
    );

    // Add entry to community_user_map table
    await client.query(`
      INSERT INTO communities_user_map (userId, communityId)
      VALUES ($1::uuid, $2::uuid);
      `, [userInfo.id, communityData.rows[0]?.id]
    );

    // Commit
    await client.query("COMMIT");

    // Return
    return res.status(200).json({
      success: true,
      message: `Successfully created community ${body.name}`
    });
  }
  catch (err) {

    // If error, rollback changes
    client.query("ROLLBACK");
    next(err);
  }
  finally {

    // Finally, release connection
    client.release();
  }
}