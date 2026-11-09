"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuItem } from "@/data/menu";

type CartLine = { item: MenuItem; quantity: number };
type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addItem: (item: MenuItem) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const addItem = (item: MenuItem) =>
    setLines((current) => {
      const found = current.find((line) => line.item.id === item.id);
      return found
        ? current.map((line) =>
            line.item.id === item.id
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [...current, { item, quantity: 1 }];
    });
  const updateQuantity = (id: number, quantity: number) =>
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.item.id !== id)
        : current.map((line) =>
            line.item.id === id ? { ...line, quantity } : line,
          ),
    );
  const removeItem = (id: number) =>
    setLines((current) => current.filter((line) => line.item.id !== id));
  const clearCart = () => setLines([]);
  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce(
        (sum, line) => sum + line.item.price * line.quantity,
        0,
      ),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [lines],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
