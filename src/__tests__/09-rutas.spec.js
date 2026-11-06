// PRUEBAS DE NAVEGACIÓN (react-router)
// Verifican la protección de rutas por sesión y rol, y el botón "Volver".
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RutaProtegida from '../components/common/RutaProtegida';
import BotonVolver from '../components/common/BotonVolver';
import { AuthProvider } from '../context/AuthContext';
import { limpiarAlmacenamiento } from './utilidades';

function renderRutas(rutaInicial) {
  return render(
    <MemoryRouter initialEntries={[rutaInicial]}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<h1>Inicio de la tienda</h1>} />
          <Route path="/login" element={<h1>Iniciar sesión</h1>} />
          <Route path="/admin" element={<RutaProtegida rol="admin"><h1>Panel de administración</h1></RutaProtegida>} />
          <Route path="/mis-compras" element={<RutaProtegida><h1>Mis compras</h1></RutaProtegida>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

function iniciarSesionComo(rol) {
  sessionStorage.setItem('ib_sesion', JSON.stringify({ id: 1, nombre: 'Prueba', email: 'prueba@ironblade.cl', rol }));
}

describe('Rutas protegidas y navegación', () => {
  beforeEach(limpiarAlmacenamiento);

  it('sin sesión, entrar a /admin redirige al login', () => {
    renderRutas('/admin');
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy();
    expect(screen.queryByText('Panel de administración')).toBeNull();
  });

  it('un cliente que entra a /admin es enviado al inicio de la tienda', () => {
    iniciarSesionComo('usuario');
    renderRutas('/admin');
    expect(screen.getByRole('heading', { name: 'Inicio de la tienda' })).toBeTruthy();
  });

  it('el administrador sí puede ver el panel', () => {
    iniciarSesionComo('admin');
    renderRutas('/admin');
    expect(screen.getByRole('heading', { name: 'Panel de administración' })).toBeTruthy();
  });

  it('una ruta sin rol exigido solo pide haber iniciado sesión', () => {
    iniciarSesionComo('usuario');
    renderRutas('/mis-compras');
    expect(screen.getByRole('heading', { name: 'Mis compras' })).toBeTruthy();
  });

  it('BotonVolver regresa a la página anterior del historial', async () => {
    const usuario = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/productos', '/productos/1']} initialIndex={1}>
        <Routes>
          <Route path="/productos" element={<h1>Listado de productos</h1>} />
          <Route path="/productos/:id" element={<BotonVolver texto="Volver al catálogo" />} />
        </Routes>
      </MemoryRouter>
    );
    await usuario.click(screen.getByRole('button', { name: 'Volver al catálogo' }));
    expect(screen.getByRole('heading', { name: 'Listado de productos' })).toBeTruthy();
  });
});
