// PRUEBAS DE ESTADO (state) (Anexo 1)
// Verifican que el estado de los componentes cambia correctamente.
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/tienda/Login';
import BotonAgregarCarrito from '../components/tienda/BotonAgregarCarrito';
import { useCarrito } from '../context/CarritoContext';
import * as api from '../api';
import { renderConProveedores, productosDePrueba, limpiarAlmacenamiento } from './utilidades';

// Componente auxiliar que muestra el estado del carrito en pantalla
function ContadorCarrito() {
  const { cantidadTotal, total } = useCarrito();
  return <p data-testid="contador">{cantidadTotal} productos - total {total}</p>;
}

describe('Gestión del estado', () => {
  beforeEach(limpiarAlmacenamiento);

  it('el formulario de Login actualiza su estado cuando el usuario escribe', async () => {
    const usuario = userEvent.setup();
    renderConProveedores(<Login />, { ruta: '/login' });
    const correo = screen.getByLabelText('Correo electrónico');
    const clave = screen.getByLabelText('Contraseña');

    await usuario.type(correo, 'usuario@ironblade.cl');
    await usuario.type(clave, 'user123');

    expect(correo.value).toBe('usuario@ironblade.cl');
    expect(clave.value).toBe('user123');
  });

  it('el error de un campo aparece al salir de él y desaparece al corregirlo', async () => {
    const usuario = userEvent.setup();
    renderConProveedores(<Login />, { ruta: '/login' });
    const correo = screen.getByLabelText('Correo electrónico');

    await usuario.type(correo, 'correo-malo');
    await usuario.tab(); // blur: el campo queda "tocado" y se valida
    expect(screen.getByText(/Formato de correo inválido/)).toBeTruthy();
    expect(correo.getAttribute('aria-invalid')).toBe('true');

    await usuario.clear(correo);
    await usuario.type(correo, 'nombre@correo.cl');
    expect(screen.queryByText(/Formato de correo inválido/)).toBeNull();
    expect(correo.getAttribute('aria-invalid')).toBe('false');
  });

  it('enviar el formulario vacío marca los errores y no consulta la API', async () => {
    const usuario = userEvent.setup();
    const espia = spyOn(api.usuariosApi, 'buscarPorEmail');
    renderConProveedores(<Login />, { ruta: '/login' });

    await usuario.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(screen.getAllByRole('alert').length).toBe(2);
    expect(screen.getByText(/El correo es obligatorio/)).toBeTruthy();
    expect(screen.getByText('El campo Contraseña es obligatorio.')).toBeTruthy();
    expect(espia).not.toHaveBeenCalled();
  });

  it('el estado del carrito suma unidades y recalcula el total al agregar productos', async () => {
    const usuario = userEvent.setup();
    renderConProveedores(<><BotonAgregarCarrito producto={productosDePrueba[0]} /><ContadorCarrito /></>);
    expect(screen.getByTestId('contador').textContent).toBe('0 productos - total 0');

    await usuario.click(screen.getByRole('button', { name: 'Añadir' }));
    await usuario.click(screen.getByRole('button', { name: 'Añadir' }));

    expect(screen.getByTestId('contador').textContent).toBe('2 productos - total 18000');
  });

  it('el estado del carrito se guarda en localStorage para no perderse al recargar', async () => {
    const usuario = userEvent.setup();
    renderConProveedores(<BotonAgregarCarrito producto={productosDePrueba[0]} />);
    await usuario.click(screen.getByRole('button', { name: 'Añadir' }));

    const guardado = JSON.parse(localStorage.getItem('ib_carrito'));
    expect(guardado.length).toBe(1);
    expect(guardado[0]).toEqual(jasmine.objectContaining({ productoId: 1, cantidad: 1, precio: 9000 }));
  });
});
