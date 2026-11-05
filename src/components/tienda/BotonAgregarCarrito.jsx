import { useCarrito } from '../../context/CarritoContext';
import { useToast } from '../../context/ToastContext';

export default function BotonAgregarCarrito({ producto, cantidad = 1, className = 'btn btn-iron btn-sm w-100', texto = 'Añadir' }) {
  const { agregar, cantidadDe } = useCarrito();
  const mostrarToast = useToast();
  const enCarrito = cantidadDe(producto.id);
  const sinStock = producto.stock <= 0;
  const alLimite = enCarrito + cantidad > producto.stock;

  const alAgregar = () => {
    if (alLimite) {
      mostrarToast(`Solo quedan ${producto.stock} unidades de ${producto.nombre}.`, 'error');
      return;
    }
    agregar(producto, cantidad);
    mostrarToast(`${producto.nombre} agregado al carrito.`);
  };

  return (
    <button type="button" className={className} onClick={alAgregar} disabled={sinStock}>
      <i className="bi bi-cart-plus me-1"></i>{sinStock ? 'Sin stock' : texto}
    </button>
  );
}
