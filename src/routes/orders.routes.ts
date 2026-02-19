// src/routes/orders.routes.ts
import { Router, type Request, type Response } from "express";
import { z } from "zod";

// CommonJS-safe (seu prisma é module.exports = { prisma })
const { prisma } = require("../lib/prisma") as { prisma: any };

// Queue CommonJS (getOrderQueue/export consts)
const {
  getOrderQueue,
  ORDER_JOB_PROCESS_ORDER,
} = require("../queues/orderQueue") as {
  getOrderQueue: () => any;
  ORDER_JOB_PROCESS_ORDER: string;
};

const router = Router();

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1),
});

// POST /orders
router.post("/", async (req: Request, res: Response) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Payload inválido",
      issues: parsed.error.issues,
    });
  }

  const { items } = parsed.data;

  const total = items.reduce((acc, it) => acc + it.quantity * it.price, 0);

  const order = await prisma.order.create({
    data: {
      status: "PENDING",
      total, // pode virar string se for Decimal no Prisma, ok
      items: {
        create: items.map((it: any) => ({
          product: it.product,
          quantity: it.quantity,
          price: it.price,
        })),
      },
    },
    include: { items: true },
  });

  // Enfileira para o worker processar
  const queue = getOrderQueue();
  await queue.add(
    ORDER_JOB_PROCESS_ORDER,
    { orderId: order.id },
    {
      removeOnComplete: true,
      removeOnFail: true,
    }
  );

  return res.status(201).json(order);
});

// GET /orders/:id
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return res.status(404).json({ message: "Pedido não encontrado" });
  }

  return res.status(200).json(order);
});

export default router;
