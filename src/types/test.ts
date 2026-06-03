export type SerialStatus = 'pending' | 'in_progress' | 'done';

export type SerialItem = {
  id: string;
  serialNumber: string;
  windingCount: number;
  status: SerialStatus;
};

export type BatchPhoto = {
  id: string;
  batchNumber: string;
  dataUrl: string;
  capturedAt: string;
  windingIndex?: number;
  serialNumbers?: string[];
};

export type TestRunnerEvent =
  | {
      type: 'windingStarted';
      serialNumbers: string[];
      windingIndex: number;
      windingTotal: number;
      skipRamp: boolean;
    }
  | { type: 'holdStarted'; secondsRemaining: number }
  | { type: 'tick'; secondsRemaining: number }
  | {
      type: 'windingPassed';
      serialNumbers: string[];
      windingIndex: number;
      windingTotal: number;
    }
  | { type: 'batchComplete'; serialNumbers: string[] };

export type TestRunnerHandle = {
  abort: () => void;
};
