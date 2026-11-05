import { useParams } from 'react-router-dom';
import TablaItems from '../../components/tienda/TablaItems';
import DatosEntrega from '../../components/tienda/DatosEntrega';
import EstadoOrden from '../../components/common/EstadoOrden';
import BotonVolver from '../../components/common/BotonVolver';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { ordenesApi } from '../../api';
import { formatearFechaHora, formatearPrecio } from '../../utils/formato';

export default function OrdenDetalle() {
  const { id } = useParams();
  const { datos: orden, cargando, error } = useApi(() => ordenesApi.obtener(id), [id]);

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error.includes('404') ? 'La orden no existe.' : error} />;

  return (
    <div className="boleta">
      <div className="d-flex flex-wrap justify-content-between gap-2 mb-3 no-imprimir">
        <BotonVolver />
        <button className="btn btn-sm btn-danger" onClick={() => window.print()}><i className="bi bi-printer me-1"></i>Imprimir boleta</button>
      </div>
      <div className="form-iron ancho-grande m-0">
        <div className="d-flex flex-wrap justify-content-between">
          <h1 className="h4">Boleta N° {orden.id}</h1>
          <div className="text-end small">
            <div>Código: {orden.codigo}</div>
            <div>{formatearFechaHora(orden.fecha)}</div>
            <EstadoOrden estado={orden.estado} />
          </div>
        </div>
        <p className="small text-secondary mb-0">The Iron Blade Barbershop · Av. Providencia 1234, Santiago · Medio de pago: {orden.medioPago || '—'}</p>
        {orden.motivo && <div className="alert alert-danger mt-2 mb-0 small">{orden.motivo}</div>}
        <DatosEntrega orden={orden} />
        <TablaItems items={orden.items} conImagen={false} />
        <div className="text-end mt-3">
          <div>Subtotal: {formatearPrecio(orden.subtotal)}</div>
          <div>Despacho: {formatearPrecio(orden.costoEnvio)}</div>
          <div className="fs-5">Total: <strong className="texto-dorado">{formatearPrecio(orden.total)}</strong></div>
        </div>
      </div>
    </div>
  );
}
