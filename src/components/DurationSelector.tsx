import { useTestStore } from '../store/useTestStore';

export const DURATION_PRESETS = [2, 5, 60] as const;

export function DurationSelector() {
  const duration = useTestStore((s) => s.durationPerWindingSec);
  const setDuration = useTestStore((s) => s.setDuration);

  return (
    <div className="card duration-selector">
      <span className="duration-label">Test duration (per winding)</span>
      <div className="duration-presets">
        {DURATION_PRESETS.map((sec) => (
          <button
            key={sec}
            type="button"
            className={`btn btn-secondary duration-preset${duration === sec ? ' active' : ''}`}
            onClick={() => setDuration(sec)}
          >
            {sec}s
          </button>
        ))}
      </div>
    </div>
  );
}
