import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { EmbeddedSafetyBridge } from './components/EmbeddedSafetyBridge';
import { applyThemeToDocument } from './theme/companyTheme';

export default function App() {
  useEffect(() => {
    applyThemeToDocument();
  }, []);

  return (
    <HashRouter>
      <EmbeddedSafetyBridge />
      <AppRoutes />
    </HashRouter>
  );
}
