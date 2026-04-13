import { useCallback } from 'react';

export function useAutoResize() {
  return useCallback((el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, []);
}
