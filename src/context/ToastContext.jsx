import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const mostrar = useCallback((mensaje, tipo = 'exito') => {
    const id = Date.now() + Math.random();
    setToasts((lista) => [...lista, { id, mensaje, tipo }]);
    setTimeout(() => setToasts((lista) => lista.filter((t) => t.id !== id)), 3200);
  }, []);

  const cerrar = (id) => setToasts((lista) => lista.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={mostrar}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
        {toasts.map((t) => (
          <div key={t.id} className="toast show align-items-center text-bg-dark border-0 mb-2" role="status" aria-live="polite">
            <div className="d-flex">
              <div className="toast-body">
                <i className={`bi ${t.tipo === 'error' ? 'bi-x-circle-fill text-danger' : 'bi-check-circle-fill texto-dorado'} me-2`}></i>
                {t.mensaje}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Cerrar" onClick={() => cerrar(t.id)}></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) throw new Error('useToast debe usarse dentro de ToastProvider');
  return contexto;
}
