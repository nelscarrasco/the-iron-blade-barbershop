import { useCallback, useEffect, useState } from 'react';

export function useApi(funcion, dependencias = []) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setDatos(await funcion());
    } catch (e) {
      setError(e.message || 'Ocurrió un error inesperado.');
    } finally {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { datos, setDatos, cargando, error, recargar: cargar };
}
