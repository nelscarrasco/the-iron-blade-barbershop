import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCarrito } from '../../context/CarritoContext';
import { categoriasApi } from '../../api';
import { formatearPrecio } from '../../utils/formato';

function useClickFuera(ref, alClickFuera) {
  useEffect(() => {
    const manejar = (e) => {
      if (ref.current && !ref.current.contains(e.target)) alClickFuera();
    };
    document.addEventListener('mousedown', manejar);
    return () => document.removeEventListener('mousedown', manejar);
  }, [ref, alClickFuera]);
}

function BotonCarrito({ cantidad, total }) {
  return (
    <Link to="/carrito" className="btn btn-success btn-sm btn-carrito" aria-label={`Carrito: ${cantidad} productos, total ${formatearPrecio(total)}`}>
      <i className="bi bi-cart3 me-1"></i>Carrito {formatearPrecio(total)}
      {cantidad > 0 && <span className="contador-carrito ms-1">{cantidad}</span>}
    </Link>
  );
}

export default function NavbarTienda() {
  const { usuario, esAdmin, cerrarSesion } = useAuth();
  const { cantidadTotal, total } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdown, setDropdown] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const refCategorias = useRef(null);
  const refUsuario = useRef(null);

  useEffect(() => {
    categoriasApi.listar().then(setCategorias).catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    setMenuAbierto(false);
    setDropdown('');
  }, [ubicacion.pathname, ubicacion.search]);

  useClickFuera(refCategorias, () => setDropdown((d) => (d === 'categorias' ? '' : d)));
  useClickFuera(refUsuario, () => setDropdown((d) => (d === 'usuario' ? '' : d)));

  const buscar = (e) => {
    e.preventDefault();
    const texto = busqueda.trim();
    navegar(texto ? `/productos?q=${encodeURIComponent(texto)}` : '/productos');
  };

  const salir = () => {
    cerrarSesion();
    navegar('/');
  };

  const alternar = (nombre) => setDropdown((d) => (d === nombre ? '' : nombre));

  return (
    <header>
      <nav className="navbar navbar-expand-xl navbar-iron fixed-top" aria-label="Navegación principal">
        <div className="container">
          <Link className="navbar-brand" to="/">IRON<span>BLADE</span></Link>

          <div className="d-flex align-items-center gap-2 d-xl-none">
            <BotonCarrito cantidad={cantidadTotal} total={total} />
            <button className="navbar-toggler text-light border-light" type="button" aria-controls="menuNav" aria-expanded={menuAbierto} aria-label="Abrir menú" onClick={() => setMenuAbierto((v) => !v)}>
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className={`collapse navbar-collapse navbar-dos-filas ${menuAbierto ? 'show' : ''}`} id="menuNav">
            <form className="d-flex my-2 my-xl-0 buscador" role="search" onSubmit={buscar}>
              <input className="form-control form-control-sm" type="search" placeholder="Buscar productos..." aria-label="Buscar productos" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              <button className="btn btn-iron-outline btn-sm ms-2" type="submit" aria-label="Buscar"><i className="bi bi-search"></i></button>
            </form>

            <ul className="navbar-nav zona-sesion align-items-xl-center">
              {usuario ? (
                <li className={`nav-item dropdown ${dropdown === 'usuario' ? 'show' : ''}`} ref={refUsuario}>
                  <button type="button" className="nav-link dropdown-toggle btn btn-link" aria-expanded={dropdown === 'usuario'} onClick={() => alternar('usuario')}>
                    <i className="bi bi-person-circle me-1"></i>{usuario.nombre}
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-dark dropdown-menu-end ${dropdown === 'usuario' ? 'show' : ''}`}>
                    <li><span className="dropdown-item-text small text-secondary">{usuario.email} · {usuario.rol}</span></li>
                    {esAdmin && <li><Link className="dropdown-item" to="/admin"><i className="bi bi-speedometer2 me-2"></i>Panel administrador</Link></li>}
                    <li><Link className="dropdown-item" to="/mis-compras"><i className="bi bi-receipt me-2"></i>Mis compras</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={salir}><i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión</button></li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item"><Link className="btn btn-iron-outline btn-sm me-xl-2 my-1" to="/login"><i className="bi bi-person me-1"></i>Iniciar sesión</Link></li>
                  <li className="nav-item"><Link className="btn btn-iron btn-sm my-1" to="/registro">Crear cuenta</Link></li>
                </>
              )}
            </ul>

            <ul className="navbar-nav fila-enlaces align-items-xl-center">
              <li className="nav-item"><NavLink className="nav-link" to="/" end>Home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
              <li className={`nav-item dropdown ${dropdown === 'categorias' ? 'show' : ''}`} ref={refCategorias}>
                <button type="button" className="nav-link dropdown-toggle btn btn-link" aria-expanded={dropdown === 'categorias'} onClick={() => alternar('categorias')}>
                  Categorías
                </button>
                <ul className={`dropdown-menu dropdown-menu-dark ${dropdown === 'categorias' ? 'show' : ''}`}>
                  <li><Link className="dropdown-item" to="/categorias">Todas las categorías</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  {categorias.map((c) => (
                    <li key={c.id}><Link className="dropdown-item" to={`/categorias/${c.id}`}>{c.nombre}</Link></li>
                  ))}
                </ul>
              </li>
              <li className="nav-item"><NavLink className="nav-link" to="/ofertas">Ofertas</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/blog">Blog</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/reservas">Reservas</NavLink></li>
              <li className="nav-item d-none d-xl-block ms-xl-2"><BotonCarrito cantidad={cantidadTotal} total={total} /></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
