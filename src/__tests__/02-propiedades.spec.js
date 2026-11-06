// PRUEBAS DE PROPIEDADES (props) (Anexo 1)
// Verifican que los componentes reciben y usan correctamente sus props.
import { render, screen } from '@testing-library/react';
import ProductoCard from '../components/tienda/ProductoCard';
import Precio from '../components/tienda/Precio';
import BotonAgregarCarrito from '../components/tienda/BotonAgregarCarrito';
import ModalConfirmacion from '../components/common/ModalConfirmacion';
import Campo from '../components/common/Campo';
import EstadoOrden from '../components/common/EstadoOrden';
import TarjetaResumen from '../components/admin/TarjetaResumen';
import { renderConProveedores, productosDePrueba, limpiarAlmacenamiento } from './utilidades';

describe('Propiedades (props) de los componentes', () => {
  beforeEach(limpiarAlmacenamiento);

  it('ProductoCard muestra los datos del producto y enlaza a su detalle', () => {
    renderConProveedores(<ProductoCard producto={productosDePrueba[0]} />);
    expect(screen.getByText('Corte con tijera')).toBeTruthy();
    expect(screen.getByText('Stock disponible: 5')).toBeTruthy();
    // la imagen y el título enlazan al detalle del producto
    const enlaces = screen.getAllByRole('link', { name: 'Corte Clásico' });
    expect(enlaces.length).toBe(2);
    enlaces.forEach((enlace) => expect(enlace.getAttribute('href')).toBe('/productos/1'));
  });

  it('Precio muestra solo el precio normal cuando el producto no está en oferta', () => {
    const { container } = render(<Precio producto={productosDePrueba[0]} />);
    expect(container.textContent).toBe('$9.000');
    expect(container.querySelector('.precio-anterior')).toBeNull();
  });

  it('Precio muestra precio anterior, precio oferta y % de descuento cuando hay oferta', () => {
    render(<Precio producto={productosDePrueba[1]} />);
    expect(screen.getByText('$11.000').classList).toContain('precio-anterior');
    expect(screen.getByText('$9.900')).toBeTruthy();
    expect(screen.getByText('-10%')).toBeTruthy();
  });

  it('BotonAgregarCarrito usa la etiqueta recibida en la prop "texto"', () => {
    renderConProveedores(<BotonAgregarCarrito producto={productosDePrueba[0]} texto="Agendar" />);
    const boton = screen.getByRole('button', { name: 'Agendar' });
    expect(boton.disabled).toBeFalse();
  });

  it('BotonAgregarCarrito se deshabilita y dice "Sin stock" si el producto no tiene stock', () => {
    renderConProveedores(<BotonAgregarCarrito producto={productosDePrueba[1]} />);
    const boton = screen.getByRole('button', { name: 'Sin stock' });
    expect(boton.disabled).toBeTrue();
  });

  it('ModalConfirmacion recibe título, mensaje y etiqueta del botón por props', () => {
    render(<ModalConfirmacion abierto titulo="Eliminar categoría" mensaje="Esta acción no se puede deshacer." textoConfirmar="Sí, eliminar"
      alConfirmar={() => {}} alCancelar={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Eliminar categoría' })).toBeTruthy();
    expect(screen.getByText('Esta acción no se puede deshacer.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sí, eliminar' })).toBeTruthy();
  });

  it('ModalConfirmacion deshabilita los botones mientras la prop "procesando" es true', () => {
    render(<ModalConfirmacion abierto procesando titulo="Eliminar" mensaje="¿Seguro?" alConfirmar={() => {}} alCancelar={() => {}} />);
    expect(screen.getByRole('button', { name: 'Procesando...' }).disabled).toBeTrue();
    expect(screen.getByRole('button', { name: 'Cancelar' }).disabled).toBeTrue();
  });

  it('Campo con as="select" crea una opción por cada elemento de la prop "opciones"', () => {
    render(<Campo id="region" etiqueta="Región" as="select" value="" onChange={() => {}}
      opciones={[{ valor: '', texto: 'Selecciona' }, 'Biobío', 'Valparaíso']} />);
    const opciones = screen.getAllByRole('option');
    expect(opciones.length).toBe(3);
    expect(opciones.map((o) => o.textContent)).toEqual(['Selecciona', 'Biobío', 'Valparaíso']);
  });

  it('EstadoOrden cambia texto y color según la prop "estado"', () => {
    const { rerender } = render(<EstadoOrden estado="pagada" />);
    expect(screen.getByText('Pagada').classList).toContain('bg-success');
    rerender(<EstadoOrden estado="rechazada" />);
    expect(screen.getByText('Rechazada').classList).toContain('bg-danger');
  });

  it('TarjetaResumen muestra título, valor, detalle y aplica el color recibido', () => {
    const { container } = render(<TarjetaResumen titulo="Compras" valor={4} detalle="Ingresos: $104.210" icono="bi-cart" color="success" />);
    expect(screen.getByText('Compras')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
    expect(screen.getByText('Ingresos: $104.210')).toBeTruthy();
    expect(container.firstChild.classList).toContain('text-bg-success');
  });
});
