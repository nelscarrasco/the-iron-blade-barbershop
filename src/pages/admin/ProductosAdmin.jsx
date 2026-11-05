import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import ModalConfirmacion from '../../components/common/ModalConfirmacion';
import { Cargando, EstadoVacio, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import { productosApi } from '../../api';
import { enOferta, esStockCritico, formatearPrecio } from '../../utils/formato';

export const ACCIONES_PRODUCTOS = [
  { a: '/admin/productos/nuevo', texto: 'Nuevo producto', icono: 'bi-plus-lg' },
  { a: '/admin/productos/criticos', texto: 'Productos críticos', icono: 'bi-exclamation-triangle', clase: 'btn btn-outline-warning btn-sm' },
  { a: '/admin/productos/reportes', texto: 'Reportes', icono: 'bi-bar-chart', clase: 'btn btn-outline-light btn-sm' }
];

export function TablaProductos({ productos, alEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table table-dark tabla-iron align-middle">
        <thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th className="text-end">Precio</th><th className="text-center">Stock</th><th className="text-end">Acciones</th></tr></thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.codigo}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <img src={p.imagen} alt="" className="miniatura" />
                  <span>{p.nombre}{enOferta(p) && <span className="badge bg-danger ms-2">Oferta</span>}</span>
                </div>
              </td>
              <td>{p.categoria?.nombre ?? '—'}</td>
              <td className="text-end">{formatearPrecio(p.precioOferta ?? p.precio)}</td>
              <td className="text-center">
                <span className={`badge ${esStockCritico(p) ? 'bg-warning text-dark' : 'bg-secondary'}`}>{p.stock}</span>
              </td>
              <td className="text-end text-nowrap">
                <Link to={`/admin/productos/${p.id}`} className="btn btn-sm btn-outline-light me-1" aria-label={`Ver ${p.nombre}`}><i className="bi bi-eye"></i></Link>
                <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-iron me-1" aria-label={`Editar ${p.nombre}`}><i className="bi bi-pencil"></i></Link>
                {alEliminar && <button className="btn btn-sm btn-danger" onClick={() => alEliminar(p)} aria-label={`Eliminar ${p.nombre}`}><i className="bi bi-trash"></i></button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductosAdmin() {
  const [texto, setTexto] = useState('');
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const mostrarToast = useToast();
  const { datos, setDatos, cargando, error, recargar } = useApi(() => productosApi.listarConCategoria());

  const lista = (datos ?? []).filter((p) => `${p.codigo} ${p.nombre} ${p.categoria?.nombre ?? ''}`.toLowerCase().includes(texto.trim().toLowerCase()));

  const confirmarEliminar = async () => {
    setEliminando(true);
    try {
      await productosApi.eliminar(aEliminar.id);
      setDatos((lista) => lista.filter((p) => p.id !== aEliminar.id));
      mostrarToast(`Producto "${aEliminar.nombre}" eliminado.`);
    } catch (e) {
      mostrarToast(e.message, 'error');
    } finally {
      setEliminando(false);
      setAEliminar(null);
    }
  };

  return (
    <>
      <EncabezadoAdmin titulo="Productos" subtitulo="Inventario de servicios y productos" acciones={ACCIONES_PRODUCTOS} />
      <MensajeError mensaje={error} alReintentar={recargar} />
      <input className="form-control mb-3" type="search" placeholder="Buscar por código, nombre o categoría" aria-label="Buscar productos" value={texto} onChange={(e) => setTexto(e.target.value)} />
      {cargando ? <Cargando /> : lista.length ? <TablaProductos productos={lista} alEliminar={setAEliminar} /> : <EstadoVacio titulo="Sin productos" />}
      <ModalConfirmacion
        abierto={Boolean(aEliminar)}
        titulo="Eliminar producto"
        mensaje={`¿Seguro que deseas eliminar "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        alConfirmar={confirmarEliminar}
        alCancelar={() => setAEliminar(null)}
        procesando={eliminando}
      />
    </>
  );
}
