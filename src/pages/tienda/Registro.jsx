import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Campo from '../../components/common/Campo';
import { useFormulario } from '../../hooks/useFormulario';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { REGIONES, comunasDe } from '../../data/regiones';
import {
  validarConfirmacion, validarEmail, validarNombre, validarPassword,
  validarRequerido, validarRun, validarTelefono
} from '../../utils/validaciones';

const INICIAL = {
  run: '', nombre: '', apellidos: '', email: '', telefono: '',
  password: '', confirmacion: '', region: '', comuna: '', direccion: '', departamento: ''
};

export const REGLAS_REGISTRO = {
  run: validarRun,
  nombre: (v) => validarNombre(v),
  apellidos: (v) => validarNombre(v, 'Los apellidos'),
  email: validarEmail,
  telefono: (v) => validarTelefono(v, false),
  password: validarPassword,
  confirmacion: (v, todos) => validarConfirmacion(todos.password, v),
  region: (v) => validarRequerido(v, 'Región'),
  comuna: (v) => validarRequerido(v, 'Comuna'),
  direccion: (v) => validarRequerido(v, 'Dirección', 5)
};

export default function Registro() {
  const { registrar } = useAuth();
  const mostrarToast = useToast();
  const navegar = useNavigate();
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { valores, setValores, errores, manejarCambio, manejarBlur, validarTodo } = useFormulario(INICIAL, REGLAS_REGISTRO);

  const cambiarRegion = (e) => {
    manejarCambio(e);
    setValores((v) => ({ ...v, region: e.target.value, comuna: '' }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    if (!validarTodo()) return;
    setEnviando(true);
    try {
      const { confirmacion, ...datos } = valores;
      const resultado = await registrar({ ...datos, run: datos.run.replace(/\./g, '').toUpperCase() });
      if (!resultado.ok) {
        setError(resultado.mensaje);
        return;
      }
      mostrarToast(`¡Bienvenido, ${resultado.usuario.nombre}! Tu cuenta fue creada.`);
      navegar('/productos');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const props = (campo) => ({ id: campo, value: valores[campo], onChange: manejarCambio, onBlur: manejarBlur, error: errores[campo] });

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <form className="form-iron ancho-grande" onSubmit={enviar} noValidate>
          <h1 className="h3 text-center mb-1">Crear cuenta</h1>
          <p className="text-center text-secondary mb-4">Regístrate para comprar más rápido y ver tu historial</p>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className="row">
            <div className="col-md-4"><Campo etiqueta="RUN" requerido placeholder="12345678-5" {...props('run')} /></div>
            <div className="col-md-4"><Campo etiqueta="Nombre" requerido placeholder="Juan" autoComplete="given-name" {...props('nombre')} /></div>
            <div className="col-md-4"><Campo etiqueta="Apellidos" requerido placeholder="Pérez Soto" autoComplete="family-name" {...props('apellidos')} /></div>
            <div className="col-md-6"><Campo etiqueta="Correo" requerido type="email" placeholder="nombre@correo.cl" autoComplete="email" {...props('email')} /></div>
            <div className="col-md-6"><Campo etiqueta="Teléfono" opcional type="tel" placeholder="+56912345678" {...props('telefono')} /></div>
            <div className="col-md-6"><Campo etiqueta="Contraseña" requerido type="password" autoComplete="new-password" ayuda="Mínimo 6 caracteres, letras y números." {...props('password')} /></div>
            <div className="col-md-6"><Campo etiqueta="Repetir contraseña" requerido type="password" autoComplete="new-password" {...props('confirmacion')} /></div>
            <div className="col-md-6">
              <Campo etiqueta="Región" requerido as="select" {...props('region')} onChange={cambiarRegion}>
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
            <div className="col-md-8"><Campo etiqueta="Dirección" requerido placeholder="Calle y número" autoComplete="street-address" {...props('direccion')} /></div>
            <div className="col-md-4"><Campo etiqueta="Departamento" opcional placeholder="Ej: 603" {...props('departamento')} /></div>
          </div>
          <button type="submit" className="btn btn-iron w-100" disabled={enviando}>{enviando ? 'Creando cuenta...' : 'Crear cuenta'}</button>
          <p className="text-center mt-3 mb-0">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </form>
      </div>
    </section>
  );
}
