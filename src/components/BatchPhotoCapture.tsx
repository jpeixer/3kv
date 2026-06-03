import { useState } from 'react';
import { useTestStore } from '../store/useTestStore';
import type { BatchPhoto } from '../types/test';
import { PhotoCameraModal } from './PhotoCameraModal';
import './BatchPhotoCapture.css';

type Props = {
  windingIndex: number;
  activeSerials: string[];
  compact?: boolean;
};

export function BatchPhotoCapture({ windingIndex, activeSerials, compact = false }: Props) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [preview, setPreview] = useState<BatchPhoto | null>(null);
  const currentBatchNumber = useTestStore((s) => s.currentBatchNumber);
  const batchPhotos = useTestStore((s) => s.batchPhotos);
  const addBatchPhoto = useTestStore((s) => s.addBatchPhoto);
  const removeBatchPhoto = useTestStore((s) => s.removeBatchPhoto);

  const handleCapture = (dataUrl: string) => {
    addBatchPhoto({
      dataUrl,
      capturedAt: new Date().toISOString(),
      windingIndex: windingIndex > 0 ? windingIndex : undefined,
      serialNumbers: activeSerials.length > 0 ? [...activeSerials] : undefined,
    });
  };

  return (
    <div className={`batch-photo-capture${compact ? ' batch-photo-capture--compact' : ''}`}>
      {currentBatchNumber && (
        <p className="batch-photo-batch-id">
          Batch no. <strong>{currentBatchNumber}</strong>
        </p>
      )}
      <button
        type="button"
        className="btn btn-secondary batch-photo-btn"
        onClick={() => setCameraOpen(true)}
      >
        Add photo
      </button>
      {batchPhotos.length > 0 && (
        <div className="batch-photo-gallery">
          <p className="batch-photo-label">
            Batch photos ({batchPhotos.length})
          </p>
          <ul className="batch-photo-list">
            {batchPhotos.map((photo) => (
              <li key={photo.id}>
                <button
                  type="button"
                  className="batch-photo-thumb-btn"
                  onClick={() => setPreview(photo)}
                  aria-label="View batch photo"
                >
                  <img src={photo.dataUrl} alt="Test batch capture" />
                </button>
                <button
                  type="button"
                  className="batch-photo-remove"
                  onClick={() => removeBatchPhoto(photo.id)}
                  aria-label="Remove photo"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cameraOpen && (
        <PhotoCameraModal
          onClose={() => setCameraOpen(false)}
          onCapture={handleCapture}
        />
      )}
      {preview && (
        <div className="modal-backdrop" role="presentation" onClick={() => setPreview(null)}>
          <div
            className="modal batch-photo-preview-modal"
            role="dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={preview.dataUrl} alt="Test batch capture preview" />
            <p className="batch-photo-preview-meta">
              Batch {preview.batchNumber}
              {preview.windingIndex ? ` · Winding ${preview.windingIndex}` : ' · Pre-test'}
              {preview.serialNumbers?.length
                ? ` · ${preview.serialNumbers.join(', ')}`
                : ''}
            </p>
            <button type="button" className="btn btn-secondary" onClick={() => setPreview(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
