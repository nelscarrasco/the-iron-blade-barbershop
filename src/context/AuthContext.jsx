import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usuariosApi } from '../api';

const CLAVE_SESION = 'ib_sesion';
const AuthContext = createContext(null);

function leerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SESION)) || null;
  } catch {
    return null;
  }
}

function sinPassword(usuario) {
  const { password, ...resto } = usuario;
  return resto;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion);

  const guardar = useCallback((datos) => {
    if (datos) sessionStorage.setItem(CLAVE_SESION, JSON.stringify(datos));
    else sessionStorage.removeItem(CLAVE_SESION);
    setUsuario(datos);
  }, []);

  const iniciarSesion = useCallback(async (email, password) => {
    const encontrado = await usuariosApi.buscarPorEmail(email);
    if (!encontrado || encontrado.password !== password) {
      return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
    }
    const sesion = sinPassword(encontrado);
    guardar(sesion);
    return { ok: true, usuario: sesion };
  }, [guardar]);

  const registrar = useCallback(async (datos) => {
    const existente = await usuariosApi.buscarPorEmail(datos.email);
    if (existente) return { ok: false, mensaje: 'Ya existe una cuenta con ese correo.' };
    const nuevo = await usuariosApi.crear({
      ...datos,
      email: datos.email.trim().toLowerCase(),
      rol: 'usuario',
      fechaRegistro: new Date().toISOString().slice(0, 10)
    });
    const sesion = sinPassword(nuevo);
    guardar(sesion);
    return { ok: true, usuario: sesion };
  }, [guardar]);

  const actualizarSesion = useCallback((cambios) => {
    guardar({ ...leerSesion(), ...sinPassword(cambios) });
  }, [guardar]);

  const cerrarSesion = useCallback(() => guardar(null), [guardar]);

  const valor = useMemo(() => ({
    usuario,
    esAdmin: usuario?.rol === 'admin',
    iniciarSesion,
    registrar,
    cerrarSesion,
    actualizarSesion
  }), [usuario, iniciarSesion, registrar, cerrarSesion, actualizarSesion]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return contexto;
}
