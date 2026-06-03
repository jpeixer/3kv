import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { applyThemeToDocument } from './theme/companyTheme';

export default function App() {
  useEffect(() => {
    applyThemeToDocument();
  }, []);

  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
