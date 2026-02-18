import { calculateOrderTotal } from "../src/domain/order";

describe("calculateOrderTotal (unit)", () => {
  it("deve calcular total corretamente", () => {
    const total = calculateOrderTotal([
      { product: "A", quantity: 2, price: 10.5 },
      { product: "B", quantity: 1, price: 5.0 },
    ]);

    expect(total).toBe(26);
  });

  it("deve retornar 0 quando lista vazia", () => {
    expect(calculateOrderTotal([])).toBe(0);
  });
});
