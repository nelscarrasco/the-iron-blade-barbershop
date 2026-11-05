import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import EstadoOrden from '../../components/common/EstadoOrden';
import { Cargando, EstadoVacio, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { ordenesApi } from '../../api';
import { formatearFechaHora, formatearPrecio } from '../../utils/formato';

export default function Ordenes() {
  const [estado, setEstado] = useState('');
  const [texto, setTexto] = useState('');
  const { datos, cargando, error, recargar } = useApi(() => ordenesApi.listar({ _sort: 'fecha', _order: 'desc' }));

  const lista = (datos ?? []).filter((o) => {
    if (estado && o.estado !== estado) return false;
    const t = texto.trim().toLowerCase();
    if (t && !`${o.codigo} ${o.cliente.nombre} ${o.cliente.apellidos} ${o.cliente.email}`.toLowerCase().includes(t)) return false;
    return true;
  });

  return (
    <>
      <EncabezadoAdmin titulo="Órdenes / Boletas" subtitulo="Compras realizadas en la tienda" />
      <MensajeError mensaje={error} alReintentar={recargar} />
      <div className="row g-2 mb-3">
        <div className="col-md-6"><input className="form-control" type="search" placeholder="Buscar por código, cliente o correo" aria-label="Buscar órdenes" value={texto} onChange={(e) => setTexto(e.target.value)} /></div>
        <div className="col-md-3">
          <select className="form-select" aria-label="Filtrar por estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="pagada">Pagadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
        </div>
      </div>
      {cargando ? <Cargando /> : !lista.length ? <EstadoVacio icono="bi-receipt" titulo="Sin órdenes" /> : (
        <div className="table-responsive">
          <table className="table table-dark tabla-iron align-middle">
            <thead><tr><th>N°</th><th>Código</th><th>Fecha</th><th>Cliente</th><th>Entrega</th><th className="text-end">Total</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {lista.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.codigo}</td>
                  <td>{formatearFechaHora(o.fecha)}</td>
                  <td>{o.cliente.nombre} {o.cliente.apellidos}<div className="small text-secondary">{o.cliente.email}</div></td>
                  <td className="text-capitalize">{o.entrega.tipo}</td>
                  <td className="text-end">{formatearPrecio(o.total)}</td>
                  <td><EstadoOrden estado={o.estado} /></td>
                  <td><Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-iron-outline">Mostrar boleta</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
