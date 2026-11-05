import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import ModalConfirmacion from '../../components/common/ModalConfirmacion';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import { categoriasApi, productosApi } from '../../api';

export default function CategoriasAdmin() {
  const mostrarToast = useToast();
  const [aEliminar, setAEliminar] = useState(null);
  const { datos, cargando, error, recargar } = useApi(async () => {
    const [categorias, productos] = await Promise.all([categoriasApi.listar(), productosApi.listar()]);
    return categorias.map((c) => ({ ...c, cantidad: productos.filter((p) => p.categoriaId === c.id).length }));
  });

  const eliminar = async () => {
    if (aEliminar.cantidad > 0) {
      mostrarToast('No puedes eliminar una categoría con productos asociados.', 'error');
      setAEliminar(null);
      return;
    }
    try {
      await categoriasApi.eliminar(aEliminar.id);
      mostrarToast('Categoría eliminada.');
      recargar();
    } catch (e) {
      mostrarToast(e.message, 'error');
    }
    setAEliminar(null);
  };

  return (
    <>
      <EncabezadoAdmin titulo="Categorías" subtitulo="Organiza los productos de la tienda" acciones={[{ a: '/admin/categorias/nueva', texto: 'Nueva categoría', icono: 'bi-plus-lg' }]} />
      <MensajeError mensaje={error} alReintentar={recargar} />
      {cargando ? <Cargando /> : (
        <div className="table-responsive">
          <table className="table table-dark tabla-iron align-middle">
            <thead><tr><th>ID</th><th>Categoría</th><th>Tipo</th><th>Descripción</th><th className="text-center">Productos</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {datos.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td><div className="d-flex align-items-center gap-2"><img src={c.imagen} alt="" className="miniatura" />{c.nombre}</div></td>
                  <td>{c.tipo}</td>
                  <td className="small">{c.descripcion}</td>
                  <td className="text-center">{c.cantidad}</td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/categorias/${c.id}/editar`} className="btn btn-sm btn-iron me-1" aria-label={`Editar ${c.nombre}`}><i className="bi bi-pencil"></i></Link>
                    <button className="btn btn-sm btn-danger" onClick={() => setAEliminar(c)} aria-label={`Eliminar ${c.nombre}`}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ModalConfirmacion abierto={Boolean(aEliminar)} titulo="Eliminar categoría"
        mensaje={aEliminar?.cantidad ? `"${aEliminar.nombre}" tiene ${aEliminar.cantidad} producto(s). Debes reasignarlos antes de eliminarla.` : `¿Eliminar la categoría "${aEliminar?.nombre}"?`}
        textoConfirmar={aEliminar?.cantidad ? 'Entendido' : 'Eliminar'}
        alConfirmar={eliminar} alCancelar={() => setAEliminar(null)} />
    </>
  );
}
