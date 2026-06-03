import { create } from 'zustand';
import type { SerialItem, SerialStatus } from '../types/test';

const DEMO_ITEMS: SerialItem[] = [
  { id: 'demo-1', serialNumber: 'TR-2024-00142', windingCount: 3, status: 'pending' },
  { id: 'demo-2', serialNumber: 'TR-2024-00189', windingCount: 5, status: 'pending' },
  { id: 'demo-3', serialNumber: 'TR-2024-00201', windingCount: 2, status: 'pending' },
];

type TestStore = {
  serialItems: SerialItem[];
  selectedIds: Set<string>;
  durationPerWindingSec: number;
  completedSerialNumbers: string[];

  setDuration: (seconds: number) => void;
  toggleSelected: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  addSerial: (serialNumber: string, windingCount: number) => string | null;
  removeSerial: (id: string) => void;
  setItemStatus: (id: string, status: SerialStatus) => void;
  resetStatusesToPending: (ids: string[]) => void;
  markSelectedDone: (ids: string[]) => void;
  setCompletedSerialNumbers: (serials: string[]) => void;
  clearCompleted: () => void;
  getSelectedItems: () => SerialItem[];
};

function generateId(): string {
  return `serial-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useTestStore = create<TestStore>((set, get) => ({
  serialItems: [...DEMO_ITEMS],
  selectedIds: new Set<string>(),
  durationPerWindingSec: 5,
  completedSerialNumbers: [],

  setDuration: (seconds) => {
    const allowed = [2, 5, 60];
    const rounded = Math.round(seconds);
    const value = allowed.includes(rounded) ? rounded : 5;
    set({ durationPerWindingSec: value });
  },

  toggleSelected: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),

  selectAll: () =>
    set((state) => ({
      selectedIds: new Set(
        state.serialItems.filter((i) => i.status === 'pending').map((i) => i.id),
      ),
    })),

  clearSelection: () => set({ selectedIds: new Set() }),

  addSerial: (serialNumber, windingCount) => {
    const trimmed = serialNumber.trim();
    if (!trimmed || windingCount < 1) return 'Invalid input.';
    const exists = get().serialItems.some(
      (i) => i.serialNumber.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) return 'This serial number is already in the queue.';
    const item: SerialItem = {
      id: generateId(),
      serialNumber: trimmed,
      windingCount: Math.floor(windingCount),
      status: 'pending',
    };
    set((state) => ({ serialItems: [...state.serialItems, item] }));
    return null;
  },

  removeSerial: (id) =>
    set((state) => {
      const nextSelected = new Set(state.selectedIds);
      nextSelected.delete(id);
      return {
        serialItems: state.serialItems.filter((i) => i.id !== id),
        selectedIds: nextSelected,
      };
    }),

  setItemStatus: (id, status) =>
    set((state) => ({
      serialItems: state.serialItems.map((i) => (i.id === id ? { ...i, status } : i)),
    })),

  resetStatusesToPending: (ids) =>
    set((state) => ({
      serialItems: state.serialItems.map((i) =>
        ids.includes(i.id) ? { ...i, status: 'pending' as const } : i,
      ),
    })),

  markSelectedDone: (ids) =>
    set((state) => ({
      serialItems: state.serialItems.map((i) =>
        ids.includes(i.id) ? { ...i, status: 'done' as const } : i,
      ),
      selectedIds: new Set(),
    })),

  setCompletedSerialNumbers: (serials) => set({ completedSerialNumbers: serials }),

  clearCompleted: () => set({ completedSerialNumbers: [] }),

  getSelectedItems: () => {
    const { serialItems, selectedIds } = get();
    return serialItems.filter((i) => selectedIds.has(i.id));
  },
}));
