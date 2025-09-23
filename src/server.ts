/* eslint-disable no-console */

import server from "./app";
import { app_config } from "./app/config";
import { pool } from "./app/db";
import { seedAdmin } from "./app/db/seedAdmin";

import { startConsumers } from "./app/lib/rabbitMq/worker";
import redis from "./app/lib/redis/redis";

import logger from "./app/utils/serverTools/logger";

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
  startConsumers();
  redis.ping().then(() => console.log("Redis ping OK"));
  server.listen(
    Number(app_config.server.port),
    app_config.server.ip as string,
    () => {
      logger.info(
        `Example app listening on port ${app_config.server.port} & ip:${
          app_config.server.ip as string
        }`
      );
    }
  );
};
main().catch((err) => logger.error("Error connecting to Postgres:", err));
