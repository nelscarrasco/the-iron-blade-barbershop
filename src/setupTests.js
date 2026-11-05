import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Node 22+ trae su propio localStorage/sessionStorage. En versiones recientes viene
// activo por defecto y, sin --localstorage-file, queda en undefined y tapa al de jsdom.
// Si no hay un storage utilizable, se reemplaza por uno simple en memoria.
function crearStorage() {
  const datos = new Map();
  return {
    getItem: (k) => (datos.has(String(k)) ? datos.get(String(k)) : null),
    setItem: (k, v) => { datos.set(String(k), String(v)); },
    removeItem: (k) => { datos.delete(String(k)); },
    clear: () => { datos.clear(); },
    key: (i) => [...datos.keys()][i] ?? null,
    get length() { return datos.size; }
  };
}

for (const nombre of ['localStorage', 'sessionStorage']) {
  let disponible = false;
  try {
    disponible = typeof globalThis[nombre]?.clear === 'function';
  } catch { /* algunos entornos lanzan error al acceder */ }

  if (!disponible) {
    const storage = crearStorage();
    Object.defineProperty(globalThis, nombre, { value: storage, configurable: true, writable: true });
    if (typeof window !== 'undefined' && window !== globalThis) {
      Object.defineProperty(window, nombre, { value: storage, configurable: true, writable: true });
    }
  }
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});
