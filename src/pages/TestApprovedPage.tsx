import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/useTestStore';
import './TestApprovedPage.css';

export function TestApprovedPage() {
  const navigate = useNavigate();
  const completedSerialNumbers = useTestStore((s) => s.completedSerialNumbers);
  const batchPhotos = useTestStore((s) => s.batchPhotos);
  const currentBatchNumber = useTestStore((s) => s.currentBatchNumber);
  const clearCompleted = useTestStore((s) => s.clearCompleted);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const preview = batchPhotos.find((p) => p.id === previewId);

  const handleNewBatch = () => {
    clearCompleted();
    navigate('/');
  };

  return (
    <div className="approved-page">
      <div className="approved-content">
        <h1 className="approved-title">TEST APPROVED</h1>
        {currentBatchNumber && (
          <p className="approved-batch-number">
            Batch no. <strong>{currentBatchNumber}</strong>
          </p>
        )}
        {completedSerialNumbers.length > 0 && (
          <div className="approved-serials">
            <p className="approved-subtitle">Completed serial numbers</p>
            <ul>
              {completedSerialNumbers.map((sn) => (
                <li key={sn}>{sn}</li>
              ))}
            </ul>
          </div>
        )}
        {batchPhotos.length > 0 && (
          <div className="approved-photos">
            <p className="approved-subtitle">Batch photos ({batchPhotos.length})</p>
            <ul className="approved-photo-list">
              {batchPhotos.map((photo) => (
                <li key={photo.id}>
                  <button
                    type="button"
                    className="approved-photo-thumb"
                    onClick={() => setPreviewId(photo.id)}
                  >
                    <img src={photo.dataUrl} alt="Batch test capture" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="button" className="btn btn-secondary btn-lg" onClick={handleNewBatch}>
          Start new batch
        </button>
      </div>
      {preview && (
        <div className="modal-backdrop" role="presentation" onClick={() => setPreviewId(null)}>
          <div
            className="modal approved-photo-modal"
            role="dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={preview.dataUrl} alt="Batch test capture preview" />
            <p className="batch-photo-preview-meta">Batch {preview.batchNumber}</p>
            <button type="button" className="btn btn-secondary" onClick={() => setPreviewId(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
