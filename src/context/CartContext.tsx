import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { trackAddToCart, trackCheckoutStarted } from '@/lib/analytics';
import { fmt } from '@/lib/format';
import type { CartLine } from '@/lib/types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Linking } from 'react-native';

type CartState = {
  cart: CartLine[];
  count: number;
  total: number;
  addItem: (name: string, price: number, img: string) => void;
  removeItem: (name: string) => void;
  checkout: () => void;
};

const Ctx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const { homepage } = useData();
  const toast = useToast();

  const addItem = useCallback(
    (name: string, price: number, img: string) => {
      setCart((c) => {
        const ex = c.find((i) => i.name === name);
        return ex
          ? c.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i))
          : [...c, { name, price, img, qty: 1 }];
      });
      toast(`${name} added`);
      trackAddToCart(name);
    },
    [toast],
  );

  const removeItem = useCallback((name: string) => {
    setCart((c) =>
      c.flatMap((i) => (i.name !== name ? [i] : i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : [])),
    );
  }, []);

  const count = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  const checkout = useCallback(() => {
    const lines = cart.map((i) => `• ${i.name} ×${i.qty} — ${fmt(i.price * i.qty)}`).join('\n');
    const msg = encodeURIComponent(
      `🍛 *New Isebe Order*\n\n${lines}\n\n*Total: ${fmt(total)}*\n\nPlease confirm. Thank you!`,
    );
    Linking.openURL(`https://wa.me/${homepage.whatsapp_num}?text=${msg}`).catch(() =>
      toast('Could not open WhatsApp', 'error'),
    );
    trackCheckoutStarted();
  }, [cart, total, homepage.whatsapp_num, toast]);

  const value = useMemo(
    () => ({ cart, count, total, addItem, removeItem, checkout }),
    [cart, count, total, addItem, removeItem, checkout],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCart must be used inside CartProvider');
  return v;
}
