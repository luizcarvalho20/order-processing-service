const { Qq} = require("bullmq");
const { redisConnection } = require("../config/redis");

const ORDER_QUEUE_NAME = "order-processing";
const ORDER_JOB_PROCESS_ORDER = "process-order";

let _orderQueue: Queue | null = null;

function getOrderQueue() {
  if (!_orderQueue) {
    _orderQueue = new Queue(ORDER_QUEUE_NAME, {
      connection: redisConnection,
    });
  }
  
  return _orderQueue;
}

async function closeOrderQueue() {
  if (_orderQueue) {
    await _orderQueue.close();
    _orderQueue = null;
  }
}

module.exports = {
  ORDER_QUEUE_NAME,
  ORDER_JOB_PROCESS_ORDER,
  getOrderQueue,
  closeOrderQueue,
};
