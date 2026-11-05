import { Link, useParams } from 'react-router-dom';
import { Cargando, EstadoVacio, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { blogsApi } from '../../api';
import { formatearFecha } from '../../utils/formato';

export default function BlogDetalle() {
  const { id } = useParams();
  const { datos, cargando, error } = useApi(async () => {
    try {
      return await blogsApi.obtener(id);
    } catch (e) {
      if (e.estado === 404) return null;
      throw e;
    }
  }, [id]);

  if (cargando) return <div className="seccion seccion-oscura"><Cargando /></div>;
  if (error) return <div className="container seccion"><MensajeError mensaje={error} /></div>;
  if (!datos) return <div className="seccion seccion-oscura"><EstadoVacio titulo="Artículo no encontrado" enlace="/blog" textoEnlace="Volver al blog" /></div>;

  return (
    <article className="seccion seccion-oscura">
      <div className="container contenedor-lectura">
        <Link to="/blog" className="small"><i className="bi bi-arrow-left me-1"></i>Volver al blog</Link>
        <h1 className="mt-3">{datos.titulo}</h1>
        <p className="text-secondary">{formatearFecha(datos.fecha)} · {datos.autor}</p>
        <img src={datos.imagen} alt="" className="img-fluid rounded mb-4 w-100" />
        {datos.contenido.map((parrafo, i) => <p key={i}>{parrafo}</p>)}
      </div>
    </article>
  );
}
