import { Link, useParams } from 'react-router-dom';
import TablaItems from '../../components/tienda/TablaItems';
import DatosEntrega from '../../components/tienda/DatosEntrega';
import { Cargando, EstadoVacio, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import { ordenesApi } from '../../api';
import { formatearFechaHora, formatearPrecio } from '../../utils/formato';

export default function ResultadoCompra({ exitosa }) {
  const { id } = useParams();
  const mostrarToast = useToast();
  const { datos: orden, cargando, error } = useApi(async () => {
    try {
      return await ordenesApi.obtener(id);
    } catch (e) {
      if (e.estado === 404) return null;
      throw e;
    }
  }, [id]);

  if (cargando) return <div className="seccion seccion-oscura"><Cargando /></div>;
  if (error) return <div className="container seccion"><MensajeError mensaje={error} /></div>;
  if (!orden) return <div className="seccion seccion-oscura"><EstadoVacio titulo="Orden no encontrada" enlace="/" textoEnlace="Ir al inicio" /></div>;

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <div className="form-iron ancho-grande boleta">
          <div className="d-flex flex-wrap justify-content-between gap-2">
            <h1 className="h4 mb-0">
              {exitosa
                ? <><i className="bi bi-check-circle text-success me-2"></i>Se ha realizado la compra. Nro #{orden.id}</>
                : <><i className="bi bi-x-circle text-danger me-2"></i>No se pudo realizar el pago. Nro #{orden.id}</>}
            </h1>
            <span className="small text-secondary">Código orden: {orden.codigo}</span>
          </div>
          <p className="small text-secondary">{formatearFechaHora(orden.fecha)} · {orden.medioPago}</p>

          {!exitosa && (
            <>
              <div className="alert alert-danger mt-2">{orden.motivo || 'El pago fue rechazado.'}</div>
              <div className="text-center my-3 no-imprimir">
                <Link to="/checkout" className="btn btn-success">VOLVER A REALIZAR EL PAGO</Link>
                <Link to="/carrito" className="btn btn-outline-light ms-2">Revisar carrito</Link>
              </div>
            </>
          )}

          <DatosEntrega orden={orden} />
          <TablaItems items={orden.items} conImagen={false} />

          <div className="resumen-carrito text-center mt-3">
            <div className="small text-secondary">Subtotal {formatearPrecio(orden.subtotal)} · Despacho {orden.costoEnvio ? formatearPrecio(orden.costoEnvio) : 'gratis'}</div>
            <div className="fs-5">{exitosa ? 'Total pagado' : 'Total'}: <strong className="texto-dorado">{formatearPrecio(orden.total)}</strong></div>
          </div>

          {exitosa && (
            <div className="text-center mt-3 no-imprimir">
              <button className="btn btn-danger btn-sm me-2" onClick={() => window.print()}><i className="bi bi-printer me-1"></i>Imprimir boleta en PDF</button>
              <button className="btn btn-success btn-sm me-2" onClick={() => mostrarToast(`Boleta enviada a ${orden.cliente.email} (envío simulado).`)}>
                <i className="bi bi-envelope me-1"></i>Enviar boleta por email
              </button>
              <Link to="/productos" className="btn btn-iron-outline btn-sm">Seguir comprando</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
