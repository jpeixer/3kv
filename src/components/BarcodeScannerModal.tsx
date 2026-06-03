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
  const [cameraReady, setCameraReady] = useState(false);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const stopScanner = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setCameraReady(false);
  };

  useEffect(() => {
    if (scannedSerial) return;

    const reader = new BrowserMultiFormatReader();
    let active = true;

    const start = async () => {
      try {
        if (!videoRef.current) return;

        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: 'environment' } } },
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
        setCameraReady(true);
      } catch {
        try {
          const devices = await BrowserMultiFormatReader.listVideoInputDevices();
          const backCamera =
            devices.find((d) => /back|rear|environment/i.test(d.label)) ?? devices[0];
          if (!backCamera?.deviceId || !videoRef.current) {
            setCameraError('No camera found. Use manual entry instead.');
            return;
          }
          const controls = await reader.decodeFromVideoDevice(
            backCamera.deviceId,
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
          setCameraReady(true);
        } catch {
          setCameraError('Camera access denied. Use manual entry instead.');
        }
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
        <p className="scan-hint">Center the barcode inside the frame</p>
        {cameraError ? (
          <p className="form-error">{cameraError}</p>
        ) : (
          <div className="scan-preview">
            <video ref={videoRef} muted playsInline autoPlay className={cameraReady ? 'ready' : ''} />
            <div className="scan-mask" aria-hidden>
              <div className="scan-frame">
                <span className="scan-corner scan-corner-tl" />
                <span className="scan-corner scan-corner-tr" />
                <span className="scan-corner scan-corner-bl" />
                <span className="scan-corner scan-corner-br" />
              </div>
              <p className="scan-frame-label">Align barcode here</p>
            </div>
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
