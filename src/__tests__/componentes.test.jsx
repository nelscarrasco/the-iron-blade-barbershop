import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Campo from '../components/common/Campo';
import Precio from '../components/tienda/Precio';
import ModalConfirmacion from '../components/common/ModalConfirmacion';
import GrillaProductos from '../components/tienda/GrillaProductos';
import Login from '../pages/tienda/Login';
import { AuthProvider } from '../context/AuthContext';
import { CarritoProvider } from '../context/CarritoContext';
import { ToastProvider } from '../context/ToastContext';
import * as api from '../api';

function conProveedores(ui, ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <ToastProvider><AuthProvider><CarritoProvider>{ui}</CarritoProvider></AuthProvider></ToastProvider>
    </MemoryRouter>
  );
}

const productos = [
  { id: 1, nombre: 'Corte Clásico', descripcion: 'Tijera', precio: 9000, precioOferta: null, stock: 5, imagen: 'img.jpg' },
  { id: 2, nombre: 'Fade Moderno', descripcion: 'Degradado', precio: 11000, precioOferta: 9900, stock: 0, imagen: 'img.jpg' }
];

describe('componentes React', () => {
  it('GrillaProductos renderiza una card por cada producto', () => {
    conProveedores(<GrillaProductos productos={productos} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /sin stock/i })).toBeDisabled();
  });

  it('Campo muestra el mensaje de error solo cuando existe', () => {
    const { rerender } = render(<Campo id="email" etiqueta="Correo" value="" onChange={() => {}} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    rerender(<Campo id="email" etiqueta="Correo" value="" onChange={() => {}} error="El correo es obligatorio." />);
    expect(screen.getByRole('alert')).toHaveTextContent('El correo es obligatorio.');
  });

  it('Precio muestra precio anterior y descuento cuando hay oferta', () => {
    render(<Precio producto={productos[1]} />);
    expect(screen.getByText('$11.000')).toHaveClass('precio-anterior');
    expect(screen.getByText('-10%')).toBeInTheDocument();
  });

  it('ModalConfirmacion ejecuta onClick de sus botones', async () => {
    const alConfirmar = vi.fn();
    const alCancelar = vi.fn();
    render(<ModalConfirmacion abierto titulo="Eliminar" mensaje="¿Seguro?" alConfirmar={alConfirmar} alCancelar={alCancelar} />);
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(alConfirmar).toHaveBeenCalledTimes(1);
    expect(alCancelar).toHaveBeenCalledTimes(1);
  });

  it('Login actualiza su estado al escribir y muestra error con credenciales incorrectas (API simulada con mock)', async () => {
    vi.spyOn(api.usuariosApi, 'buscarPorEmail').mockResolvedValue({ id: 2, email: 'usuario@ironblade.cl', password: 'user123', rol: 'usuario' });
    conProveedores(<Login />, '/login');
    const email = screen.getByLabelText(/correo/i);
    await userEvent.type(email, 'usuario@ironblade.cl');
    expect(email).toHaveValue('usuario@ironblade.cl');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'incorrecta');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
    expect(api.usuariosApi.buscarPorEmail).toHaveBeenCalledWith('usuario@ironblade.cl');
  });
});
