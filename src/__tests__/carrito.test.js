import { carritoReducer } from '../context/CarritoContext';

const pomada = { id: 6, nombre: 'Pomada', precio: 7990, precioOferta: null, stock: 3, imagen: '' };
const fade = { id: 2, nombre: 'Fade', precio: 11000, precioOferta: 9900, stock: 10, imagen: '' };

describe('carritoReducer (estado del carrito)', () => {
  it('agrega un producto usando el precio de oferta si existe', () => {
    const estado = carritoReducer([], { tipo: 'agregar', producto: fade });
    expect(estado).toHaveLength(1);
    expect(estado[0].precio).toBe(9900);
  });

  it('suma cantidades sin superar el stock disponible', () => {
    let estado = carritoReducer([], { tipo: 'agregar', producto: pomada, cantidad: 2 });
    estado = carritoReducer(estado, { tipo: 'agregar', producto: pomada, cantidad: 5 });
    expect(estado[0].cantidad).toBe(3);
  });

  it('elimina el producto cuando la cantidad llega a 0', () => {
    let estado = carritoReducer([], { tipo: 'agregar', producto: pomada });
    estado = carritoReducer(estado, { tipo: 'cambiarCantidad', productoId: 6, cantidad: 0 });
    expect(estado).toEqual([]);
  });

  it('vaciar deja el carrito sin productos', () => {
    const estado = carritoReducer([{ productoId: 1 }], { tipo: 'vaciar' });
    expect(estado).toEqual([]);
  });
});
