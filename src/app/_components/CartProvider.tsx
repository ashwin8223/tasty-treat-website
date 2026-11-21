"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import type { MenuItem } from "../_lib/data-service";

// 01. TYPES

type CartLine = { item: MenuItem; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isHydrated: boolean;
  addItem: (item: MenuItem) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

// 02. CONSTANTS

const CART_STORAGE_KEY = "tasty-treat-cart";

const MAX_ITEM_QUANTITY = 10;
const MAX_DISTINCT_ITEMS = 10;

// 03. CONTEXT

const CartContext = createContext<CartContextValue | null>(null);

// 04. CART PROVIDER

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // 05. RESTORE CART FROM LOCAL STORAGE

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
              Number.isInteger(line.quantity) &&
              line.quantity > 0 &&
              line.quantity <= MAX_ITEM_QUANTITY,
          );

          // Intentional state update: restore cart from browser storage.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLines(validLines.slice(0, MAX_DISTINCT_ITEMS));
        }
      }
    } catch (error) {
      console.error("Failed to restore cart:", error);
    } finally {
      // Intentional state update: mark cart restoration as complete.
      setIsHydrated(true);
    }
  }, []);

  // 06. SAVE CART TO LOCAL STORAGE

  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [lines, isHydrated]);

  // 07. ADD ITEM TO CART

  const addItem = useCallback(
    (item: MenuItem) => {
      const existingLine = lines.find((line) => line.item.id === item.id);

      if (existingLine && existingLine.quantity >= MAX_ITEM_QUANTITY) {
        toast("You can add up to 10 of this item per order.", {
          icon: "⚠️",
        });
        return;
      }

      if (!existingLine && lines.length >= MAX_DISTINCT_ITEMS) {
        toast("Your cart can contain up to 10 different items.", {
          icon: "⚠️",
        });
        return;
      }

      setLines((current) => {
        const found = current.find((line) => line.item.id === item.id);

        if (found) {
          if (found.quantity >= MAX_ITEM_QUANTITY) return current;

          return current.map((line) =>
            line.item.id === item.id
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          );
        }

        if (current.length >= MAX_DISTINCT_ITEMS) return current;

        return [...current, { item, quantity: 1 }];
      });
    },
    [lines],
  );

  // 08. UPDATE ITEM QUANTITY

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity > MAX_ITEM_QUANTITY) {
      toast("You can add up to 10 of this item per order.", {
        icon: "⚠️",
      });
      return;
    }

    if (!Number.isInteger(quantity)) return;

    setLines((current) => {
      if (quantity <= 0) {
        return current.filter((line) => line.item.id !== id);
      }

      return current.map((line) =>
        line.item.id === id ? { ...line, quantity } : line,
      );
    });
  }, []);

  // 09. REMOVE ITEM FROM CART

  const removeItem = useCallback(
    (id: number) =>
      setLines((current) => current.filter((line) => line.item.id !== id)),
    [],
  );

  // 10. CLEAR CART

  const clearCart = useCallback(() => setLines([]), []);

  // 11. CART CONTEXT VALUE

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce(
        (sum, line) => sum + line.item.price * line.quantity,
        0,
      ),
      isHydrated,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [lines, isHydrated, addItem, updateQuantity, removeItem, clearCart],
  );

  // 12. RENDER PROVIDER

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 13. CART HOOK

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
