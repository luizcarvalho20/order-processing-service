export type OrderItemInput = {
  product: string;
  quantity: number;
  price: number;
};

export function calculateOrderTotal(items: OrderItemInput[]) {
  return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
}
