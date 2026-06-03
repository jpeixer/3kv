/** Target withstand test voltage (kV). */
export const TEST_VOLTAGE_KV = 3;

/** Gauge full-scale voltage (kV). */
export const VOLTAGE_GAUGE_MAX_KV = 5;

/** Simulated regulation band at plateau (kV). */
export const VOLTAGE_PLATEAU_MIN_KV = 3;
export const VOLTAGE_PLATEAU_MAX_KV = 3.1;

/** Gauge full-scale current (mA). */
export const CURRENT_GAUGE_MAX_MA = 100;

/** Mock current per energized serial in batch (mA). */
export const CURRENT_PER_SERIAL_MA = 20;

/** Ramp duration as fraction of selected test duration. */
export const VOLTAGE_RAMP_FRACTION = 1 / 6;
