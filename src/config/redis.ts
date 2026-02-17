// src/config/redis.ts
export const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
};
