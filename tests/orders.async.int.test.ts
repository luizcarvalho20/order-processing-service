// tests/orders.async.int.test.ts
import request from "supertest";
import { app } from "../src/app";

const workerMod = require("../src/workers/orderWorker") as {
  createOrderWorker: () => any;
  closeOrderWorker: (w: any) => Promise<void>;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForCompleted(orderId: string, timeoutMs = 12000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const res = await request(app).get(`/orders/${orderId}`);
    if (res.status === 200 && res.body?.status === "COMPLETED") {
      return res.body;
    }
    await sleep(300);
  }

  throw new Error(`Pedido ${orderId} não ficou COMPLETED em ${timeoutMs}ms`);
}

describe("Fluxo assíncrono completo (fila + worker)", () => {
  let worker: any;

  beforeAll(async () => {
    jest.setTimeout(20000);
    worker = workerMod.createOrderWorker();
    await sleep(200);
  });

  afterAll(async () => {
    await workerMod.closeOrderWorker(worker);
  });

  it("deve criar pedido e finalizar como COMPLETED via worker", async () => {
    const createRes = await request(app)
      .post("/orders")
      .send({
        items: [
          { product: "Produto A", quantity: 1, price: 10 },
          { product: "Produto B", quantity: 1, price: 10 },
        ],
      });

    expect(createRes.status).toBe(201);
    const orderId = createRes.body.id;

    const finalOrder = await waitForCompleted(orderId, 15000);

    expect(finalOrder.status).toBe("COMPLETED");
    expect(Number(finalOrder.total)).toBe(20);
  });
});
