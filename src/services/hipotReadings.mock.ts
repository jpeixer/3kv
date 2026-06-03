import {
  CURRENT_PER_SERIAL_MA,
  TEST_VOLTAGE_KV,
  VOLTAGE_PLATEAU_MAX_KV,
  VOLTAGE_PLATEAU_MIN_KV,
} from '../constants/hipot';

export function getRampDurationMs(testDurationSec: number): number {
  return (testDurationSec / 6) * 1000;
}

/** Linear ramp 0 → test voltage during ramp phase. */
export function getVoltageKvDuringRamp(elapsedMs: number, rampDurationMs: number): number {
  if (rampDurationMs <= 0) return TEST_VOLTAGE_KV;
  const t = Math.min(1, elapsedMs / rampDurationMs);
  return TEST_VOLTAGE_KV * t;
}

/** Oscillate between 3.0 and 3.1 kV at plateau. */
export function getVoltageKvAtPlateau(timeMs: number): number {
  const mid = (VOLTAGE_PLATEAU_MIN_KV + VOLTAGE_PLATEAU_MAX_KV) / 2;
  const amp = (VOLTAGE_PLATEAU_MAX_KV - VOLTAGE_PLATEAU_MIN_KV) / 2;
  return mid + amp * Math.sin(timeMs / 400);
}

export function getCurrentMa(activeSerialCount: number, timeMs: number): number {
  const base = activeSerialCount * CURRENT_PER_SERIAL_MA;
  if (base <= 0) return 0;
  const ripple = Math.sin(timeMs / 350) * Math.min(2, base * 0.05);
  return Math.max(0, base + ripple);
}

export function formatVoltageKv(kv: number): string {
  if (kv >= 1) return `${kv.toFixed(2)} kV`;
  return `${(kv * 1000).toFixed(0)} V`;
}

export function formatCurrentMa(ma: number): string {
  return `${ma.toFixed(1)} mA`;
}
