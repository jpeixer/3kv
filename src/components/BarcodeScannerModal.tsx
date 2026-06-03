import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { ManualAddModal } from './ManualAddModal';
import './BarcodeScannerModal.css';

type Props = {
  onClose: () => void;
  onManualEntry?: () => void;
};

export function BarcodeScannerModal({ onClose, onManualEntry }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedSerial, setScannedSerial] = useState<string | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const stopScanner = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  };

  useEffect(() => {
    if (scannedSerial) return;

    const reader = new BrowserMultiFormatReader();
    let active = true;

    const start = async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const deviceId = devices[0]?.deviceId;
        if (!deviceId) {
          setCameraError('No camera found. Use manual entry instead.');
          return;
        }
        if (!videoRef.current) return;

        const controls = await reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result) => {
            if (!active || scannedSerial) return;
            if (result) {
              const text = result.getText().trim();
              if (text) {
                active = false;
                stopScanner();
                setScannedSerial(text);
              }
            }
          },
        );
        controlsRef.current = controls;
      } catch {
        setCameraError('Camera access denied. Use manual entry instead.');
      }
    };

    start();

    return () => {
      active = false;
      stopScanner();
    };
  }, [scannedSerial]);

  if (scannedSerial) {
    return (
      <ManualAddModal
        initialSerial={scannedSerial}
        serialReadOnly
        onClose={onClose}
      />
    );
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal modal-scan"
        role="dialog"
        aria-labelledby="scan-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="scan-title">Scan barcode</h2>
        <p className="scan-hint">Align barcode in frame</p>
        {cameraError ? (
          <p className="form-error">{cameraError}</p>
        ) : (
          <div className="scan-preview">
            <video ref={videoRef} muted playsInline />
          </div>
        )}
        <div className="modal-actions scan-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              stopScanner();
              if (onManualEntry) onManualEntry();
              else onClose();
            }}
          >
            Enter serial manually
          </button>
        </div>
      </div>
    </div>
  );
}
