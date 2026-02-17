"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQueue = exports.ORDER_JOB_PROCESS_ORDER = exports.ORDER_QUEUE_NAME = void 0;
// src/queues/orderQueue.ts
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.ORDER_QUEUE_NAME = "order-processing";
exports.ORDER_JOB_PROCESS_ORDER = "process-order";
exports.orderQueue = new bullmq_1.Queue(exports.ORDER_QUEUE_NAME, {
    connection: redis_1.redisConnection,
});
//# sourceMappingURL=orderQueue.js.map