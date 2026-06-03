import { useState, type FormEvent } from 'react';
import { useTestStore } from '../store/useTestStore';

type Props = {
  onClose: () => void;
  initialSerial?: string;
  serialReadOnly?: boolean;
};

export function ManualAddModal({ onClose, initialSerial = '', serialReadOnly = false }: Props) {
  const addSerial = useTestStore((s) => s.addSerial);
  const [serialNumber, setSerialNumber] = useState(initialSerial);
  const [windingCount, setWindingCount] = useState('1');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const count = parseInt(windingCount, 10);
    const err = addSerial(serialNumber, count);
    if (err) {
      setError(err);
      return;
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby="manual-add-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="manual-add-title">Add serial manually</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="serial-number">Serial number</label>
            <input
              id="serial-number"
              type="text"
              value={serialNumber}
              readOnly={serialReadOnly}
              onChange={(e) => setSerialNumber(e.target.value)}
              autoFocus={!serialReadOnly}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="winding-count">Number of windings</label>
            <input
              id="winding-count"
              type="number"
              min={1}
              max={99}
              value={windingCount}
              onChange={(e) => setWindingCount(e.target.value)}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add to queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
