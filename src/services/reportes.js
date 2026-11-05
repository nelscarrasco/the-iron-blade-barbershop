export function resumenVentas(ordenes) {
  const pagadas = ordenes.filter((o) => o.estado === 'pagada');
  const ingresos = pagadas.reduce((a, o) => a + o.total, 0);
  return {
    totalOrdenes: ordenes.length,
    pagadas: pagadas.length,
    rechazadas: ordenes.length - pagadas.length,
    ingresos,
    ticketPromedio: pagadas.length ? Math.round(ingresos / pagadas.length) : 0
  };
}

export function ventasPorProducto(ordenes) {
  const mapa = {};
  ordenes.filter((o) => o.estado === 'pagada').forEach((o) => {
    o.items.forEach((i) => {
      mapa[i.nombre] = mapa[i.nombre] || { etiqueta: i.nombre, unidades: 0, valor: 0 };
      mapa[i.nombre].unidades += i.cantidad;
      mapa[i.nombre].valor += i.subtotal;
    });
  });
  return Object.values(mapa).sort((a, b) => b.valor - a.valor);
}

export function ventasPorCategoria(ordenes, productos, categorias) {
  const mapa = {};
  ordenes.filter((o) => o.estado === 'pagada').forEach((o) => {
    o.items.forEach((i) => {
      const producto = productos.find((p) => p.id === i.productoId);
      const categoria = categorias.find((c) => c.id === producto?.categoriaId)?.nombre ?? 'Sin categoría';
      mapa[categoria] = (mapa[categoria] || 0) + i.subtotal;
    });
  });
  return Object.entries(mapa).map(([etiqueta, valor]) => ({ etiqueta, valor })).sort((a, b) => b.valor - a.valor);
}

export function ventasPorMes(ordenes) {
  const mapa = {};
  ordenes.filter((o) => o.estado === 'pagada').forEach((o) => {
    const mes = o.fecha.slice(0, 7);
    mapa[mes] = (mapa[mes] || 0) + o.total;
  });
  return Object.entries(mapa).sort(([a], [b]) => a.localeCompare(b)).map(([etiqueta, valor]) => ({ etiqueta, valor }));
}

export function inventarioPorCategoria(productos, categorias) {
  return categorias.map((c) => {
    const lista = productos.filter((p) => p.categoriaId === c.id);
    return {
      etiqueta: c.nombre,
      productos: lista.length,
      unidades: lista.reduce((a, p) => a + Number(p.stock), 0),
      valor: lista.reduce((a, p) => a + Number(p.stock) * Number(p.precio), 0)
    };
  });
}
