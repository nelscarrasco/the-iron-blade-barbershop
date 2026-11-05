export const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(mensaje, estado) {
    super(mensaje);
    this.estado = estado;
  }
}

export async function peticion(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
      body: opciones.body !== undefined ? JSON.stringify(opciones.body) : undefined
    });
  } catch {
    throw new ApiError('No se pudo conectar con la API. ¿Está corriendo json-server en el puerto 3001? (npm run api)', 0);
  }
  if (!respuesta.ok) {
    throw new ApiError(`Error ${respuesta.status} al consultar ${ruta}`, respuesta.status);
  }
  if (respuesta.status === 204) return null;
  return respuesta.json();
}

function aQuery(filtros = {}) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') params.append(clave, valor);
  });
  const texto = params.toString();
  return texto ? `?${texto}` : '';
}

export function crearRecurso(nombre) {
  return {
    listar: (filtros) => peticion(`/${nombre}${aQuery(filtros)}`),
    obtener: (id, filtros) => peticion(`/${nombre}/${id}${aQuery(filtros)}`),
    crear: (datos) => peticion(`/${nombre}`, { method: 'POST', body: datos }),
    actualizar: (id, datos) => peticion(`/${nombre}/${id}`, { method: 'PUT', body: datos }),
    modificar: (id, cambios) => peticion(`/${nombre}/${id}`, { method: 'PATCH', body: cambios }),
    eliminar: (id) => peticion(`/${nombre}/${id}`, { method: 'DELETE' })
  };
}
