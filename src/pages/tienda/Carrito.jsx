import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import { EstadoVacio, TituloSeccion } from '../../components/common/Estados';
import { formatearPrecio } from '../../utils/formato';

export default function Carrito() {
  const { items, total, cantidadTotal, cambiarCantidad, eliminar, vaciar } = useCarrito();
  const navegar = useNavigate();

  if (!items.length) {
    return (
      <section className="seccion seccion-oscura pagina-media">
        <EstadoVacio icono="bi-cart-x" titulo="Tu carrito está vacío" texto="Agrega servicios o productos desde el catálogo." enlace="/productos" textoEnlace="Ir a productos" />
      </section>
    );
  }

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <TituloSeccion as="h1" titulo="Carrito de compras" subtitulo={`${cantidadTotal} artículo(s) en tu carrito`} />
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="table table-dark tabla-iron align-middle">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col" className="text-end">Precio</th>
                    <th scope="col" className="text-center">Cantidad</th>
                    <th scope="col" className="text-end">Subtotal</th>
                    <th scope="col"><span className="visually-hidden">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.productoId}>
                      <td>
                        <Link to={`/productos/${i.productoId}`} className="d-flex align-items-center gap-2 link-titulo">
                          <img src={i.imagen} alt="" className="miniatura" />
                          <span>{i.nombre}</span>
                        </Link>
                      </td>
                      <td className="text-end">{formatearPrecio(i.precio)}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm" role="group" aria-label={`Cantidad de ${i.nombre}`}>
                          <button className="btn btn-outline-light" onClick={() => cambiarCantidad(i.productoId, i.cantidad - 1)} aria-label="Disminuir">−</button>
                          <span className="btn btn-dark disabled cantidad-carrito">{i.cantidad}</span>
                          <button className="btn btn-outline-light" onClick={() => cambiarCantidad(i.productoId, i.cantidad + 1)} disabled={i.cantidad >= i.stock} aria-label="Aumentar">+</button>
                        </div>
                      </td>
                      <td className="text-end">{formatearPrecio(i.precio * i.cantidad)}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-danger" onClick={() => eliminar(i.productoId)} aria-label={`Eliminar ${i.nombre}`}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="resumen-carrito">
              <h2 className="h5">Resumen</h2>
              <div className="d-flex justify-content-between"><span>Artículos</span><span>{cantidadTotal}</span></div>
              <div className="d-flex justify-content-between fs-5 mt-2"><strong>Total</strong><strong className="texto-dorado">{formatearPrecio(total)}</strong></div>
              <p className="small text-secondary mt-2">El costo de despacho se calcula en el checkout.</p>
              <button className="btn btn-iron w-100 mt-2" onClick={() => navegar('/checkout')}>Comprar ahora</button>
              <button className="btn btn-outline-light w-100 mt-2" onClick={vaciar}>Limpiar carrito</button>
              <Link to="/productos" className="btn btn-link w-100 mt-1">Seguir comprando</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
