import { Link } from 'react-router-dom';
import Carrusel from '../../components/tienda/Carrusel';
import GrillaProductos from '../../components/tienda/GrillaProductos';
import { Cargando, MensajeError, TituloSeccion } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { categoriasApi, productosApi } from '../../api';
import { enOferta } from '../../utils/formato';

const DIAPOSITIVAS = [
  { etiqueta: 'Tradición', titulo: 'Cortes que marcan estilo', alt: 'Barbero realizando un corte clásico', imagen: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80' },
  { etiqueta: 'Precisión', titulo: 'Barba perfilada a navaja', alt: 'Detalle de arreglo de barba', imagen: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1600&q=80' },
  { etiqueta: 'Ambiente', titulo: 'Una experiencia completa', alt: 'Interior de la barbería', imagen: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80' }
];

export default function Home() {
  const { datos, cargando, error, recargar } = useApi(async () => {
    const [categorias, productos] = await Promise.all([categoriasApi.listar(), productosApi.listarConCategoria()]);
    return { categorias, productos };
  });

  const destacados = datos ? datos.productos.filter(enOferta).slice(0, 4) : [];

  return (
    <>
      <section className="hero">
        <div className="hero-contenido">
          <p className="hero-sub">Desde 2015 &middot; Santiago de Chile</p>
          <h1>THE IRON <span>BLADE</span><br />BARBERSHOP</h1>
          <p>Cortes clásicos, fades modernos y afeitado a navaja. Ahora también compra tus servicios y productos online.</p>
          <Link to="/productos" className="btn btn-iron btn-lg me-2"><i className="bi bi-bag"></i> Ver productos</Link>
          <Link to="/reservas" className="btn btn-iron-outline btn-lg">Reservar hora</Link>
        </div>
      </section>

      <section className="seccion-negra">
        <Carrusel diapositivas={DIAPOSITIVAS} />
      </section>

      <section className="seccion seccion-oscura">
        <div className="container">
          <TituloSeccion titulo="Categorías" subtitulo="Encuentra lo que buscas" />
          <MensajeError mensaje={error} alReintentar={recargar} />
          {cargando ? <Cargando /> : datos && (
            <div className="row g-4 justify-content-center">
              {datos.categorias.map((c) => (
                <div className="col-6 col-md-4 col-lg" key={c.id}>
                  <Link to={`/categorias/${c.id}`} className="categoria-tile">
                    <img src={c.imagen} alt="" loading="lazy" />
                    <span>{c.nombre}</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="seccion seccion-negra">
        <div className="container">
          <TituloSeccion titulo="Ofertas destacadas" subtitulo="Precios especiales por tiempo limitado" />
          {cargando ? <Cargando /> : <GrillaProductos productos={destacados} columnas="col-sm-6 col-lg-3" />}
          <div className="text-center mt-5">
            <Link to="/ofertas" className="btn btn-iron">Ver todas las ofertas</Link>
          </div>
        </div>
      </section>

      <section className="seccion seccion-oscura">
        <div className="container">
          <TituloSeccion titulo="Vive la experiencia" subtitulo="Así trabajamos en The Iron Blade" />
          <div className="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/cC5RgMO5Nxg?start=30&end=150&rel=0&modestbranding=1"
              title="Experiencia The Iron Blade Barbershop"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
