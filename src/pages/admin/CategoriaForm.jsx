import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Campo from '../../components/common/Campo';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useFormulario } from '../../hooks/useFormulario';
import { useToast } from '../../context/ToastContext';
import { categoriasApi } from '../../api';
import { validarRequerido } from '../../utils/validaciones';

const VACIO = { nombre: '', tipo: 'Producto', descripcion: '', imagen: '' };
const REGLAS = {
  nombre: (v) => validarRequerido(v, 'Nombre', 3),
  tipo: (v) => validarRequerido(v, 'Tipo'),
  descripcion: (v) => validarRequerido(v, 'Descripción', 10),
  imagen: (v) => (v && !/^https?:\/\/.+/.test(v) ? 'La imagen debe ser una URL http(s).' : '')
};

export default function CategoriaForm() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();
  const mostrarToast = useToast();
  const [cargando, setCargando] = useState(esEdicion);
  const [error, setError] = useState('');
  const { valores, errores, manejarCambio, manejarBlur, validarTodo, reiniciar } = useFormulario(VACIO, REGLAS);

  useEffect(() => {
    if (!esEdicion) return;
    categoriasApi.obtener(id)
      .then((c) => reiniciar({ ...VACIO, ...c }))
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const guardar = async (e) => {
    e.preventDefault();
    if (!validarTodo()) return;
    const datos = { nombre: valores.nombre.trim(), tipo: valores.tipo, descripcion: valores.descripcion.trim(), imagen: valores.imagen.trim() };
    try {
      if (esEdicion) await categoriasApi.actualizar(id, datos);
      else await categoriasApi.crear(datos);
      mostrarToast(esEdicion ? 'Categoría actualizada.' : 'Categoría creada.');
      navegar('/admin/categorias');
    } catch (err) {
      setError(err.message);
    }
  };

  if (cargando) return <Cargando />;
  const props = (campo) => ({ id: campo, value: valores[campo], onChange: manejarCambio, onBlur: manejarBlur, error: errores[campo] });

  return (
    <>
      <EncabezadoAdmin titulo={esEdicion ? 'Editar categoría' : 'Nueva categoría'} acciones={[{ a: '/admin/categorias', texto: 'Volver', icono: 'bi-arrow-left', clase: 'btn btn-outline-light btn-sm' }]} />
      <MensajeError mensaje={error} />
      <form className="form-iron ancho m-0" onSubmit={guardar} noValidate>
        <Campo etiqueta="Nombre" requerido {...props('nombre')} />
        <Campo etiqueta="Tipo" requerido as="select" opciones={['Producto', 'Servicio']} {...props('tipo')} />
        <Campo etiqueta="Descripción" requerido as="textarea" {...props('descripcion')} />
        <Campo etiqueta="URL de imagen" opcional type="url" {...props('imagen')} />
        <button type="submit" className="btn btn-iron">{esEdicion ? 'Guardar cambios' : 'Crear categoría'}</button>
      </form>
    </>
  );
}
