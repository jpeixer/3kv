import { getRampDurationMs } from './hipotReadings.mock';
import type { SerialItem, TestRunnerEvent, TestRunnerHandle } from '../types/test';

type RunOptions = {
  items: SerialItem[];
  durationPerWindingSec: number;
  onEvent: (event: TestRunnerEvent) => void;
};

function getActiveSerialsForWinding(items: SerialItem[], windingIndex: number): string[] {
  return items
    .filter((item) => item.windingCount >= windingIndex)
    .map((item) => item.serialNumber);
}

export function getMaxWindingCount(items: SerialItem[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map((item) => item.windingCount));
}

export function runMockTestBatch(options: RunOptions): TestRunnerHandle {
  const { items, durationPerWindingSec, onEvent } = options;
  const allSerialNumbers = items.map((i) => i.serialNumber);
  const maxWinding = getMaxWindingCount(items);

  let aborted = false;
  let tickTimer: ReturnType<typeof setInterval> | null = null;
  let rampTimer: ReturnType<typeof setTimeout> | null = null;
  let holdTimer: ReturnType<typeof setTimeout> | null = null;

  const clearTimers = () => {
    if (tickTimer) clearInterval(tickTimer);
    if (rampTimer) clearTimeout(rampTimer);
    if (holdTimer) clearTimeout(holdTimer);
    tickTimer = null;
    rampTimer = null;
    holdTimer = null;
  };

  const abort = () => {
    aborted = true;
    clearTimers();
  };

  const runWinding = (
    windingIndex: number,
    activeSerialNumbers: string[],
    onWindingDone: () => void,
  ) => {
    if (aborted) return;

    const skipRamp = windingIndex > 1;
    const rampMs = skipRamp ? 0 : getRampDurationMs(durationPerWindingSec);
    let secondsRemaining = durationPerWindingSec;

    const startHold = () => {
      if (aborted) return;

      onEvent({ type: 'holdStarted', secondsRemaining: durationPerWindingSec });
      onEvent({ type: 'tick', secondsRemaining });

      tickTimer = setInterval(() => {
        if (aborted) return;
        secondsRemaining -= 1;
        if (secondsRemaining > 0) {
          onEvent({ type: 'tick', secondsRemaining });
        }
      }, 1000);

      holdTimer = setTimeout(() => {
        clearTimers();
        if (aborted) return;
        onEvent({
          type: 'windingPassed',
          serialNumbers: activeSerialNumbers,
          windingIndex,
          windingTotal: maxWinding,
        });
        onWindingDone();
      }, durationPerWindingSec * 1000);
    };

    onEvent({
      type: 'windingStarted',
      serialNumbers: activeSerialNumbers,
      windingIndex,
      windingTotal: maxWinding,
      skipRamp,
    });

    if (skipRamp) {
      startHold();
    } else {
      rampTimer = setTimeout(() => {
        if (aborted) return;
        rampTimer = null;
        startHold();
      }, rampMs);
    }
  };

  let windingIndex = 1;

  const nextWinding = () => {
    if (aborted) return;
    if (windingIndex > maxWinding) {
      onEvent({ type: 'batchComplete', serialNumbers: allSerialNumbers });
      return;
    }

    const activeSerialNumbers = getActiveSerialsForWinding(items, windingIndex);
    const current = windingIndex;

    runWinding(current, activeSerialNumbers, () => {
      windingIndex += 1;
      nextWinding();
    });
  };

  nextWinding();

  return { abort };
}

export function formatSelectionWindingHint(items: SerialItem[]): string {
  if (items.length === 0) {
    return 'Select one or more pending serial numbers to run a batch test.';
  }
  const counts = items.map((i) => i.windingCount);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  if (min === max) {
    return `${items.length} selected · ${min} windings each`;
  }
  return `${items.length} selected · windings ${min}–${max} (mixed batch)`;
}
