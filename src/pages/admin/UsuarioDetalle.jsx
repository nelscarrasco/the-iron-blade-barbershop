import { Link, useParams } from 'react-router-dom';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import EstadoOrden from '../../components/common/EstadoOrden';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { ordenesApi, usuariosApi } from '../../api';
import { formatearFecha, formatearFechaHora, formatearPrecio } from '../../utils/formato';

export default function UsuarioDetalle() {
  const { id } = useParams();
  const { datos, cargando, error } = useApi(async () => {
    const [usuario, ordenes] = await Promise.all([usuariosApi.obtener(id), ordenesApi.listar({ usuarioId: id, _sort: 'fecha', _order: 'desc' })]);
    return { usuario, ordenes };
  }, [id]);

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error.includes('404') ? 'El usuario no existe.' : error} />;

  const { usuario: u, ordenes } = datos;
  const totalComprado = ordenes.filter((o) => o.estado === 'pagada').reduce((a, o) => a + o.total, 0);

  return (
    <>
      <EncabezadoAdmin titulo="Mostrar usuario" subtitulo={u.email} acciones={[
        { a: '/admin/usuarios', texto: 'Volver', icono: 'bi-arrow-left', clase: 'btn btn-outline-light btn-sm' },
        { a: `/admin/usuarios/${u.id}/editar`, texto: 'Editar usuario', icono: 'bi-pencil' }
      ]} />
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="panel-admin">
            <h2 className="h5">{u.nombre} {u.apellidos}</h2>
            <dl className="row mb-0 small">
              <dt className="col-5">RUN</dt><dd className="col-7">{u.run}</dd>
              <dt className="col-5">Rol</dt><dd className="col-7 text-capitalize">{u.rol}</dd>
              <dt className="col-5">Teléfono</dt><dd className="col-7">{u.telefono || '—'}</dd>
              <dt className="col-5">Dirección</dt><dd className="col-7">{u.direccion} {u.departamento}</dd>
              <dt className="col-5">Comuna / Región</dt><dd className="col-7">{u.comuna}, {u.region}</dd>
              <dt className="col-5">Registro</dt><dd className="col-7">{formatearFecha(u.fechaRegistro)}</dd>
            </dl>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="panel-admin">
            <h2 className="h5">Historial de compras</h2>
            <p className="small text-secondary">{ordenes.length} orden(es) · Total pagado: {formatearPrecio(totalComprado)}</p>
            {ordenes.length ? (
              <div className="table-responsive">
                <table className="table table-dark tabla-iron table-sm align-middle mb-0">
                  <thead><tr><th>N°</th><th>Fecha</th><th className="text-end">Total</th><th>Estado</th><th></th></tr></thead>
                  <tbody>
                    {ordenes.map((o) => (
                      <tr key={o.id}>
                        <td>{o.id}</td><td>{formatearFechaHora(o.fecha)}</td><td className="text-end">{formatearPrecio(o.total)}</td>
                        <td><EstadoOrden estado={o.estado} /></td>
                        <td><Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-iron-outline">Boleta</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="mb-0">Este usuario aún no registra compras.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
