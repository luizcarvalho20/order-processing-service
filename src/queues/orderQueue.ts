// src/queues/orderQueue.ts
const { Queue } = require("bullmq");
const { redisConnection } = require("../config/redis");

const ORDER_QUEUE_NAME = "order-processing";
const ORDER_JOB_PROCESS_ORDER = "process-order";

let _orderQueue = null;

function getOrderQueue() {
  if (!_orderQueue) {
    _orderQueue = new Queue(ORDER_QUEUE_NAME, {
      connection: redisConnection,
    });
  }
  return _orderQueue;
}

async function closeOrderQueue() {
  if (!_orderQueue) return;

  const q = _orderQueue;
  _orderQueue = null;

  try {
    await q.close();
  } catch {}

  // Extra seguro: encerra conexões internas do BullMQ (ioredis)
  try {
    const client = await q.client;
    await client.quit();
  } catch {}
  try {
    const eclient = await q.eventsClient;
    await eclient.quit();
  } catch {}
}

module.exports = {
  ORDER_QUEUE_NAME,
  ORDER_JOB_PROCESS_ORDER,
  getOrderQueue,
  closeOrderQueue,
};
