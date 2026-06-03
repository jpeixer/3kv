import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HipotStore = {
  commOk: boolean;
  ipAddress: string;
  rs485Port: string;
  useIp: boolean;
  useRs485: boolean;

  setCommOk: (ok: boolean) => void;
  setIpAddress: (ip: string) => void;
  setRs485Port: (port: string) => void;
  setUseIp: (use: boolean) => void;
  setUseRs485: (use: boolean) => void;
};

export const useHipotStore = create<HipotStore>()(
  persist(
    (set) => ({
      commOk: true,
      ipAddress: '192.168.1.100',
      rs485Port: 'COM3',
      useIp: true,
      useRs485: false,

      setCommOk: (ok) => set({ commOk: ok }),
      setIpAddress: (ip) => set({ ipAddress: ip }),
      setRs485Port: (port) => set({ rs485Port: port }),
      setUseIp: (use) => set({ useIp: use }),
      setUseRs485: (use) => set({ useRs485: use }),
    }),
    { name: 'hipot-comm-config' },
  ),
);
