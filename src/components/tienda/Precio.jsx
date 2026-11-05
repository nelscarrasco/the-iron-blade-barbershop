import { enOferta, formatearPrecio, porcentajeDescuento } from '../../utils/formato';

export default function Precio({ producto, grande = false }) {
  if (enOferta(producto)) {
    return (
      <div className={grande ? 'fs-4' : ''}>
        <span className="precio-anterior me-2">{formatearPrecio(producto.precio)}</span>
        <span className="precio">{formatearPrecio(producto.precioOferta)}</span>
        <span className="badge bg-danger ms-2">-{porcentajeDescuento(producto)}%</span>
      </div>
    );
  }
  return <span className={`precio ${grande ? 'fs-4' : ''}`}>{formatearPrecio(producto.precio)}</span>;
}
