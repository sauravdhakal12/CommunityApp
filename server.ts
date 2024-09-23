/*
  A SEPERATE FILE FOR STARTING SERVER.
  FOR TESTS.
*/

import { PORT } from "@/utils/config";
import app from "@/index";

// Start server
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});