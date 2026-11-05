import ProductoCard from './ProductoCard';
import { EstadoVacio } from '../common/Estados';

export default function GrillaProductos({ productos, columnas = 'col-sm-6 col-lg-4 col-xl-3' }) {
  if (!productos.length) {
    return <EstadoVacio icono="bi-search" titulo="Sin resultados" texto="No encontramos productos con esos criterios." />;
  }
  return (
    <div className="row g-4">
      {productos.map((p) => (
        <div className={columnas} key={p.id}>
          <ProductoCard producto={p} />
        </div>
      ))}
    </div>
  );
}
