import { Link } from 'react-router-dom';
import { TituloSeccion } from '../../components/common/Estados';

const EQUIPO = [
  { nombre: 'Rodrigo "Navaja" Fuentes', cargo: 'Barbero fundador', icono: 'bi-scissors' },
  { nombre: 'Matías Leiva', cargo: 'Especialista en fades', icono: 'bi-lightning-charge' },
  { nombre: 'Javiera Contreras', cargo: 'Barba y afeitado clásico', icono: 'bi-droplet' }
];

export default function Nosotros() {
  return (
    <>
      <section className="seccion seccion-oscura">
        <div className="container">
          <TituloSeccion as="h1" titulo="Nosotros" subtitulo="Tradición, oficio y buen ambiente" />
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80" alt="Herramientas de barbería" className="img-fluid rounded shadow" />
            </div>
            <div className="col-lg-6">
              <h2>Sobre <span className="texto-dorado">The Iron Blade</span></h2>
              <hr className="divisor-dorado divisor-izquierda" />
              <p>En <strong className="texto-dorado">The Iron Blade Barbershop</strong> combinamos la tradición de la barbería clásica con las tendencias actuales. Nuestro equipo de barberos se especializa en cortes personalizados, arreglo de barba y afeitado a navaja.</p>
              <p>Más que un corte, ofrecemos una experiencia: buen ambiente, atención dedicada y productos de primera calidad que ahora también puedes comprar online.</p>
              <ul className="list-unstyled">
                <li className="mb-2"><i className="bi bi-check-circle-fill texto-dorado me-2"></i>Barberos certificados con años de experiencia</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill texto-dorado me-2"></i>Productos premium para el cuidado masculino</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill texto-dorado me-2"></i>Compra online con despacho o retiro en local</li>
              </ul>
              <Link to="/reservas" className="btn btn-iron mt-2">Reserva tu hora</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="seccion seccion-negra">
        <div className="container">
          <TituloSeccion titulo="Nuestro equipo" />
          <div className="row g-4">
            {EQUIPO.map((m) => (
              <div className="col-md-4" key={m.nombre}>
                <article className="servicio-item h-100">
                  <div className="icono"><i className={`bi ${m.icono}`}></i></div>
                  <h3 className="h5">{m.nombre}</h3>
                  <p className="text-secondary mb-0">{m.cargo}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
