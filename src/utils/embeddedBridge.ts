export type EmbedSafetyMessage = {
  type: '3kv:safety';
  operational: boolean;
};

const MESSAGE_TYPE = '3kv:safety';

export function postEmbedSafetyState(operational: boolean): void {
  if (window.parent === window) return;
  const message: EmbedSafetyMessage = { type: MESSAGE_TYPE, operational };
  window.parent.postMessage(message, '*');
}

export function isEmbedSafetyMessage(data: unknown): data is EmbedSafetyMessage {
  return (
    typeof data === 'object'
    && data !== null
    && (data as EmbedSafetyMessage).type === MESSAGE_TYPE
    && typeof (data as EmbedSafetyMessage).operational === 'boolean'
  );
}
