import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Campo from '../../components/common/Campo';
import { useFormulario } from '../../hooks/useFormulario';
import { useAuth } from '../../context/AuthContext';
import { validarEmail, validarRequerido } from '../../utils/validaciones';

const REGLAS = {
  email: validarEmail,
  password: (v) => validarRequerido(v, 'Contraseña')
};

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { valores, errores, manejarCambio, manejarBlur, validarTodo } = useFormulario({ email: '', password: '' }, REGLAS);

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    if (!validarTodo()) return;
    setEnviando(true);
    try {
      const resultado = await iniciarSesion(valores.email, valores.password);
      if (!resultado.ok) {
        setError(resultado.mensaje);
        return;
      }
      const destino = resultado.usuario.rol === 'admin' ? '/admin' : (state?.desde || '/');
      navegar(destino, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="seccion seccion-oscura pagina-media">
      <div className="container">
        <form className="form-iron" onSubmit={enviar} noValidate>
          <h1 className="h3 text-center mb-1">Iniciar sesión</h1>
          <p className="text-center text-secondary mb-4">Ingresa con tu cuenta de cliente o administrador</p>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <Campo id="email" etiqueta="Correo electrónico" type="email" placeholder="nombre@correo.cl" autoComplete="email"
            value={valores.email} onChange={manejarCambio} onBlur={manejarBlur} error={errores.email} />
          <Campo id="password" etiqueta="Contraseña" type="password" placeholder="Tu contraseña" autoComplete="current-password"
            value={valores.password} onChange={manejarCambio} onBlur={manejarBlur} error={errores.password} />
          <button type="submit" className="btn btn-iron w-100" disabled={enviando}>{enviando ? 'Ingresando...' : 'Ingresar'}</button>
          <p className="text-center mt-3 mb-1">¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
          <hr className="hr-oscuro" />
          <p className="small text-secondary mb-0">
            Cuentas de prueba: <strong>admin@ironblade.cl</strong> / admin123 · <strong>usuario@ironblade.cl</strong> / user123
          </p>
        </form>
      </div>
    </section>
  );
}
