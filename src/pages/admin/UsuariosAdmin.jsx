import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import ModalConfirmacion from '../../components/common/ModalConfirmacion';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usuariosApi } from '../../api';
import { formatearFecha } from '../../utils/formato';

export default function UsuariosAdmin() {
  const { usuario: sesion } = useAuth();
  const mostrarToast = useToast();
  const [texto, setTexto] = useState('');
  const [rol, setRol] = useState('');
  const [aEliminar, setAEliminar] = useState(null);
  const { datos, setDatos, cargando, error, recargar } = useApi(() => usuariosApi.listar());

  const lista = (datos ?? []).filter((u) =>
    (!rol || u.rol === rol) && `${u.run} ${u.nombre} ${u.apellidos} ${u.email}`.toLowerCase().includes(texto.trim().toLowerCase()));

  const eliminar = async () => {
    try {
      await usuariosApi.eliminar(aEliminar.id);
      setDatos((l) => l.filter((u) => u.id !== aEliminar.id));
      mostrarToast('Usuario eliminado.');
    } catch (e) {
      mostrarToast(e.message, 'error');
    }
    setAEliminar(null);
  };

  return (
    <>
      <EncabezadoAdmin titulo="Usuarios" subtitulo="Cuentas registradas en la tienda" acciones={[{ a: '/admin/usuarios/nuevo', texto: 'Nuevo usuario', icono: 'bi-person-plus' }]} />
      <MensajeError mensaje={error} alReintentar={recargar} />
      <div className="row g-2 mb-3">
        <div className="col-md-8"><input className="form-control" type="search" placeholder="Buscar por RUN, nombre o correo" aria-label="Buscar usuarios" value={texto} onChange={(e) => setTexto(e.target.value)} /></div>
        <div className="col-md-4">
          <select className="form-select" aria-label="Filtrar por rol" value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="">Todos los roles</option><option value="admin">Administradores</option><option value="usuario">Clientes</option>
          </select>
        </div>
      </div>
      {cargando ? <Cargando /> : (
        <div className="table-responsive">
          <table className="table table-dark tabla-iron align-middle">
            <thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Registro</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {lista.map((u) => (
                <tr key={u.id}>
                  <td>{u.run}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.rol === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{u.rol}</span></td>
                  <td>{formatearFecha(u.fechaRegistro)}</td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/usuarios/${u.id}`} className="btn btn-sm btn-outline-light me-1" aria-label={`Ver ${u.nombre}`}><i className="bi bi-eye"></i></Link>
                    <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-iron me-1" aria-label={`Editar ${u.nombre}`}><i className="bi bi-pencil"></i></Link>
                    <button className="btn btn-sm btn-danger" disabled={u.id === sesion.id} title={u.id === sesion.id ? 'No puedes eliminar tu propia cuenta' : ''} onClick={() => setAEliminar(u)} aria-label={`Eliminar ${u.nombre}`}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ModalConfirmacion abierto={Boolean(aEliminar)} titulo="Eliminar usuario" mensaje={`¿Eliminar la cuenta de ${aEliminar?.email}?`} alConfirmar={eliminar} alCancelar={() => setAEliminar(null)} />
    </>
  );
}
