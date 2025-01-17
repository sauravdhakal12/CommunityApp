import { Request, Response, NextFunction } from "express";
import { NewCommunityFormType } from "@/api/community/community.types";
import { UserCookieType } from "../user/user.types";

import db, { pool } from "@/utils/db";

/*
##############################
##  RETURN ALL COMMUNITIES  ##
##############################
*/
export async function returnAllCommunityHandler(req: Request, res: Response, next: NextFunction) {
  // TODO: Return a fixed amount, recommeded
  try {

    // Fetch all communities
    const allCommunities = await db("SELECT * FROM communities");

    // Return all communities
    return res.status(200).json({
      success: true,
      data: allCommunities.rows
    });
  }
  catch (err) {
    next(err);
  }
}


/*
#############################################
##  CHECK IF A USER IS PART OF A COMMUNITY ##
#############################################
*/
export async function userPartOfCommunityHandler(req: Request, res: Response, next: NextFunction) {

  // Fetch body and userinfo from cookie
  const body: { communityId: string } = req.body;
  const userInfo: UserCookieType = res.locals.userInfo;

  if (!body.communityId || !userInfo.id) {
    return res.status(200).json({
      success: false,
      message: "Required fields not filled"
    });
  }

  try {

    // Check if user is part of a community
    const joined = await db(`
      SELECT * FROM communities_user_map
      WHERE userid = $1::uuid AND communityid = $2::uuid;
      `, [userInfo.id, body.communityId]
    );

    // If data fetched, return true else false
    return res.status(200).json({
      success: joined.rowCount === 1
    });

  }
  catch (err) {
    next(err);
  }
}


/*
#############################
##  CREATE A NEW COMMUNITY ##
#############################
*/
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


/*
###############################
##   GET INFO ON A COMMUNITY ##
###############################
*/
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



/*
########################
##   JOIN A COMMUNITY ##
########################
*/
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

    // Check to see if user already joined
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
    // Update communities_user_map table
    await client.query(`
      INSERT INTO communities_user_map (userId, communityId)
      VALUES ($1::uuid, $2::uuid);
      `, [userInfo.id, body.communityId]
    );

    // Increase membercount
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


/*
########################
##  LEAVE A COMMUNITY ##
########################
*/
export async function leaveCommunityHandler(req: Request, res: Response, next: NextFunction) {

  // Get request body and data from cookie
  const body: { communityId: string } = req.body;
  const userInfo: UserCookieType = res.locals.userInfo;

  // Make sure communityId is provided
  if (!body.communityId) {
    return res.status(200).send({
      success: false,
      message: "CommunityId not present",
    });
  }

  // Secure a connection
  const client = await pool.connect();

  try {

    const community = await client.query(`
      SELECT ownerid FROM communities WHERE
      id = $1;
    `, [body.communityId]);

    // Make sure user has joined the community
    const joined = await client.query(`
      SELECT * FROM communities_user_map WHERE
      userId = $1 and communityId = $2;
      `, [userInfo.id, body.communityId]
    );

    if (community.rowCount === 0) {
      return res.status(200).json({
        success: false,
        message: "No community found",
      });
    }
    else if (joined.rowCount !== 1) {
      return res.status(200).json({
        success: false,
        message: "Not joined the community",
      });
    }

    // User cannot leave their own community
    // TODO: Maybe they can?
    else if (joined.rows[0].userid === community.rows[0].ownerid) {
      return res.status(200).json({
        success: false,
        message: "Cannot leave your own community",
      });
    }

    // BEGIN Transaction
    await client.query("BEGIN");

    // TODO: Check community dosen't exist (Error)
    // DELETE from communities_user_map
    await client.query(`
      DELETE FROM communities_user_map
      WHERE userId = $1::uuid AND communityId = $2::uuid;
      `, [userInfo.id, body.communityId]
    );

    // Decrease memeberCount from community
    await client.query(`
      UPDATE communities SET membercount = membercount - 1
      WHERE id = $1;
      `, [body.communityId]
    );

    // Commmit
    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Successfully left the commmunity",
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


/*
#########################
##  DELETE A COMMUNITY ##
#########################
*/
export async function deleteCommunityHandler(req: Request, res: Response, next: NextFunction) {

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

    // Check for community
    const joined = await client.query(`
      SELECT * FROM communities WHERE
      id = $1;
      `, [body.communityId]
    );

    if (joined.rowCount !== 1) {
      return res.status(200).json({
        success: false,
        message: "No community found",
      });
    }

    // Check to verify for owner
    else if (joined.rows[0].ownerid !== userInfo.id) {
      return res.status(200).json({
        success: false,
        message: "Only owners can delete a community",
      });
    }

    await client.query("BEGIN");

    // TODO: Check community dosen't exist (Error)
    // Delete mapping(Delete all users from community)
    await client.query(`
      DELETE FROM communities_user_map
      WHERE communityid = $1;
      `, [body.communityId]
    );

    // Delete the community
    await client.query(`
      DELETE FROM communities
      WHERE id = $1::uuid;
      `, [body.communityId]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Successfully deleted the commmunity",
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
