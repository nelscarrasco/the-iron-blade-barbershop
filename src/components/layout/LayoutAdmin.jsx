import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ENLACES = [
  { a: '/admin', icono: 'bi-speedometer2', texto: 'Dashboard', exacto: true },
  { a: '/admin/ordenes', icono: 'bi-receipt', texto: 'Órdenes' },
  { a: '/admin/productos', icono: 'bi-box-seam', texto: 'Productos' },
  { a: '/admin/categorias', icono: 'bi-tags', texto: 'Categorías' },
  { a: '/admin/usuarios', icono: 'bi-people', texto: 'Usuarios' },
  { a: '/admin/reportes', icono: 'bi-graph-up', texto: 'Reportes' }
];

export default function LayoutAdmin() {
  const { usuario, cerrarSesion } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const navegar = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setAbierto(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const salir = () => {
    cerrarSesion();
    navegar('/');
  };

  return (
    <div className="admin-app">
      <header className="admin-topbar d-flex align-items-center justify-content-between px-3">
        <Link to="/admin" className="navbar-brand">IRON<span>BLADE</span> <small className="text-secondary ms-1">Admin</small></Link>
        <button className="btn btn-sm btn-outline-light d-lg-none" type="button" aria-expanded={abierto} aria-controls="menuAdmin" onClick={() => setAbierto((v) => !v)}>
          <i className="bi bi-list"></i> Menú
        </button>
      </header>
      <div className="d-lg-flex">
        <aside id="menuAdmin" className={`admin-sidebar ${abierto ? 'abierto' : ''}`} aria-label="Menú del administrador">
          <nav className="nav flex-column">
            {ENLACES.map((e) => (
              <NavLink key={e.a} to={e.a} end={e.exacto} className="nav-link">
                <i className={`bi ${e.icono} me-2`}></i>{e.texto}
              </NavLink>
            ))}
            <hr className="hr-oscuro" />
            <NavLink to="/admin/perfil" className="nav-link"><i className="bi bi-person-circle me-2"></i>Perfil</NavLink>
          </nav>
          <div className="mt-4 d-grid gap-2">
            <Link to="/" className="btn btn-dark border-secondary btn-sm"><i className="bi bi-shop me-1"></i>Ir a la tienda</Link>
            <button className="btn btn-danger btn-sm" onClick={salir}><i className="bi bi-box-arrow-right me-1"></i>Cerrar sesión</button>
          </div>
          <p className="small text-secondary mt-3 mb-0">Sesión: {usuario?.email}</p>
        </aside>
        <main className="admin-contenido flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
