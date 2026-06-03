import { useEffect, useRef, useState } from 'react';
import './PhotoCameraModal.css';

type Props = {
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
};

export function PhotoCameraModal({ onClose, onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setReady(false);
  };

  useEffect(() => {
    let active = true;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch {
        setCameraError('Camera access denied or unavailable.');
      }
    };

    start();
    return () => {
      active = false;
      stopCamera();
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !ready) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCapture(dataUrl);
    stopCamera();
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal photo-camera-modal"
        role="dialog"
        aria-labelledby="photo-camera-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="photo-camera-title">Take photo</h2>
        {cameraError ? (
          <p className="form-error">{cameraError}</p>
        ) : (
          <div className="photo-camera-preview">
            <video ref={videoRef} muted playsInline className={ready ? 'ready' : ''} />
          </div>
        )}
        <div className="modal-actions photo-camera-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!ready}
            onClick={handleCapture}
          >
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}
