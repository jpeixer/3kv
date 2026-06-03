import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DurationSelector } from '../components/DurationSelector';
import { SerialQueueList } from '../components/SerialQueueList';
import { ManualAddModal } from '../components/ManualAddModal';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { HipotCommStatus } from '../components/HipotCommStatus';
import { StartConfirmModal } from '../components/StartConfirmModal';
import { formatSelectionWindingHint } from '../services/testRunner.mock';
import { useTestStore } from '../store/useTestStore';
import '../components/DurationSelector.css';
import './HomePage.css';

type ModalKind = 'manual' | 'barcode' | null;

export function HomePage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalKind>(null);
  const [confirmStart, setConfirmStart] = useState(false);
  const selectedIds = useTestStore((s) => s.selectedIds);
  const serialItems = useTestStore((s) => s.serialItems);
  const durationPerWindingSec = useTestStore((s) => s.durationPerWindingSec);
  const getSelectedItems = useTestStore((s) => s.getSelectedItems);
  const setItemStatus = useTestStore((s) => s.setItemStatus);
  const startBatch = useTestStore((s) => s.startBatch);
  const resetBatch = useTestStore((s) => s.resetBatch);

  const selectedItems = useMemo(
    () => serialItems.filter((i) => selectedIds.has(i.id)),
    [serialItems, selectedIds],
  );
  const canStart = selectedItems.length > 0;
  const selectionHint = formatSelectionWindingHint(selectedItems);

  const handleStartClick = () => {
    if (selectedItems.length === 0) return;
    startBatch();
    setConfirmStart(true);
  };

  const handleConfirmStart = () => {
    const items = getSelectedItems();
    if (items.length === 0) return;
    items.forEach((item) => setItemStatus(item.id, 'in_progress'));
    setConfirmStart(false);
    navigate('/test', { state: { itemIds: items.map((i) => i.id) } });
  };

  const handleCancelStart = () => {
    resetBatch();
    setConfirmStart(false);
  };

  return (
    <div className="app-shell home-page">
      <header className="page-header">
        <div className="page-header-main">
          <h1>Withstand Voltage Test — Secondary Windings</h1>
          <p>
            Select serial numbers and duration. Mixed winding counts run together; higher
            windings apply only where configured.
          </p>
        </div>
        <HipotCommStatus />
      </header>

      <div className="page-body home-layout">
        <aside className="home-sidebar">
          <DurationSelector />
          <div className="home-actions">
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={() => setModal('manual')}
            >
              Add serial manually
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={() => setModal('barcode')}
            >
              Scan barcode
            </button>
          </div>
        </aside>

        <main className="home-main">
          <SerialQueueList />
        </main>
      </div>

      <footer className="home-footer">
        <p className="home-selection-hint">{selectionHint}</p>
        <button
          type="button"
          className="btn btn-start"
          disabled={!canStart}
          onClick={handleStartClick}
        >
          START
        </button>
      </footer>

      {modal === 'manual' && <ManualAddModal onClose={() => setModal(null)} />}
      {modal === 'barcode' && (
        <BarcodeScannerModal
          onClose={() => setModal(null)}
          onManualEntry={() => setModal('manual')}
        />
      )}
      {confirmStart && (
        <StartConfirmModal
          items={selectedItems}
          durationSec={durationPerWindingSec}
          onConfirm={handleConfirmStart}
          onCancel={handleCancelStart}
        />
      )}
    </div>
  );
}
