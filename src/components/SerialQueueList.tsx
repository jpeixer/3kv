import { useTestStore } from '../store/useTestStore';
import type { SerialStatus } from '../types/test';
import './SerialQueueList.css';

function statusLabel(status: SerialStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In progress';
    case 'done':
      return 'Done';
  }
}

function statusClass(status: SerialStatus): string {
  switch (status) {
    case 'pending':
      return 'badge-pending';
    case 'in_progress':
      return 'badge-progress';
    case 'done':
      return 'badge-done';
  }
}

export function SerialQueueList() {
  const items = useTestStore((s) => s.serialItems);
  const selectedIds = useTestStore((s) => s.selectedIds);
  const toggleSelected = useTestStore((s) => s.toggleSelected);
  const removeSerial = useTestStore((s) => s.removeSerial);

  if (items.length === 0) {
    return (
      <div className="card queue-empty">
        <p>No serial numbers in queue. Add one to begin.</p>
      </div>
    );
  }

  return (
    <div className="card queue-list">
      <ul className="queue-items">
        {items.map((item) => {
          const isSelected = selectedIds.has(item.id);
          const canSelect = item.status === 'pending';
          return (
            <li key={item.id} className={`queue-item${isSelected ? ' selected' : ''}`}>
              <label className="queue-item-main">
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={!canSelect}
                  onChange={() => toggleSelected(item.id)}
                />
                <span className="queue-serial">{item.serialNumber}</span>
                <span className="badge">{item.windingCount} windings</span>
                <span className={`badge ${statusClass(item.status)}`}>
                  {statusLabel(item.status)}
                </span>
              </label>
              <button
                type="button"
                className="btn-remove"
                title="Remove from queue"
                onClick={() => removeSerial(item.id)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
