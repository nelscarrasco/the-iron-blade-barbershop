import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Campo from '../../components/common/Campo';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useFormulario } from '../../hooks/useFormulario';
import { useToast } from '../../context/ToastContext';
import { categoriasApi, productosApi } from '../../api';
import { validarNumero, validarRequerido } from '../../utils/validaciones';

const VACIO = { codigo: '', nombre: '', categoriaId: '', precio: '', precioOferta: '', stock: '', stockCritico: '', descripcion: '', imagen: '' };

export const REGLAS_PRODUCTO = {
  codigo: (v) => validarRequerido(v, 'Código', 3),
  nombre: (v) => validarRequerido(v, 'Nombre', 3),
  categoriaId: (v) => validarRequerido(v, 'Categoría'),
  precio: (v) => validarNumero(v, 'Precio', { permitirCero: false, entero: true }),
  precioOferta: (v, todos) => {
    if (v === '' || v === null) return '';
    const error = validarNumero(v, 'Precio oferta', { permitirCero: false, entero: true });
    if (error) return error;
    return Number(v) >= Number(todos.precio) ? 'El precio oferta debe ser menor al precio normal.' : '';
  },
  stock: (v) => validarNumero(v, 'Stock', { entero: true }),
  stockCritico: (v) => validarNumero(v, 'Stock crítico', { entero: true }),
  descripcion: (v) => validarRequerido(v, 'Descripción', 10),
  imagen: (v) => (v && !/^https?:\/\/.+/.test(v) ? 'La imagen debe ser una URL que comience con http:// o https://' : '')
};

export default function ProductoForm() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();
  const mostrarToast = useToast();
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const { valores, errores, manejarCambio, manejarBlur, validarTodo, reiniciar } = useFormulario(VACIO, REGLAS_PRODUCTO);

  useEffect(() => {
    (async () => {
      try {
        setCategorias(await categoriasApi.listar());
        if (esEdicion) {
          const p = await productosApi.obtener(id);
          reiniciar({ ...p, precioOferta: p.precioOferta ?? '', imagen: p.imagen ?? '' });
        } else {
          const productos = await productosApi.listar();
          const siguiente = productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
          reiniciar({ ...VACIO, codigo: 'IB' + String(siguiente).padStart(3, '0') });
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const guardar = async (e) => {
    e.preventDefault();
    if (!validarTodo()) return;
    setGuardando(true);
    const datos = {
      codigo: valores.codigo.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      categoriaId: Number(valores.categoriaId),
      precio: Number(valores.precio),
      precioOferta: valores.precioOferta === '' ? null : Number(valores.precioOferta),
      stock: Number(valores.stock),
      stockCritico: Number(valores.stockCritico),
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim() || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80'
    };
    try {
      const guardado = esEdicion ? await productosApi.actualizar(id, datos) : await productosApi.crear(datos);
      mostrarToast(esEdicion ? 'Producto actualizado.' : 'Producto creado.');
      navegar(`/admin/productos/${guardado.id}`);
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando />;
  const props = (campo) => ({ id: campo, value: valores[campo], onChange: manejarCambio, onBlur: manejarBlur, error: errores[campo] });

  return (
    <>
      <EncabezadoAdmin titulo={esEdicion ? 'Editar producto' : 'Nuevo producto'} acciones={[{ a: '/admin/productos', texto: 'Volver al listado', icono: 'bi-arrow-left', clase: 'btn btn-outline-light btn-sm' }]} />
      <MensajeError mensaje={error} />
      <form className="form-iron ancho-grande m-0" onSubmit={guardar} noValidate>
        <div className="row">
          <div className="col-md-3"><Campo etiqueta="Código" requerido {...props('codigo')} /></div>
          <div className="col-md-5"><Campo etiqueta="Nombre" requerido {...props('nombre')} /></div>
          <div className="col-md-4">
            <Campo etiqueta="Categoría" requerido as="select" {...props('categoriaId')}>
              <option value="">Selecciona</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </Campo>
          </div>
          <div className="col-6 col-md-3"><Campo etiqueta="Precio" requerido type="number" min="1" {...props('precio')} /></div>
          <div className="col-6 col-md-3"><Campo etiqueta="Precio oferta" opcional type="number" min="1" ayuda="Vacío = sin oferta" {...props('precioOferta')} /></div>
          <div className="col-6 col-md-3"><Campo etiqueta="Stock" requerido type="number" min="0" {...props('stock')} /></div>
          <div className="col-6 col-md-3"><Campo etiqueta="Stock crítico" requerido type="number" min="0" ayuda="Alerta bajo este valor" {...props('stockCritico')} /></div>
          <div className="col-12"><Campo etiqueta="Descripción" requerido as="textarea" {...props('descripcion')} /></div>
          <div className="col-md-9"><Campo etiqueta="URL de imagen" opcional type="url" placeholder="https://..." {...props('imagen')} /></div>
          <div className="col-md-3 text-center">{valores.imagen && !errores.imagen && <img src={valores.imagen} alt="Vista previa" className="img-fluid rounded preview-imagen" />}</div>
        </div>
        <button type="submit" className="btn btn-iron" disabled={guardando}>{guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}</button>
      </form>
    </>
  );
}
