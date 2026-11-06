// PRUEBAS DE EVENTOS (Anexo 1)
// Simulan acciones del usuario (clics, envío de formularios) y verifican
// que se ejecuten las funciones esperadas o que la interfaz reaccione.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import ModalConfirmacion from '../components/common/ModalConfirmacion';
import { MensajeError } from '../components/common/Estados';
import BotonAgregarCarrito from '../components/tienda/BotonAgregarCarrito';
import Login from '../pages/tienda/Login';
import * as api from '../api';
import { renderConProveedores, productosDePrueba, limpiarAlmacenamiento } from './utilidades';

describe('Simulación de eventos', () => {
  beforeEach(limpiarAlmacenamiento);

  it('ModalConfirmacion ejecuta alConfirmar y alCancelar al hacer clic en sus botones', async () => {
    const usuario = userEvent.setup();
    const alConfirmar = jasmine.createSpy('alConfirmar');
    const alCancelar = jasmine.createSpy('alCancelar');
    render(<ModalConfirmacion abierto titulo="Eliminar" mensaje="¿Seguro?" alConfirmar={alConfirmar} alCancelar={alCancelar} />);

    await usuario.click(screen.getByRole('button', { name: 'Eliminar' }));
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }));
    await usuario.click(screen.getByRole('button', { name: 'Cerrar' }));

    expect(alConfirmar).toHaveBeenCalledTimes(1);
    expect(alCancelar).toHaveBeenCalledTimes(2);
  });

  it('MensajeError ejecuta alReintentar al pulsar "Reintentar"', async () => {
    const usuario = userEvent.setup();
    const alReintentar = jasmine.createSpy('alReintentar');
    render(<MensajeError mensaje="Error de conexión" alReintentar={alReintentar} />);

    await usuario.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(alReintentar).toHaveBeenCalled();
  });

  it('al agregar un producto se muestra la notificación de confirmación', async () => {
    const usuario = userEvent.setup();
    renderConProveedores(<BotonAgregarCarrito producto={productosDePrueba[0]} />);

    await usuario.click(screen.getByRole('button', { name: 'Añadir' }));

    expect(screen.getByText('Corte Clásico agregado al carrito.')).toBeTruthy();
  });

  it('no permite agregar más unidades que el stock y avisa al usuario', async () => {
    const usuario = userEvent.setup();
    renderConProveedores(<BotonAgregarCarrito producto={productosDePrueba[2]} />); // stock 1

    await usuario.click(screen.getByRole('button', { name: 'Añadir' }));
    await usuario.click(screen.getByRole('button', { name: 'Añadir' }));

    expect(screen.getByText('Solo quedan 1 unidades de Pomada Mate.')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('ib_carrito'))[0].cantidad).toBe(1);
  });

  it('Login muestra un error con credenciales incorrectas (API simulada con un mock)', async () => {
    const usuario = userEvent.setup();
    spyOn(api.usuariosApi, 'buscarPorEmail').and.resolveTo({ id: 2, email: 'usuario@ironblade.cl', password: 'user123', rol: 'usuario' });
    renderConProveedores(<Login />, { ruta: '/login' });

    await usuario.type(screen.getByLabelText('Correo electrónico'), 'usuario@ironblade.cl');
    await usuario.type(screen.getByLabelText('Contraseña'), 'incorrecta');
    await usuario.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeTruthy();
    expect(api.usuariosApi.buscarPorEmail).toHaveBeenCalledWith('usuario@ironblade.cl');
    expect(sessionStorage.getItem('ib_sesion')).toBeNull();
  });

  it('Login con la cuenta de administrador redirige al panel /admin (API simulada con un mock)', async () => {
    const usuario = userEvent.setup();
    spyOn(api.usuariosApi, 'buscarPorEmail').and.resolveTo({ id: 1, nombre: 'Admin', email: 'admin@ironblade.cl', password: 'admin123', rol: 'admin' });
    renderConProveedores(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<h1>Panel de administración</h1>} />
      </Routes>,
      { ruta: '/login' }
    );

    await usuario.type(screen.getByLabelText('Correo electrónico'), 'admin@ironblade.cl');
    await usuario.type(screen.getByLabelText('Contraseña'), 'admin123');
    await usuario.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByRole('heading', { name: 'Panel de administración' })).toBeTruthy();
    const sesion = JSON.parse(sessionStorage.getItem('ib_sesion'));
    expect(sesion.rol).toBe('admin');
    expect(sesion.password).toBeUndefined(); // la contraseña no se guarda en la sesión
  });
});
