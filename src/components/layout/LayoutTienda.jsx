import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarTienda from './NavbarTienda';
import FooterTienda from './FooterTienda';

export default function LayoutTienda() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <NavbarTienda />
      <main className="contenido-tienda">
        {state?.aviso && (
          <div className="container pt-3">
            <div className="alert alerta-iron alert-warning mb-0" role="alert">{state.aviso}</div>
          </div>
        )}
        <Outlet />
      </main>
      <FooterTienda />
    </>
  );
}
