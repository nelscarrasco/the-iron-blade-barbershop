// PRUEBAS DE RENDERIZADO (Anexo 1)
// - Renderizado correcto: los componentes de lista muestran todos los elementos.
// - Renderizado condicional: se muestran u ocultan elementos según una condición.
import { render, screen } from '@testing-library/react';
import GrillaProductos from '../components/tienda/GrillaProductos';
import TablaItems from '../components/tienda/TablaItems';
import Campo from '../components/common/Campo';
import ModalConfirmacion from '../components/common/ModalConfirmacion';
import { MensajeError } from '../components/common/Estados';
import BarrasHorizontales from '../components/admin/BarrasHorizontales';
import { renderConProveedores, productosDePrueba, limpiarAlmacenamiento } from './utilidades';

describe('Renderizado de componentes', () => {
  beforeEach(limpiarAlmacenamiento);

  describe('Renderizado correcto de listas', () => {
    it('GrillaProductos renderiza una tarjeta por cada producto recibido', () => {
      renderConProveedores(<GrillaProductos productos={productosDePrueba} />);
      expect(screen.getAllByRole('article').length).toBe(3);
      expect(screen.getByText('Corte Clásico')).toBeTruthy();
      expect(screen.getByText('Pomada Mate')).toBeTruthy();
    });

    it('TablaItems renderiza una fila por ítem y calcula el subtotal', () => {
      const items = [
        { productoId: 1, nombre: 'Corte Clásico', precio: 9000, cantidad: 2 },
        { productoId: 6, nombre: 'Pomada Mate', precio: 7990, cantidad: 1 }
      ];
      const { container } = render(<TablaItems items={items} />);
      const filas = container.querySelectorAll('tbody tr');
      expect(filas.length).toBe(2);
      expect(filas[0].textContent).toContain('$18.000');
    });

    it('BarrasHorizontales dibuja una barra por cada dato', () => {
      const datos = [{ etiqueta: 'Cortes', valor: 30 }, { etiqueta: 'Barba', valor: 15 }];
      render(<BarrasHorizontales datos={datos} />);
      expect(screen.getAllByRole('progressbar').length).toBe(2);
    });
  });

  describe('Renderizado condicional', () => {
    it('GrillaProductos muestra "Sin resultados" cuando la lista está vacía', () => {
      renderConProveedores(<GrillaProductos productos={[]} />);
      expect(screen.queryAllByRole('article').length).toBe(0);
      expect(screen.getByText('Sin resultados')).toBeTruthy();
    });

    it('Campo muestra el mensaje de error solo cuando existe un error', () => {
      const { rerender } = render(<Campo id="email" etiqueta="Correo" value="" onChange={() => {}} />);
      expect(screen.queryByRole('alert')).toBeNull();
      expect(screen.getByLabelText('Correo').getAttribute('aria-invalid')).toBe('false');

      rerender(<Campo id="email" etiqueta="Correo" value="" onChange={() => {}} error="El correo es obligatorio." />);
      expect(screen.getByRole('alert').textContent).toBe('El correo es obligatorio.');
      expect(screen.getByLabelText('Correo').classList).toContain('is-invalid');
    });

    it('MensajeError no muestra nada si no hay mensaje', () => {
      const { container, rerender } = render(<MensajeError mensaje="" />);
      expect(container.innerHTML).toBe('');
      rerender(<MensajeError mensaje="No se pudo conectar con la API." />);
      expect(screen.getByRole('alert').textContent).toContain('No se pudo conectar con la API.');
    });

    it('ModalConfirmacion no se dibuja si no está abierto', () => {
      const { rerender } = render(<ModalConfirmacion abierto={false} titulo="Eliminar producto" mensaje="¿Seguro?" />);
      expect(screen.queryByRole('dialog')).toBeNull();
      rerender(<ModalConfirmacion abierto titulo="Eliminar producto" mensaje="¿Seguro?" />);
      expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('TablaItems oculta la columna de imagen cuando conImagen es false', () => {
      const items = [{ productoId: 1, nombre: 'Corte', precio: 9000, cantidad: 1, imagen: 'data:,' }];
      const { container, rerender } = render(<TablaItems items={items} />);
      expect(container.querySelectorAll('thead th').length).toBe(5);
      rerender(<TablaItems items={items} conImagen={false} />);
      expect(container.querySelectorAll('thead th').length).toBe(4);
      expect(container.querySelector('img')).toBeNull();
    });

    it('BarrasHorizontales muestra "Sin datos." cuando no hay información', () => {
      render(<BarrasHorizontales datos={[]} />);
      expect(screen.getByText('Sin datos.')).toBeTruthy();
    });
  });
});
