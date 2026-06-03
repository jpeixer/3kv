import { useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/useTestStore';
import './TestApprovedPage.css';

export function TestApprovedPage() {
  const navigate = useNavigate();
  const completedSerialNumbers = useTestStore((s) => s.completedSerialNumbers);
  const clearCompleted = useTestStore((s) => s.clearCompleted);

  const handleNewBatch = () => {
    clearCompleted();
    navigate('/');
  };

  return (
    <div className="approved-page">
      <div className="approved-content">
        <h1 className="approved-title">TEST APPROVED</h1>
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
        <button type="button" className="btn btn-secondary btn-lg" onClick={handleNewBatch}>
          Start new batch
        </button>
      </div>
    </div>
  );
}
