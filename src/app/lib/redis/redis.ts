import Redis from "ioredis";

import { appConfig } from "../../config";
import logger from "../../utils/serverTools/logger";

const redis = new Redis({
  host: appConfig.redis.host,
  port: Number(appConfig.redis.port),
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay; // reconnect delay in ms
  },
});

redis.on("connect", () => logger.info("✅ Redis connected"));
redis.on("ready", () => logger.info("✅ Redis ready"));
redis.on("error", (err) => logger.error("❌ Redis error:", err));
redis.on("close", () => logger.warn("Redis connection closed"));
redis.on("reconnecting", () => logger.warn("Redis reconnecting..."));

export default redis;
