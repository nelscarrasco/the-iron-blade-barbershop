import { calcularTotales, verificarStock } from '../services/compra';
import { filtrarProductos } from '../pages/tienda/Productos';

const productos = [
  { id: 1, nombre: 'Corte Clásico', descripcion: 'tijera', categoriaId: 1, precio: 9000, precioOferta: null, stock: 5 },
  { id: 2, nombre: 'Kit de Afeitado', descripcion: 'navaja', categoriaId: 5, precio: 24990, precioOferta: 19990, stock: 1 }
];

describe('lógica de compra y filtros', () => {
  it('detecta stock insuficiente y recalcula precios vigentes', () => {
    const { lineas, problemas } = verificarStock([{ productoId: 2, nombre: 'Kit', cantidad: 2 }], productos);
    expect(problemas).toHaveLength(1);
    expect(lineas[0].precio).toBe(19990);
  });

  it('agrega el costo de despacho solo cuando corresponde', () => {
    const lineas = [{ subtotal: 10000 }];
    expect(calcularTotales(lineas, 'retiro').total).toBe(10000);
    expect(calcularTotales(lineas, 'despacho').total).toBe(12990);
  });

  it('filtra por texto, categoría y ofertas', () => {
    expect(filtrarProductos(productos, { q: 'navaja' }).map((p) => p.id)).toEqual([2]);
    expect(filtrarProductos(productos, { categoria: '1' }).map((p) => p.id)).toEqual([1]);
    expect(filtrarProductos(productos, { soloOfertas: true }).map((p) => p.id)).toEqual([2]);
    expect(filtrarProductos(productos, { orden: 'precio-desc' })[0].id).toBe(2);
  });
});
