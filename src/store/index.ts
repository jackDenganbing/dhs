import { create } from 'zustand';

// 用户状态接口
interface UserState {
  user: {
    id: number;
    phone: string;
    name: string;
  } | null;
  token: string | null;
  setUser: (user: { id: number; phone: string; name: string }, token: string) => void;
  clearUser: () => void;
}

// 水厂状态接口
interface FactoryState {
  factory: {
    id: number;
    name: string;
    description: string;
    history: string;
    honors: string[];
  } | null;
  setFactory: (factory: any) => void;
}

// 产品状态接口
interface ProductState {
  products: any[];
  selectedProduct: any | null;
  setProducts: (products: any[]) => void;
  setSelectedProduct: (product: any) => void;
}

// 提醒状态接口
interface ReminderState {
  reminders: any[];
  setReminders: (reminders: any[]) => void;
  addReminder: (reminder: any) => void;
  updateReminder: (id: number, reminder: any) => void;
  deleteReminder: (id: number) => void;
}

// 查询历史状态接口
interface QueryHistoryState {
  history: any[];
  setHistory: (history: any[]) => void;
  addHistory: (item: any) => void;
}

// 创建用户store
export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
}));

// 创建水厂store
export const useFactoryStore = create<FactoryState>((set) => ({
  factory: null,
  setFactory: (factory) => set({ factory }),
}));

// 创建产品store
export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedProduct: null,
  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));

// 创建提醒store
export const useReminderStore = create<ReminderState>((set) => ({
  reminders: [],
  setReminders: (reminders) => set({ reminders }),
  addReminder: (reminder) => set((state) => ({
    reminders: [...state.reminders, reminder],
  })),
  updateReminder: (id, updatedReminder) => set((state) => ({
    reminders: state.reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, ...updatedReminder } : reminder
    ),
  })),
  deleteReminder: (id) => set((state) => ({
    reminders: state.reminders.filter((reminder) => reminder.id !== id),
  })),
}));

// 创建查询历史store
export const useQueryHistoryStore = create<QueryHistoryState>((set) => ({
  history: [],
  setHistory: (history) => set({ history }),
  addHistory: (item) => set((state) => ({
    history: [item, ...state.history],
  })),
}));