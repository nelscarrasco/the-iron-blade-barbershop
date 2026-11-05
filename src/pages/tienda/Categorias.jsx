import { Link, NavLink, useParams } from 'react-router-dom';
import GrillaProductos from '../../components/tienda/GrillaProductos';
import { Cargando, EstadoVacio, MensajeError, TituloSeccion } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { categoriasApi, productosApi } from '../../api';

export default function Categorias() {
  const { id } = useParams();
  const { datos, cargando, error, recargar } = useApi(async () => {
    const [categorias, productos] = await Promise.all([categoriasApi.listar(), productosApi.listarConCategoria()]);
    return { categorias, productos };
  });

  const seleccionadas = datos
    ? (id ? datos.categorias.filter((c) => String(c.id) === id) : datos.categorias)
    : [];

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <TituloSeccion as="h1" titulo="Categorías" subtitulo="Productos y servicios organizados por tipo" />
        <MensajeError mensaje={error} alReintentar={recargar} />
        {cargando ? <Cargando /> : datos && (
          <>
            <div className="row g-3 justify-content-center mb-5">
              {datos.categorias.map((c) => (
                <div className="col-6 col-sm-4 col-lg-2" key={c.id}>
                  <NavLink to={`/categorias/${c.id}`} className="categoria-mini">
                    <img src={c.imagen} alt="" loading="lazy" />
                    <span>{c.nombre}</span>
                  </NavLink>
                </div>
              ))}
            </div>

            {id && !seleccionadas.length && (
              <EstadoVacio icono="bi-tags" titulo="Categoría no encontrada" enlace="/categorias" textoEnlace="Ver todas" />
            )}

            {seleccionadas.map((c) => {
              const productos = datos.productos.filter((p) => p.categoriaId === c.id);
              return (
                <div className="mb-5" key={c.id}>
                  <div className="d-flex flex-wrap justify-content-between align-items-end mb-3 gap-2">
                    <div>
                      <h2 className="h3 mb-1">{c.nombre}</h2>
                      <p className="text-secondary mb-0">{c.descripcion}</p>
                    </div>
                    {id
                      ? <Link to="/categorias" className="btn btn-iron-outline btn-sm">Ver todas las categorías</Link>
                      : <Link to={`/categorias/${c.id}`} className="btn btn-iron-outline btn-sm">Ver categoría</Link>}
                  </div>
                  <GrillaProductos productos={productos} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}
