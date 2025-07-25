/* eslint-disable no-console */

import server from "./app";
import { appConfig } from "./app/config";
import { pool } from "./app/db/db";

import { seedAdmin } from "./app/db/seedAdmin";
import { startJobConsumer } from "./app/rabbitMq/jobs/consumer";

import logger from "./app/utils/logger";

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled promise rejection:", err);

  process.exit(1);
});

const main = async () => {
  try {
    await pool.query("SELECT 1");
    logger.info("✅ Database connection successful");
  } catch (err) {
    logger.error("❌ Failed to connect to database:", err);
    process.exit(1);
  }

  await seedAdmin();
  await startJobConsumer();
  server.listen(
    Number(appConfig.server.port),
    appConfig.server.ip as string,
    () => {
      logger.info(
        `Example app listening on port ${appConfig.server.port} & ip:${
          appConfig.server.ip as string
        }`
      );
    }
  );
};
main().catch((err) => logger.error("Error connecting to Postgres:", err));
