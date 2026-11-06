// PRUEBAS DE LÓGICA: formatos de precio y reportes del panel de administración
import { formatearPrecio, porcentajeDescuento, enOferta, esStockCritico, precioFinal } from '../utils/formato';
import { resumenVentas, ventasPorProducto } from '../services/reportes';

describe('Formato de precios y ofertas', () => {
  it('formatea precios en pesos chilenos', () => {
    expect(formatearPrecio(18000)).toBe('$18.000');
    expect(formatearPrecio('abc')).toBe('$0');
  });

  it('calcula oferta, precio final y porcentaje de descuento', () => {
    const conOferta = { precio: 11000, precioOferta: 9900 };
    const sinOferta = { precio: 9000, precioOferta: null };
    expect(enOferta(conOferta)).toBeTrue();
    expect(enOferta(sinOferta)).toBeFalse();
    expect(precioFinal(conOferta)).toBe(9900);
    expect(porcentajeDescuento(conOferta)).toBe(10);
    expect(porcentajeDescuento(sinOferta)).toBe(0);
  });

  it('detecta productos con stock crítico', () => {
    expect(esStockCritico({ stock: 2, stockCritico: 3 })).toBeTrue();
    expect(esStockCritico({ stock: 10, stockCritico: 3 })).toBeFalse();
  });
});

describe('Reportes de ventas', () => {
  const ordenes = [
    { estado: 'pagada', total: 20000, items: [{ nombre: 'Corte', cantidad: 2, subtotal: 18000 }] },
    { estado: 'pagada', total: 10000, items: [{ nombre: 'Pomada', cantidad: 1, subtotal: 7990 }] },
    { estado: 'rechazada', total: 5000, items: [{ nombre: 'Corte', cantidad: 1, subtotal: 9000 }] }
  ];

  it('resume ingresos solo con órdenes pagadas', () => {
    expect(resumenVentas(ordenes)).toEqual({ totalOrdenes: 3, pagadas: 2, rechazadas: 1, ingresos: 30000, ticketPromedio: 15000 });
  });

  it('ordena las ventas por producto de mayor a menor', () => {
    const ranking = ventasPorProducto(ordenes);
    expect(ranking.map((r) => r.etiqueta)).toEqual(['Corte', 'Pomada']);
    expect(ranking[0].unidades).toBe(2); // la orden rechazada no cuenta
  });
});
