import { crearRecurso, peticion } from './cliente';

export const productosApi = {
  ...crearRecurso('productos'),
  listarConCategoria: (filtros) => crearRecurso('productos').listar({ _expand: 'categoria', ...filtros }),
  obtenerConCategoria: (id) => crearRecurso('productos').obtener(id, { _expand: 'categoria' })
};

export const categoriasApi = crearRecurso('categorias');
export const usuariosApi = {
  ...crearRecurso('usuarios'),
  buscarPorEmail: async (email) => {
    const lista = await peticion(`/usuarios?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    return lista[0] ?? null;
  }
};
export const ordenesApi = crearRecurso('ordenes');
export const blogsApi = crearRecurso('blogs');
export const mensajesApi = crearRecurso('mensajes');
export const reservasApi = crearRecurso('reservas');

export function siguienteCodigoOrden() {
  const ahora = new Date();
  const fecha = ahora.toISOString().slice(0, 10).replace(/-/g, '');
  return `ORD${fecha}-${String(ahora.getTime()).slice(-4)}`;
}
