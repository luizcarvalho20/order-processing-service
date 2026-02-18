import request from "supertest";
import { app } from "../src/app";

describe("POST /orders", () => {
  it("deve criar um pedido válido e retornar 201", async () => {
    const payload = {
      items: [
        { product: "Produto A", quantity: 2, price: 10.5 },
        { product: "Produto B", quantity: 1, price: 5.0 },
      ],
    };

    const res = await request(app).post("/orders").send(payload);

    expect(res.status).toBe(201);

    // Esperado: id e status inicial
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("status");

    // Normalmente começa PENDING antes do worker concluir
    expect(res.body.status).toBe("PENDING");

    // total esperado: 2*10.5 + 1*5 = 26
   expect(Number(res.body.total)).toBe(26);

    // itens
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(2);
  });

  it("deve retornar 400 quando payload é inválido", async () => {
    const res = await request(app).post("/orders").send({ items: [] });

    expect(res.status).toBe(400);
  });
});
