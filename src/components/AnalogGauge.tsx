import './AnalogGauge.css';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  formatDisplay: (value: number) => string;
  markerValue?: number;
  markerLabel?: string;
};

const ARC_START = 135;
const ARC_SWEEP = 270;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function AnalogGauge({
  label,
  value,
  min,
  max,
  unit,
  formatDisplay,
  markerValue,
  markerLabel,
}: Props) {
  const clamped = Math.max(min, Math.min(max, value));
  const ratio = max > min ? (clamped - min) / (max - min) : 0;
  const needleAngle = ARC_START + ratio * ARC_SWEEP;
  const trackEnd = ARC_START + ARC_SWEEP;
  const valueEnd = ARC_START + ratio * ARC_SWEEP;

  const markerAngle =
    markerValue !== undefined && max > min
      ? ARC_START + ((Math.max(min, Math.min(max, markerValue)) - min) / (max - min)) * ARC_SWEEP
      : null;

  const cx = 100;
  const cy = 100;
  const r = 72;

  return (
    <div className="analog-gauge">
      <span className="analog-gauge-label">{label}</span>
      <svg viewBox="0 0 200 130" className="analog-gauge-svg" aria-hidden>
        <path
          d={describeArc(cx, cy, r, ARC_START, trackEnd)}
          className="analog-gauge-track"
          fill="none"
        />
        {ratio > 0.001 && (
          <path
            d={describeArc(cx, cy, r, ARC_START, valueEnd)}
            className="analog-gauge-fill"
            fill="none"
          />
        )}
        {markerAngle !== null && (
          <line
            x1={cx}
            y1={cy}
            x2={polarToCartesian(cx, cy, r + 4, markerAngle).x}
            y2={polarToCartesian(cx, cy, r + 4, markerAngle).y}
            className="analog-gauge-marker"
          />
        )}
        <line
          x1={cx}
          y1={cy}
          x2={polarToCartesian(cx, cy, r - 8, needleAngle).x}
          y2={polarToCartesian(cx, cy, r - 8, needleAngle).y}
          className="analog-gauge-needle"
        />
        <circle cx={cx} cy={cy} r={6} className="analog-gauge-hub" />
        <text x={16} y={118} className="analog-gauge-scale">
          {min}
          {unit}
        </text>
        <text x={158} y={118} className="analog-gauge-scale">
          {max}
          {unit}
        </text>
        {markerLabel && markerAngle !== null && (
          <text x={cx} y={24} className="analog-gauge-marker-label">
            {markerLabel}
          </text>
        )}
      </svg>
      <p className="analog-gauge-reading">{formatDisplay(clamped)}</p>
    </div>
  );
}
