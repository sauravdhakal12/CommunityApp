/*
  A SEPERATE FILE FOR STARTING SERVER.
  FOR TESTS.
*/

import { PORT } from "@/utils/config";
import app from "@/index";

import { pool } from "@/utils/db";

import Logger from "@/utils/logger";

// Start server
const server = app.listen(PORT, () => {
  Logger.debug(`Listening on port ${PORT}`);
});

// Shutdown Script (To close all db connection)
const shutdown = async () => {
  Logger.info("Loggin down gracefully");

  await pool.end(); // Close the PostgreSQL pool

  server.close(() => {
    Logger.info("Closed all connections");
    process.exit(0);
  });
};

// Run shutdown function on:
process.on("SIGINT", shutdown); // Handle Ctrl+C
process.on("SIGTERM", shutdown); // Handle termination signal