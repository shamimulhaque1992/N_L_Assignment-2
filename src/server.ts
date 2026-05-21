import config from "./config";
import { initDB } from "./db";
import app from "./app";

const main = () => {
  // Initiate database
  initDB();
  app.listen(config.port, () => {
    console.log(`Server running at port ${config.port}`);
  });
};

main();
