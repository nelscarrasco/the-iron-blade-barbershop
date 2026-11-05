import { Link } from 'react-router-dom';
import Precio from './Precio';
import BotonAgregarCarrito from './BotonAgregarCarrito';
import { enOferta } from '../../utils/formato';

export default function ProductoCard({ producto }) {
  return (
    <article className="card card-iron h-100">
      <Link to={`/productos/${producto.id}`} className="position-relative d-block">
        <img src={producto.imagen} alt={producto.nombre} className="card-img-top" loading="lazy" />
        {enOferta(producto) && <span className="badge bg-danger badge-oferta">Oferta</span>}
      </Link>
      <div className="card-body d-flex flex-column">
        {producto.categoria && <span className="badge-categoria align-self-start mb-2">{producto.categoria.nombre}</span>}
        <h3 className="card-title h6">
          <Link to={`/productos/${producto.id}`} className="link-titulo">{producto.nombre}</Link>
        </h3>
        <p className="card-text small flex-grow-1">{producto.descripcion}</p>
        <div className="mb-2"><Precio producto={producto} /></div>
        <p className="small text-secondary mb-2">Stock disponible: {producto.stock}</p>
        <BotonAgregarCarrito producto={producto} />
      </div>
    </article>
  );
}
