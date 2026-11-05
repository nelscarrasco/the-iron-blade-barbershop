import { formatearPrecio } from '../../utils/formato';

export default function TablaItems({ items, conImagen = true }) {
  return (
    <div className="table-responsive">
      <table className="table table-dark tabla-iron align-middle mb-0">
        <thead>
          <tr>
            {conImagen && <th scope="col">Imagen</th>}
            <th scope="col">Nombre</th>
            <th scope="col" className="text-end">Precio</th>
            <th scope="col" className="text-center">Cantidad</th>
            <th scope="col" className="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.productoId}>
              {conImagen && <td>{i.imagen && <img src={i.imagen} alt="" className="miniatura" />}</td>}
              <td>{i.nombre}</td>
              <td className="text-end">{formatearPrecio(i.precio)}</td>
              <td className="text-center">{i.cantidad}</td>
              <td className="text-end">{formatearPrecio(i.subtotal ?? i.precio * i.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
