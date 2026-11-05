import { Link, useParams } from 'react-router-dom';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import Precio from '../../components/tienda/Precio';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { productosApi } from '../../api';
import { esStockCritico } from '../../utils/formato';

export default function ProductoDetalleAdmin() {
  const { id } = useParams();
  const { datos: p, cargando, error } = useApi(() => productosApi.obtenerConCategoria(id), [id]);

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error.includes('404') ? 'El producto no existe.' : error} />;

  return (
    <>
      <EncabezadoAdmin titulo="Mostrar producto" subtitulo={p.codigo} acciones={[
        { a: '/admin/productos', texto: 'Volver', icono: 'bi-arrow-left', clase: 'btn btn-outline-light btn-sm' },
        { a: `/admin/productos/${p.id}/editar`, texto: 'Editar producto', icono: 'bi-pencil' }
      ]} />
      <div className="row g-4">
        <div className="col-md-4"><img src={p.imagen} alt={p.nombre} className="img-fluid rounded" /></div>
        <div className="col-md-8">
          <h2 className="h4">{p.nombre}</h2>
          <dl className="row">
            <dt className="col-sm-4">Categoría</dt><dd className="col-sm-8">{p.categoria?.nombre ?? '—'}</dd>
            <dt className="col-sm-4">Precio</dt><dd className="col-sm-8"><Precio producto={p} /></dd>
            <dt className="col-sm-4">Stock</dt>
            <dd className="col-sm-8">{p.stock} {esStockCritico(p) && <span className="badge bg-warning text-dark ms-1">Crítico (≤ {p.stockCritico})</span>}</dd>
            <dt className="col-sm-4">Stock crítico</dt><dd className="col-sm-8">{p.stockCritico}</dd>
            <dt className="col-sm-4">Descripción</dt><dd className="col-sm-8">{p.descripcion}</dd>
          </dl>
          <Link to={`/productos/${p.id}`} className="small">Ver en la tienda <i className="bi bi-box-arrow-up-right"></i></Link>
        </div>
      </div>
    </>
  );
}
