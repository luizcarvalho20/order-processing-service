const { Router } = require("express");
const { prisma } = require("../lib/prisma");

const router = Router();

router.post("/", async (req: any, res: any) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Pedido precisa ter itens." });
  }

  for (const item of items) {
    if (!item.product || !item.quantity || !item.price) {
      return res.status(400).json({ error: "Itens inválidos." });
    }
  }

  const totalNumber = items.reduce(
    (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  // Como no Prisma schema você está usando Decimal, é mais seguro passar string "150.00"
  const total = totalNumber.toFixed(2);

  const order = await prisma.order.create({
    data: {
      total, // string
      items: {
        create: items.map((i: any) => ({
          product: String(i.product),
          quantity: Number(i.quantity),
          price: Number(i.price).toFixed(2), // string
        })),
      },
    },
    include: { items: true },
  });

  return res.status(201).json(order);
});

router.get("/", async (_req: any, res: any) => {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return res.json(orders);
});

router.get("/:id", async (req: any, res: any) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) return res.status(404).json({ error: "Pedido não encontrado." });

  return res.json(order);
});

module.exports = router;
