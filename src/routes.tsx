import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TestRunPage } from './pages/TestRunPage';
import { TestApprovedPage } from './pages/TestApprovedPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<TestRunPage />} />
      <Route path="/approved" element={<TestApprovedPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
