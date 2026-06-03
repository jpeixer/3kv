import './HighVoltageWarningOverlay.css';

export function HighVoltageWarningOverlay() {
  return (
    <div className="hv-overlay" aria-live="assertive">
      <div className="hv-border hv-border-yellow" />
      <div className="hv-border hv-border-red" />
      <div className="hv-banner hv-banner-yellow">ATTENTION — HIGH VOLTAGE</div>
      <div className="hv-banner hv-banner-red">ATTENTION — HIGH VOLTAGE</div>
    </div>
  );
}
