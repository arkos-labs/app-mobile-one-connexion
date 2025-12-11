import { create } from 'zustand';
import type { Order, DailyStats } from '@/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  incomingOrder: Order | null;
  dailyStats: DailyStats;
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  setIncomingOrder: (order: Order | null) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addOrder: (order: Order) => void;
  setDailyStats: (stats: DailyStats) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  incomingOrder: null,
  dailyStats: {
    completedOrders: 0,
    totalEarnings: 0,
    totalDistance: 0,
  },
  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (currentOrder) => set({ currentOrder }),
  setIncomingOrder: (incomingOrder) => set({ incomingOrder }),
  updateOrder: (orderId, updates) => set((state) => ({
    orders: state.orders.map((order) =>
      order.id === orderId ? { ...order, ...updates } : order
    ),
    currentOrder: state.currentOrder?.id === orderId
      ? { ...state.currentOrder, ...updates }
      : state.currentOrder,
  })),
  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders],
  })),
  setDailyStats: (dailyStats) => set({ dailyStats }),
}));
