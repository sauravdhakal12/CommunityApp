import { Pool } from "pg";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./config";

// Credentials for db
export const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  password: DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

/*
  A function to run DB queries
*/
export default async function db(queryText: string, values?: Array<string | number>) {

  // Acquire connection from pool
  const client = await pool.connect();

  // Run query
  try {
    const res = await client.query(queryText, values);

    return res;
  }
  catch (err) {
    throw err;
  }
  finally {
    // Release connection
    client.release();
  }
}
/*
  Connection Pooling: The pool manages multiple connections. Acquire a connection when needed.
  Release the Client: Release the client after use to avoid exhausting the pool
*/