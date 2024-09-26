import { Request, Response, NextFunction } from "express";
import { NewCommunityFormType } from "@/api/community/community.types";
import { UserCookieType } from "../user/user.types";

import db, { pool } from "@/utils/db";

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

export async function returnCommunityHandler(req: Request, res: Response, next: NextFunction) {

  // Get request body and data from cookie
  const communityId: string = req.params.id;

  if (!communityId) {
    return res.status(200).send({
      success: false,
      message: "CommunityId not present",
    });
  }

  try {

    // Fetch info about community, join owners info
    const resCommuntiy = await db(`
      SELECT communities.*, users.email, users.name as username FROM communities 
      RIGHT JOIN users ON communities.ownerid = users.id 
      WHERE communities.id = $1;
    `, [communityId]
    );

    // If not found, return so
    if (resCommuntiy.rowCount === 0) {
      return res.status(200).json({
        success: false,
        message: "Community dosen't exist",
      });
    }

    // If found, return community info
    return res.status(200).json({
      success: true,
      data: resCommuntiy.rows[0],
    });

  }
  catch (err) {
    next(err);
  }
};

export async function joinCommunityHandler(req: Request, res: Response, next: NextFunction) {

  // Get request body and data from cookie
  const body: { communityId: string } = req.body;
  const userInfo: UserCookieType = res.locals.userInfo;

  if (!body.communityId) {
    return res.status(200).send({
      success: false,
      message: "CommunityId not present",
    });
  }

  const client = await pool.connect();

  try {
    const alreadyJoined = await client.query(`
      SELECT * FROM communities_user_map WHERE
      userId = $1 and communityId = $2; 
      `, [userInfo.id, body.communityId]
    );

    if (alreadyJoined.rowCount !== 0) {
      return res.status(200).json({
        success: false,
        message: "Already joined the community",
      });
    }

    await client.query("BEGIN");

    // TODO: Check community dosen't exist (Error)
    await client.query(`
      INSERT INTO communities_user_map (userId, communityId)
      VALUES ($1::uuid, $2::uuid);
      `, [userInfo.id, body.communityId]
    );
    await client.query(`
      UPDATE communities SET membercount = membercount + 1 
      WHERE id = $1; 
      `, [body.communityId]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Successfully joined the commmunity",
    });
  }
  catch (err) {
    await client.query("ROLLBACK");
    next(err);
  }
  finally {
    client.release();
  }
}