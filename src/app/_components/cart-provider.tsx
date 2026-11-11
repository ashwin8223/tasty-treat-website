"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuItem } from "../_lib/data-service";

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

const CART_STORAGE_KEY = "tasty-treat-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore cart from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        const parsedCart: unknown = JSON.parse(storedCart);

        if (Array.isArray(parsedCart)) {
          const validLines = parsedCart.filter(
            (line): line is CartLine =>
              line !== null &&
              typeof line === "object" &&
              "item" in line &&
              "quantity" in line &&
              line.item !== null &&
              typeof line.item === "object" &&
              typeof line.item.id === "number" &&
              typeof line.quantity === "number" &&
              Number.isInteger(line.quantity) &&
              line.quantity > 0,
          );

          // Intentional state update: restore cart from browser storage.
          setLines(validLines);
        }
      }
    } catch (error) {
      console.error("Failed to restore cart:", error);
    } finally {
      // Intentional state update: mark cart restoration as complete.
      setIsHydrated(true);
    }
  }, []);
  // Save cart whenever its contents change
  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [lines, isHydrated]);

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

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
