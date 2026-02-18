import request from "supertest";
import { app } from "../src/app";

describe("GET /orders/:id", () => {
  it("deve buscar um pedido existente e retornar 200", async () => {
    // 1) cria pedido
    const createRes = await request(app).post("/orders").send({
      items: [{ product: "Produto A", quantity: 2, price: 10.5 }],
    });

    expect(createRes.status).toBe(201);
    const orderId = createRes.body.id;

    // 2) busca pedido
    const getRes = await request(app).get(`/orders/${orderId}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(orderId);
    expect(getRes.body).toHaveProperty("items");
    expect(Number(getRes.body.total)).toBe(21);  // 2*10.5
  });

  it("deve retornar 404 para id inexistente", async () => {
    const res = await request(app).get(
      "/orders/00000000-0000-0000-0000-000000000000"
    );

    expect(res.status).toBe(404);
  });
});
