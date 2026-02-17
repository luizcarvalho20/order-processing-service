// src/queues/orderQueue.ts
import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const ORDER_QUEUE_NAME = "order-processing";
export const ORDER_JOB_PROCESS_ORDER = "process-order";

export const orderQueue = new Queue(ORDER_QUEUE_NAME, {
  connection: redisConnection,
});
