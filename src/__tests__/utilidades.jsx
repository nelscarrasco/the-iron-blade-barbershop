// Utilidades compartidas por las pruebas (no es un archivo de pruebas).
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CarritoProvider } from '../context/CarritoContext';
import { ToastProvider } from '../context/ToastContext';

// Renderiza un componente dentro de los mismos proveedores que usa la app:
// router, notificaciones, sesión y carrito.
export function renderConProveedores(ui, { ruta = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <ToastProvider>
        <AuthProvider>
          <CarritoProvider>{ui}</CarritoProvider>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
}

// Datos de prueba
export const productosDePrueba = [
  { id: 1, nombre: 'Corte Clásico', descripcion: 'Corte con tijera', precio: 9000, precioOferta: null, stock: 5, stockCritico: 2, imagen: 'data:,' },
  { id: 2, nombre: 'Fade Moderno', descripcion: 'Degradado', precio: 11000, precioOferta: 9900, stock: 0, stockCritico: 2, imagen: 'data:,' },
  { id: 3, nombre: 'Pomada Mate', descripcion: 'Fijación fuerte', precio: 7990, precioOferta: null, stock: 1, stockCritico: 3, imagen: 'data:,' }
];

// Limpia el almacenamiento del navegador para que cada prueba parta igual.
export function limpiarAlmacenamiento() {
  localStorage.clear();
  sessionStorage.clear();
}
