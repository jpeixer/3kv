import { useState, type FormEvent } from 'react';
import { useHipotStore } from '../store/useHipotStore';
import './HipotCommModal.css';

type Props = {
  onClose: () => void;
};

export function HipotCommModal({ onClose }: Props) {
  const commOk = useHipotStore((s) => s.commOk);
  const ipAddress = useHipotStore((s) => s.ipAddress);
  const rs485Port = useHipotStore((s) => s.rs485Port);
  const useIp = useHipotStore((s) => s.useIp);
  const useRs485 = useHipotStore((s) => s.useRs485);
  const setCommOk = useHipotStore((s) => s.setCommOk);
  const setIpAddress = useHipotStore((s) => s.setIpAddress);
  const setRs485Port = useHipotStore((s) => s.setRs485Port);
  const setUseIp = useHipotStore((s) => s.setUseIp);
  const setUseRs485 = useHipotStore((s) => s.setUseRs485);

  const [ip, setIp] = useState(ipAddress);
  const [port, setPort] = useState(rs485Port);
  const [enableIp, setEnableIp] = useState(useIp);
  const [enableRs485, setEnableRs485] = useState(useRs485);
  const [simCommOk, setSimCommOk] = useState(commOk);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!enableIp && !enableRs485) return;
    setUseIp(enableIp);
    setUseRs485(enableRs485);
    if (enableIp) setIpAddress(ip.trim());
    if (enableRs485) setRs485Port(port.trim());
    setCommOk(simCommOk);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal hipot-comm-modal"
        role="dialog"
        aria-labelledby="hipot-comm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="hipot-comm-title">Hipot communication</h2>
        <p className="hipot-comm-subtitle">
          Configure connection settings. Live readings will use this link when hardware is
          connected.
        </p>
        <form onSubmit={handleSubmit}>
          <label className="hipot-comm-check">
            <input
              type="checkbox"
              checked={simCommOk}
              onChange={(e) => setSimCommOk(e.target.checked)}
            />
            Communication OK (simulated)
          </label>

          <label className="hipot-comm-check">
            <input
              type="checkbox"
              checked={enableIp}
              onChange={(e) => setEnableIp(e.target.checked)}
            />
            Ethernet (IP)
          </label>
          {enableIp && (
            <div className="form-group">
              <label htmlFor="hipot-ip">IP address</label>
              <input
                id="hipot-ip"
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.100"
              />
            </div>
          )}

          <label className="hipot-comm-check">
            <input
              type="checkbox"
              checked={enableRs485}
              onChange={(e) => setEnableRs485(e.target.checked)}
            />
            RS-485
          </label>
          {enableRs485 && (
            <div className="form-group">
              <label htmlFor="hipot-rs485">Serial port</label>
              <input
                id="hipot-rs485"
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="COM3"
              />
            </div>
          )}

          {!enableIp && !enableRs485 && (
            <p className="form-error">Enable at least one communication interface.</p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!enableIp && !enableRs485}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
