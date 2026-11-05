import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RutaProtegida({ rol, children }) {
  const { usuario } = useAuth();
  const ubicacion = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname, aviso: 'Debes iniciar sesión para acceder a esta sección.' }} />;
  }
  if (rol && usuario.rol !== rol) {
    return <Navigate to="/" replace state={{ aviso: 'Acceso restringido para tu tipo de cuenta.' }} />;
  }
  return children;
}
