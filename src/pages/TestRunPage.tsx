import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnalogGauge } from '../components/AnalogGauge';
import { BatchPhotoCapture } from '../components/BatchPhotoCapture';
import { HighVoltageWarningOverlay } from '../components/HighVoltageWarningOverlay';
import {
  CURRENT_GAUGE_MAX_MA,
  TEST_VOLTAGE_KV,
  VOLTAGE_GAUGE_MAX_KV,
} from '../constants/hipot';
import {
  formatCurrentMa,
  formatVoltageKv,
  getCurrentMa,
  getRampDurationMs,
  getVoltageKvAtPlateau,
  getVoltageKvDuringRamp,
} from '../services/hipotReadings.mock';
import { runMockTestBatch } from '../services/testRunner.mock';
import { useTestStore } from '../store/useTestStore';
import type { TestRunnerEvent } from '../types/test';
import './TestRunPage.css';

type LocationState = {
  itemIds?: string[];
};

type TestPhase = 'idle' | 'ramping' | 'holding';

export function TestRunPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};
  const serialItems = useTestStore((s) => s.serialItems);
  const durationPerWindingSec = useTestStore((s) => s.durationPerWindingSec);
  const resetStatusesToPending = useTestStore((s) => s.resetStatusesToPending);
  const markSelectedDone = useTestStore((s) => s.markSelectedDone);
  const setCompletedSerialNumbers = useTestStore((s) => s.setCompletedSerialNumbers);
  const currentBatchNumber = useTestStore((s) => s.currentBatchNumber);
  const resetBatch = useTestStore((s) => s.resetBatch);

  const itemIds = state.itemIds ?? [];
  const itemIdsKey = itemIds.join(',');
  const items = useMemo(
    () => serialItems.filter((i) => itemIds.includes(i.id)),
    [serialItems, itemIdsKey, itemIds],
  );
  const runnerRef = useRef<ReturnType<typeof runMockTestBatch> | null>(null);
  const rampStartedAtRef = useRef<number | null>(null);

  const allSerialNumbers = useMemo(() => items.map((i) => i.serialNumber), [items]);
  const rampDurationMs = getRampDurationMs(durationPerWindingSec);

  const [phase, setPhase] = useState<TestPhase>('idle');
  const [activeSerials, setActiveSerials] = useState<string[]>([]);
  const [idleSerials, setIdleSerials] = useState<string[]>([]);
  const [windingIndex, setWindingIndex] = useState(0);
  const [windingTotal, setWindingTotal] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(durationPerWindingSec);
  const [progress, setProgress] = useState(0);
  const [voltageKv, setVoltageKv] = useState(0);
  const [currentMa, setCurrentMa] = useState(0);

  const activeSerialCount = activeSerials.length;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/', { replace: true });
      return;
    }

    const handleEvent = (event: TestRunnerEvent) => {
      switch (event.type) {
        case 'windingStarted': {
          const active = event.serialNumbers;
          setActiveSerials(active);
          setIdleSerials(allSerialNumbers.filter((sn) => !active.includes(sn)));
          setWindingIndex(event.windingIndex);
          setWindingTotal(event.windingTotal);
          setProgress(((event.windingIndex - 1) / event.windingTotal) * 100);
          if (event.skipRamp) {
            rampStartedAtRef.current = null;
            setPhase('idle');
          } else {
            setPhase('ramping');
            rampStartedAtRef.current = Date.now();
            setVoltageKv(0);
            setCurrentMa(0);
          }
          break;
        }
        case 'holdStarted':
          setPhase('holding');
          rampStartedAtRef.current = null;
          setSecondsRemaining(event.secondsRemaining);
          break;
        case 'tick':
          setSecondsRemaining(event.secondsRemaining);
          break;
        case 'windingPassed':
          setPhase('idle');
          rampStartedAtRef.current = null;
          setVoltageKv(0);
          setCurrentMa(0);
          setProgress((event.windingIndex / event.windingTotal) * 100);
          break;
        case 'batchComplete':
          markSelectedDone(itemIds);
          setCompletedSerialNumbers(event.serialNumbers);
          navigate('/approved', { replace: true });
          break;
      }
    };

    runnerRef.current = runMockTestBatch({
      items,
      durationPerWindingSec,
      onEvent: handleEvent,
    });

    return () => {
      runnerRef.current?.abort();
    };
  }, [
    items,
    itemIds,
    allSerialNumbers,
    durationPerWindingSec,
    navigate,
    markSelectedDone,
    setCompletedSerialNumbers,
  ]);

  useEffect(() => {
    if (phase === 'idle') {
      setVoltageKv(0);
      setCurrentMa(0);
      return;
    }

    let frameId = 0;

    const updateReadings = () => {
      const now = Date.now();

      if (phase === 'ramping' && rampStartedAtRef.current !== null) {
        const elapsed = now - rampStartedAtRef.current;
        const kv = getVoltageKvDuringRamp(elapsed, rampDurationMs);
        setVoltageKv(kv);
        const targetMa = getCurrentMa(activeSerialCount, now);
        setCurrentMa(activeSerialCount > 0 ? targetMa * (kv / TEST_VOLTAGE_KV) : 0);
      } else if (phase === 'holding') {
        setVoltageKv(getVoltageKvAtPlateau(now));
        setCurrentMa(getCurrentMa(activeSerialCount, now));
      }

      frameId = requestAnimationFrame(updateReadings);
    };

    frameId = requestAnimationFrame(updateReadings);
    return () => cancelAnimationFrame(frameId);
  }, [phase, rampDurationMs, activeSerialCount]);

  const handleAbort = () => {
    runnerRef.current?.abort();
    resetStatusesToPending(itemIds);
    resetBatch();
    navigate('/');
  };

  if (items.length === 0) {
    return null;
  }

  const countdownLabel =
    phase === 'ramping'
      ? 'Ramping to 3 kV — test timer starts at plateau'
      : phase === 'holding'
        ? 'seconds remaining at 3 kV'
        : windingIndex > 1
          ? 'Applying 3 kV…'
          : 'Preparing…';

  const countdownDisplay =
    phase === 'holding' ? (
      <div className="test-countdown" aria-live="polite">
        {secondsRemaining}
      </div>
    ) : phase === 'ramping' ? (
      <div className="test-countdown test-countdown-ramp" aria-live="polite">
        Ramping
      </div>
    ) : (
      <div className="test-countdown test-countdown-ramp" aria-live="polite">
        —
      </div>
    );

  return (
    <div className="test-run-page">
      <HighVoltageWarningOverlay />
      <div className="test-run-content">
        <p className="test-run-label">Batch testing</p>
        {currentBatchNumber && (
          <p className="test-run-batch-number">
            Batch no. <strong>{currentBatchNumber}</strong>
          </p>
        )}
        <p className="test-run-winding">
          {windingTotal > 0
            ? `Winding ${windingIndex} of ${windingTotal}`
            : 'Preparing…'}
        </p>

        <div className="test-run-gauges">
          <AnalogGauge
            label="Voltage"
            value={voltageKv}
            min={0}
            max={VOLTAGE_GAUGE_MAX_KV}
            unit=" kV"
            formatDisplay={formatVoltageKv}
            markerValue={TEST_VOLTAGE_KV}
            markerLabel="3 kV test"
          />
          <AnalogGauge
            label="Current"
            value={currentMa}
            min={0}
            max={CURRENT_GAUGE_MAX_MA}
            unit=" mA"
            formatDisplay={formatCurrentMa}
          />
        </div>

        <p className="test-run-batch-size">
          {activeSerials.length > 0
            ? `${activeSerials.length} serial number${activeSerials.length === 1 ? '' : 's'} energized · ${(activeSerialCount * 20).toFixed(0)} mA nominal`
            : 'Preparing batch…'}
        </p>
        <ul className="test-run-serials test-run-serials-active">
          {activeSerials.map((sn) => (
            <li key={sn}>{sn}</li>
          ))}
        </ul>
        {idleSerials.length > 0 && (
          <div className="test-run-idle">
            <p className="test-run-idle-label">Not energized this step</p>
            <ul className="test-run-serials test-run-serials-idle">
              {idleSerials.map((sn) => (
                <li key={sn}>{sn}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="test-progress-bar">
          <div className="test-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        {countdownDisplay}
        <p className="test-countdown-label">{countdownLabel}</p>
        <BatchPhotoCapture windingIndex={windingIndex} activeSerials={activeSerials} />
        <button type="button" className="btn btn-danger" onClick={handleAbort}>
          Abort test
        </button>
      </div>
    </div>
  );
}
