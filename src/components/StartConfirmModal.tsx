import { BatchPhotoCapture } from './BatchPhotoCapture';
import { formatSelectionWindingHint } from '../services/testRunner.mock';
import type { SerialItem } from '../types/test';
import './StartConfirmModal.css';

type Props = {
  items: SerialItem[];
  durationSec: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export function StartConfirmModal({ items, durationSec, onConfirm, onCancel }: Props) {
  const serialNumbers = items.map((item) => item.serialNumber);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal start-confirm-modal"
        role="dialog"
        aria-labelledby="start-confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="start-confirm-title">Are you sure?</h2>
        <p className="start-confirm-warning">
          High voltage will be applied to the selected batch. Verify connections and safety
          before continuing.
        </p>
        <p className="start-confirm-summary">{formatSelectionWindingHint(items)}</p>
        <p className="start-confirm-duration">
          Test duration: <strong>{durationSec} s</strong> per winding at 3 kV plateau
        </p>
        <ul className="start-confirm-list">
          {items.map((item) => (
            <li key={item.id}>
              {item.serialNumber}
              <span className="start-confirm-windings">{item.windingCount} windings</span>
            </li>
          ))}
        </ul>
        <BatchPhotoCapture
          windingIndex={0}
          activeSerials={serialNumbers}
          compact
        />
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-start" onClick={onConfirm}>
            Yes, start test
          </button>
        </div>
      </div>
    </div>
  );
}
