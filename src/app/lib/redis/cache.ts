/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import logger from "../../utils/serverTools/logger";
import redis from "./redis";

const DEFAULT_TTL = 60; // 1 min

export const set_cache = async (
  key: string,
  value: unknown,
  ttl: number = DEFAULT_TTL
) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
    logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
  } catch (err) {
    logger.error(`Failed to set cache for key: ${key}`, err);
  }
};

/**
 * Get value from Redis cache
 */
export const get_cache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    if (!data) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }
    logger.debug(`Cache hit: ${key}`);
    return JSON.parse(data) as T;
  } catch (err) {
    logger.error(`Failed to get cache for key: ${key}`, err);
    return null;
  }
};

export const delete_cache = async (key: string) => {
  try {
    await redis.del(key);
    logger.debug(`Cache deleted: ${key}`);
  } catch (err) {
    logger.error(`Failed to delete cache for key: ${key}`, err);
  }
};

/**
 * ❌ Delete multiple cache keys
 */
export const delete_caches = async (keys: string[]) => {
  try {
    if (keys.length === 0) return;
    await redis.del(keys);
    logger.debug(`Caches deleted: ${keys.join(", ")}`);
  } catch (err) {
    logger.error(`Failed to delete caches: ${keys.join(", ")}`, err);
  }
};
