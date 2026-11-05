import { useEffect, useState } from 'react';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { FormularioUsuario, prepararUsuario, reglasUsuario } from './UsuarioForm';
import { useFormulario } from '../../hooks/useFormulario';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usuariosApi } from '../../api';

export default function Perfil() {
  const { usuario, actualizarSesion } = useAuth();
  const mostrarToast = useToast();
  const [original, setOriginal] = useState(null);
  const [error, setError] = useState('');
  const formulario = useFormulario({}, reglasUsuario(true));

  useEffect(() => {
    usuariosApi.obtener(usuario.id)
      .then((u) => { setOriginal(u); formulario.reiniciar({ ...u, password: '' }); })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.id]);

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    if (!formulario.validarTodo()) return;
    try {
      const duplicado = await usuariosApi.buscarPorEmail(formulario.valores.email);
      if (duplicado && duplicado.id !== usuario.id) {
        setError('Ese correo ya está en uso por otra cuenta.');
        return;
      }
      const guardado = await usuariosApi.actualizar(usuario.id, prepararUsuario({ ...formulario.valores, rol: original.rol }, original));
      setOriginal(guardado);
      actualizarSesion(guardado);
      formulario.reiniciar({ ...guardado, password: '' });
      mostrarToast('Perfil actualizado.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!original && !error) return <Cargando />;

  return (
    <>
      <EncabezadoAdmin titulo="Perfil" subtitulo="Administra tu información personal y de cuenta" />
      <MensajeError mensaje={error} />
      {original && (
        <form className="form-iron ancho-grande m-0" onSubmit={guardar} noValidate>
          <FormularioUsuario {...formulario} esEdicion mostrarRol={false} />
          <button type="submit" className="btn btn-iron">Guardar perfil</button>
        </form>
      )}
    </>
  );
}
