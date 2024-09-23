/*
  A SEPERATE FILE FOR STARTING SERVER.
  FOR TESTS.
*/

import { PORT } from "@/utils/config";
import app from "@/index";

import Logger from "@/utils/logger";

// Start server
app.listen(PORT, () => {
  Logger.debug(`Listening on port ${PORT}`);
});