import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { postEmbedSafetyState } from '../utils/embeddedBridge';

/** Informa o viewer 3D pai quando o ensaio hipot está ativo (/test). */
export function EmbeddedSafetyBridge() {
  const location = useLocation();

  useEffect(() => {
    const operational = location.pathname === '/test';
    postEmbedSafetyState(operational);
  }, [location.pathname]);

  useEffect(() => {
    return () => postEmbedSafetyState(false);
  }, []);

  return null;
}
