import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { precioFinal } from '../utils/formato';

const CLAVE_CARRITO = 'ib_carrito';
const CarritoContext = createContext(null);

export function carritoReducer(estado, accion) {
  switch (accion.tipo) {
    case 'agregar': {
      const { producto, cantidad = 1 } = accion;
      const existente = estado.find((i) => i.productoId === producto.id);
      const actual = existente ? existente.cantidad : 0;
      const nuevaCantidad = Math.min(actual + cantidad, producto.stock);
      if (nuevaCantidad <= 0) return estado;
      if (existente) {
        return estado.map((i) => (i.productoId === producto.id ? { ...i, cantidad: nuevaCantidad, stock: producto.stock } : i));
      }
      return [...estado, {
        productoId: producto.id,
        nombre: producto.nombre,
        precio: precioFinal(producto),
        precioNormal: producto.precio,
        imagen: producto.imagen,
        stock: producto.stock,
        cantidad: nuevaCantidad
      }];
    }
    case 'cambiarCantidad': {
      return estado
        .map((i) => (i.productoId === accion.productoId
          ? { ...i, cantidad: Math.max(0, Math.min(accion.cantidad, i.stock)) }
          : i))
        .filter((i) => i.cantidad > 0);
    }
    case 'eliminar':
      return estado.filter((i) => i.productoId !== accion.productoId);
    case 'vaciar':
      return [];
    default:
      return estado;
  }
}

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch {
    return [];
  }
}

export function CarritoProvider({ children }) {
  const [items, dispatch] = useReducer(carritoReducer, [], leerCarrito);

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }, [items]);

  const valor = useMemo(() => {
    const cantidadTotal = items.reduce((a, i) => a + i.cantidad, 0);
    const total = items.reduce((a, i) => a + i.precio * i.cantidad, 0);
    return {
      items,
      cantidadTotal,
      total,
      agregar: (producto, cantidad = 1) => dispatch({ tipo: 'agregar', producto, cantidad }),
      cambiarCantidad: (productoId, cantidad) => dispatch({ tipo: 'cambiarCantidad', productoId, cantidad }),
      eliminar: (productoId) => dispatch({ tipo: 'eliminar', productoId }),
      vaciar: () => dispatch({ tipo: 'vaciar' }),
      cantidadDe: (productoId) => items.find((i) => i.productoId === productoId)?.cantidad ?? 0
    };
  }, [items]);

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return contexto;
}
