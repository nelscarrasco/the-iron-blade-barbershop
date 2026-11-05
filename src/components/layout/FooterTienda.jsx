import { Link } from 'react-router-dom';

export default function FooterTienda() {
  return (
    <footer className="footer-iron">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5>IRON BLADE</h5>
            <p>Barbería clásica en el corazón de Santiago. El arte de verse bien.</p>
            <div className="redes">
              <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
              <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="#" aria-label="WhatsApp"><i className="bi bi-whatsapp"></i></a>
              <a href="#" aria-label="TikTok"><i className="bi bi-tiktok"></i></a>
            </div>
          </div>
          <div className="col-md-4">
            <h5>Navegación</h5>
            <Link to="/productos">Productos</Link>
            <Link to="/categorias">Categorías</Link>
            <Link to="/ofertas">Ofertas</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/reservas">Reservas</Link>
          </div>
          <div className="col-md-4">
            <h5>Contacto</h5>
            <p className="mb-1"><i className="bi bi-geo-alt texto-dorado me-2"></i>Av. Providencia 1234, Santiago</p>
            <p className="mb-1"><i className="bi bi-telephone texto-dorado me-2"></i>+56 9 1234 5678</p>
            <p className="mb-1"><i className="bi bi-clock texto-dorado me-2"></i>Lun a Sáb: 10:00 - 20:00</p>
            <p className="mb-0"><i className="bi bi-envelope texto-dorado me-2"></i>hola@ironblade.cl</p>
          </div>
        </div>
        <div className="footer-copyright">
          <p className="mb-0">&copy; 2026 The Iron Blade Barbershop. Proyecto académico DSY1104 - Nelson Carrasco &amp; Mathias Von Jentschyk.</p>
        </div>
      </div>
    </footer>
  );
}
