"use client";

import { useSyncExternalStore } from "react";

/**
 * Preview basket, kept in this browser only (localStorage).
 * Nothing is sent to a server. Every read and write is guarded: storage can be
 * blocked or empty (private windows, previews), and the shop must still render.
 */

export type Line = { id: string; qty: number };
export type OrderMethod = "eft" | "collect" | "card-demo";
export type Order = {
  id: string;
  createdAt: string;
  lines: { id: string; title: string; priceNad: number; qty: number }[];
  totalNad: number;
  method: OrderMethod;
  /** First name and town only. Email and phone are never stored. */
  name: string;
  town: string;
};

const CART_KEY = "shookuku.cart.v1";
const ORDERS_KEY = "shookuku.orders.v1";
const EMPTY: Line[] = [];
const MAX_QTY = 20;

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedLines: Line[] = EMPTY;
let memoryOnly = false;

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // storage unavailable: keep state in memory for this page view
  }
}

function parseLines(raw: string | null): Line[] {
  if (!raw) return EMPTY;
  try {
    const v = JSON.parse(raw);
    if (!Array.isArray(v)) return EMPTY;
    return v
      .filter((l) => l && typeof l.id === "string" && Number.isInteger(l.qty) && l.qty > 0)
      .map((l) => ({ id: l.id, qty: Math.min(l.qty, MAX_QTY) }));
  } catch {
    return EMPTY;
  }
}

function snapshot(): Line[] {
  if (memoryOnly) return cachedLines;
  const raw = readRaw(CART_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parseLines(raw);
  }
  return cachedLines;
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const noop = () => () => {};
/** False during server render and hydration, true after. Avoids flashing an empty basket. */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function useCart(): Line[] {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

function save(lines: Line[]) {
  if (write(CART_KEY, lines)) {
    cachedRaw = null; // next snapshot re-reads storage
  } else {
    memoryOnly = true;
    cachedLines = lines;
  }
  emit();
}

export function addToCart(id: string, qty = 1) {
  const lines = [...snapshot()];
  const i = lines.findIndex((l) => l.id === id);
  if (i >= 0) lines[i] = { id, qty: Math.min(lines[i].qty + qty, MAX_QTY) };
  else lines.push({ id, qty: Math.min(qty, MAX_QTY) });
  save(lines);
}

export function setQty(id: string, qty: number) {
  const lines = snapshot()
    .map((l) => (l.id === id ? { id, qty: Math.max(0, Math.min(qty, MAX_QTY)) } : l))
    .filter((l) => l.qty > 0);
  save(lines);
}

export function clearCart() {
  save([]);
}

export function saveOrder(order: Order) {
  const list = loadOrders().filter((o) => o.id !== order.id);
  list.unshift(order);
  write(ORDERS_KEY, list.slice(0, 20));
}

export function loadOrders(): Order[] {
  try {
    const v = JSON.parse(readRaw(ORDERS_KEY) ?? "[]");
    return Array.isArray(v) ? (v as Order[]) : [];
  } catch {
    return [];
  }
}

export function newOrderId() {
  const rand = Math.floor(Math.random() * 36 ** 3).toString(36).padStart(3, "0");
  return `OS-${Date.now().toString(36)}-${rand}`.toUpperCase();
}

export const METHOD_LABEL: Record<OrderMethod, string> = {
  eft: "EFT (bank transfer)",
  collect: "Collect in Windhoek",
  "card-demo": "Card (demonstration)",
};
