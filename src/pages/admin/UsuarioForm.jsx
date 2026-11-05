import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Campo from '../../components/common/Campo';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useFormulario } from '../../hooks/useFormulario';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usuariosApi } from '../../api';
import { REGIONES, comunasDe } from '../../data/regiones';
import { validarEmail, validarNombre, validarPassword, validarRequerido, validarRun, validarTelefono } from '../../utils/validaciones';

const VACIO = { run: '', nombre: '', apellidos: '', email: '', telefono: '', password: '', rol: 'usuario', region: '', comuna: '', direccion: '', departamento: '' };

export function reglasUsuario(esEdicion) {
  return {
    run: validarRun,
    nombre: (v) => validarNombre(v),
    apellidos: (v) => validarNombre(v, 'Los apellidos'),
    email: validarEmail,
    telefono: (v) => validarTelefono(v, false),
    password: (v) => (esEdicion && !v ? '' : validarPassword(v)),
    rol: (v) => validarRequerido(v, 'Rol'),
    region: (v) => validarRequerido(v, 'Región'),
    comuna: (v) => validarRequerido(v, 'Comuna'),
    direccion: (v) => validarRequerido(v, 'Dirección', 5)
  };
}

export function FormularioUsuario({ valores, errores, manejarCambio, manejarBlur, setValores, esEdicion, mostrarRol = true }) {
  const props = (campo) => ({ id: campo, value: valores[campo] ?? '', onChange: manejarCambio, onBlur: manejarBlur, error: errores[campo] });
  return (
    <div className="row">
      <div className="col-md-4"><Campo etiqueta="RUN" requerido placeholder="12345678-5" {...props('run')} /></div>
      <div className="col-md-4"><Campo etiqueta="Nombre" requerido {...props('nombre')} /></div>
      <div className="col-md-4"><Campo etiqueta="Apellidos" requerido {...props('apellidos')} /></div>
      <div className="col-md-6"><Campo etiqueta="Correo" requerido type="email" {...props('email')} /></div>
      <div className="col-md-6"><Campo etiqueta="Teléfono" opcional type="tel" {...props('telefono')} /></div>
      <div className="col-md-6"><Campo etiqueta="Contraseña" requerido={!esEdicion} type="password" autoComplete="new-password" ayuda={esEdicion ? 'Déjala vacía para mantener la actual.' : 'Mínimo 6 caracteres, letras y números.'} {...props('password')} /></div>
      {mostrarRol && (
        <div className="col-md-6">
          <Campo etiqueta="Rol" requerido as="select" opciones={[{ valor: 'usuario', texto: 'Cliente' }, { valor: 'admin', texto: 'Administrador' }]} {...props('rol')} />
        </div>
      )}
      <div className="col-md-6">
        <Campo etiqueta="Región" requerido as="select" {...props('region')} onChange={(e) => setValores((v) => ({ ...v, region: e.target.value, comuna: '' }))}>
          <option value="">Selecciona una región</option>
          {REGIONES.map((r) => <option key={r.nombre}>{r.nombre}</option>)}
        </Campo>
      </div>
      <div className="col-md-6">
        <Campo etiqueta="Comuna" requerido as="select" disabled={!valores.region} {...props('comuna')}>
          <option value="">Selecciona una comuna</option>
          {comunasDe(valores.region).map((c) => <option key={c}>{c}</option>)}
        </Campo>
      </div>
      <div className="col-md-8"><Campo etiqueta="Dirección" requerido {...props('direccion')} /></div>
      <div className="col-md-4"><Campo etiqueta="Departamento" opcional {...props('departamento')} /></div>
    </div>
  );
}

export function prepararUsuario(valores, original = {}) {
  const datos = {
    ...original,
    run: valores.run.trim().replace(/\./g, '').toUpperCase(),
    nombre: valores.nombre.trim(),
    apellidos: valores.apellidos.trim(),
    email: valores.email.trim().toLowerCase(),
    telefono: valores.telefono?.trim() ?? '',
    rol: valores.rol,
    region: valores.region,
    comuna: valores.comuna,
    direccion: valores.direccion.trim(),
    departamento: valores.departamento?.trim() ?? ''
  };
  if (valores.password) datos.password = valores.password;
  if (!datos.fechaRegistro) datos.fechaRegistro = new Date().toISOString().slice(0, 10);
  delete datos.id;
  return datos;
}

export default function UsuarioForm() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();
  const mostrarToast = useToast();
  const { usuario: sesion, actualizarSesion } = useAuth();
  const [original, setOriginal] = useState(null);
  const [cargando, setCargando] = useState(esEdicion);
  const [error, setError] = useState('');
  const formulario = useFormulario(VACIO, reglasUsuario(esEdicion));

  useEffect(() => {
    if (!esEdicion) return;
    usuariosApi.obtener(id)
      .then((u) => { setOriginal(u); formulario.reiniciar({ ...VACIO, ...u, password: '' }); })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    if (!formulario.validarTodo()) return;
    try {
      const duplicado = await usuariosApi.buscarPorEmail(formulario.valores.email);
      if (duplicado && String(duplicado.id) !== String(id)) {
        setError('Ya existe otro usuario con ese correo.');
        return;
      }
      const datos = prepararUsuario(formulario.valores, original ?? {});
      const guardado = esEdicion ? await usuariosApi.actualizar(id, datos) : await usuariosApi.crear(datos);
      if (guardado.id === sesion.id) actualizarSesion(guardado);
      mostrarToast(esEdicion ? 'Usuario actualizado.' : 'Usuario creado.');
      navegar(`/admin/usuarios/${guardado.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (cargando) return <Cargando />;

  return (
    <>
      <EncabezadoAdmin titulo={esEdicion ? 'Editar usuario' : 'Nuevo usuario'} acciones={[{ a: '/admin/usuarios', texto: 'Volver', icono: 'bi-arrow-left', clase: 'btn btn-outline-light btn-sm' }]} />
      <MensajeError mensaje={error} />
      <form className="form-iron ancho-grande m-0" onSubmit={guardar} noValidate>
        <FormularioUsuario {...formulario} esEdicion={esEdicion} />
        <button type="submit" className="btn btn-iron">{esEdicion ? 'Guardar cambios' : 'Crear usuario'}</button>
      </form>
    </>
  );
}
