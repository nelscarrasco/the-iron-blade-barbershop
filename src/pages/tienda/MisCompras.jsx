import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { ordenesApi } from '../../api';
import { Cargando, EstadoVacio, MensajeError, TituloSeccion } from '../../components/common/Estados';
import EstadoOrden from '../../components/common/EstadoOrden';
import { formatearFechaHora, formatearPrecio } from '../../utils/formato';

export default function MisCompras() {
  const { usuario } = useAuth();
  const { datos, cargando, error, recargar } = useApi(() => ordenesApi.listar({ usuarioId: usuario.id, _sort: 'fecha', _order: 'desc' }), [usuario.id]);

  return (
    <section className="seccion seccion-oscura pagina-media">
      <div className="container">
        <TituloSeccion as="h1" titulo="Mis compras" subtitulo="Historial de tus órdenes" />
        <MensajeError mensaje={error} alReintentar={recargar} />
        {cargando ? <Cargando /> : !datos?.length ? (
          <EstadoVacio icono="bi-receipt" titulo="Aún no tienes compras" enlace="/productos" textoEnlace="Ir a productos" />
        ) : (
          <div className="table-responsive">
            <table className="table table-dark tabla-iron align-middle">
              <thead><tr><th>N°</th><th>Fecha</th><th>Productos</th><th className="text-end">Total</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {datos.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{formatearFechaHora(o.fecha)}</td>
                    <td>{o.items.reduce((a, i) => a + i.cantidad, 0)}</td>
                    <td className="text-end">{formatearPrecio(o.total)}</td>
                    <td><EstadoOrden estado={o.estado} /></td>
                    <td><Link to={`/compra/${o.estado === 'pagada' ? 'exitosa' : 'error'}/${o.id}`} className="btn btn-sm btn-iron-outline">Ver</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
