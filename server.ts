/*
  A SEPERATE FILE FOR STARTING SERVER.
  FOR TESTS.
*/

import { PORT, KEY_FILE, CERT_FILE } from "@/utils/config";
import https from "https";
import fs from "fs";
import path from "path";
import app from "@/index";

import { pool } from "@/utils/db";

import Logger from "@/utils/logger";

// Read SSL certificate and key files
const options = {
  key: fs.readFileSync(path.join(__dirname, KEY_FILE)),
  cert: fs.readFileSync(path.join(__dirname, CERT_FILE)),
};

// Start a new https server
const server = https.createServer(options, app);
server.listen(PORT, () => {
  Logger.debug(`App listening on https://localhost:${PORT}`);
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