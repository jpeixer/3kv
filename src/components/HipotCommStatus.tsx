import { useState } from 'react';
import { useHipotStore } from '../store/useHipotStore';
import { HipotCommModal } from './HipotCommModal';
import './HipotCommStatus.css';

export function HipotCommStatus() {
  const [open, setOpen] = useState(false);
  const commOk = useHipotStore((s) => s.commOk);
  const useIp = useHipotStore((s) => s.useIp);
  const useRs485 = useHipotStore((s) => s.useRs485);
  const ipAddress = useHipotStore((s) => s.ipAddress);
  const rs485Port = useHipotStore((s) => s.rs485Port);

  const detail = commOk
    ? [
        useIp ? `IP ${ipAddress}` : null,
        useRs485 ? `RS-485 ${rs485Port}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : 'No communication';

  return (
    <>
      <button
        type="button"
        className={`hipot-comm-led${commOk ? ' ok' : ' fault'}`}
        onClick={() => setOpen(true)}
        title="Hipot communication — click to configure"
        aria-label={`Hipot communication ${commOk ? 'OK' : 'fault'}. Click to configure.`}
      >
        <span className="hipot-comm-led-bulb" aria-hidden />
        <span className="hipot-comm-led-text">
          <span className="hipot-comm-led-status">
            {commOk ? 'Communication OK' : 'Communication fault'}
          </span>
          <span className="hipot-comm-led-detail">{detail}</span>
        </span>
      </button>
      {open && <HipotCommModal onClose={() => setOpen(false)} />}
    </>
  );
}
