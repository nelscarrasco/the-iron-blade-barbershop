export function formatearPrecio(valor) {
  const numero = Number(valor) || 0;
  return '$' + numero.toLocaleString('es-CL');
}

export function formatearFecha(iso) {
  if (!iso) return '';
  const fecha = new Date(iso);
  if (isNaN(fecha)) return iso;
  return fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatearFechaHora(iso) {
  if (!iso) return '';
  const fecha = new Date(iso);
  if (isNaN(fecha)) return iso;
  return fecha.toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function precioFinal(producto) {
  return producto.precioOferta ?? producto.precio;
}

export function enOferta(producto) {
  return producto.precioOferta !== null && producto.precioOferta !== undefined && producto.precioOferta < producto.precio;
}

export function porcentajeDescuento(producto) {
  if (!enOferta(producto)) return 0;
  return Math.round((1 - producto.precioOferta / producto.precio) * 100);
}

export function esStockCritico(producto) {
  return Number(producto.stock) <= Number(producto.stockCritico);
}
