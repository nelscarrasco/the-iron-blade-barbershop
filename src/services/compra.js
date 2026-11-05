import { ordenesApi, productosApi, siguienteCodigoOrden } from '../api';
import { COSTO_DESPACHO } from '../data/regiones';
import { precioFinal } from '../utils/formato';

export function verificarStock(items, productosActuales) {
  const problemas = [];
  const lineas = items.map((item) => {
    const producto = productosActuales.find((p) => p.id === item.productoId);
    if (!producto) {
      problemas.push(`${item.nombre} ya no está disponible.`);
      return null;
    }
    if (producto.stock < item.cantidad) {
      problemas.push(`${producto.nombre}: solicitaste ${item.cantidad} y quedan ${producto.stock}.`);
    }
    const precio = precioFinal(producto);
    return { productoId: producto.id, nombre: producto.nombre, imagen: producto.imagen, precio, cantidad: item.cantidad, subtotal: precio * item.cantidad };
  }).filter(Boolean);
  return { lineas, problemas };
}

export function calcularTotales(lineas, tipoEntrega) {
  const subtotal = lineas.reduce((a, l) => a + l.subtotal, 0);
  const costoEnvio = tipoEntrega === 'despacho' ? COSTO_DESPACHO : 0;
  return { subtotal, costoEnvio, total: subtotal + costoEnvio };
}

export async function procesarCompra({ items, datos, usuarioId, simularRechazo }) {
  const productosActuales = await productosApi.listar();
  const { lineas, problemas } = verificarStock(items, productosActuales);
  const totales = calcularTotales(lineas, datos.tipoEntrega);

  let estado = 'pagada';
  let motivo = '';
  if (problemas.length) {
    estado = 'rechazada';
    motivo = 'Stock insuficiente: ' + problemas.join(' ');
  } else if (simularRechazo) {
    estado = 'rechazada';
    motivo = 'El medio de pago rechazó la transacción (simulación).';
  }

  const orden = await ordenesApi.crear({
    codigo: siguienteCodigoOrden(),
    usuarioId: usuarioId ?? null,
    fecha: new Date().toISOString(),
    estado,
    motivo,
    medioPago: datos.medioPago,
    cliente: { nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), email: datos.email.trim().toLowerCase(), telefono: datos.telefono?.trim() ?? '' },
    entrega: {
      tipo: datos.tipoEntrega,
      calle: datos.tipoEntrega === 'despacho' ? datos.calle.trim() : '',
      departamento: datos.tipoEntrega === 'despacho' ? datos.departamento.trim() : '',
      region: datos.tipoEntrega === 'despacho' ? datos.region : '',
      comuna: datos.tipoEntrega === 'despacho' ? datos.comuna : '',
      indicaciones: datos.indicaciones?.trim() ?? ''
    },
    items: lineas.map(({ imagen, ...resto }) => resto),
    ...totales
  });

  if (estado === 'pagada') {
    await Promise.all(lineas.map((l) => {
      const producto = productosActuales.find((p) => p.id === l.productoId);
      return productosApi.modificar(l.productoId, { stock: producto.stock - l.cantidad });
    }));
  }

  return orden;
}
