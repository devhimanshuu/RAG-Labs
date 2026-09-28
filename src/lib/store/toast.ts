"use client";

import { create } from "zustand";

import type { ToastRecord, ToastTone } from "@/types";

interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss. 0 keeps the toast until dismissed. */
  duration?: number;
}

interface ToastState {
  toasts: ToastRecord[];
  push: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const DEFAULT_DURATION = 5000;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  push: ({ title, description, tone = "info", duration = DEFAULT_DURATION }) => {
    const id = `toast_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e4)}`;
    set({ toasts: [...get().toasts, { id, title, description, tone, duration }] });
    return id;
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((toast) => toast.id !== id) }),
  clear: () => set({ toasts: [] }),
}));

/**
 * Imperative toast helper. Usable from anywhere, including event handlers in
 * components that do not need to subscribe to the store.
 */
export const toast = {
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, tone: "info" }),
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, tone: "success" }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, tone: "warning" }),
  danger: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, tone: "danger" }),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
};
