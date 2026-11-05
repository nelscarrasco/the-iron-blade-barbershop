import { Link } from 'react-router-dom';
import { Cargando, MensajeError, TituloSeccion } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { blogsApi } from '../../api';
import { formatearFecha } from '../../utils/formato';

export default function Blog() {
  const { datos, cargando, error, recargar } = useApi(() => blogsApi.listar({ _sort: 'fecha', _order: 'desc' }));

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <TituloSeccion as="h1" titulo="Blog" subtitulo="Consejos de nuestros barberos" />
        <MensajeError mensaje={error} alReintentar={recargar} />
        {cargando ? <Cargando /> : (
          <div className="row g-4">
            {datos?.map((b) => (
              <div className="col-md-6 col-lg-4" key={b.id}>
                <article className="card card-iron h-100">
                  <img src={b.imagen} alt="" className="card-img-top" loading="lazy" />
                  <div className="card-body d-flex flex-column">
                    <p className="small text-secondary mb-1">{formatearFecha(b.fecha)} · {b.autor}</p>
                    <h2 className="card-title h5">{b.titulo}</h2>
                    <p className="card-text flex-grow-1">{b.resumen}</p>
                    <Link to={`/blog/${b.id}`} className="btn btn-iron-outline btn-sm align-self-start">Leer más</Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
