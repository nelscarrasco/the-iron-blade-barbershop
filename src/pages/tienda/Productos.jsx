import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import GrillaProductos from '../../components/tienda/GrillaProductos';
import { Cargando, MensajeError, TituloSeccion } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { categoriasApi, productosApi } from '../../api';
import { enOferta, precioFinal } from '../../utils/formato';

export function filtrarProductos(productos, { q = '', categoria = '', soloOfertas = false, precioMax = '', orden = '' }) {
  const texto = q.trim().toLowerCase();
  let lista = productos.filter((p) => {
    if (texto && !`${p.nombre} ${p.descripcion}`.toLowerCase().includes(texto)) return false;
    if (categoria && String(p.categoriaId) !== String(categoria)) return false;
    if (soloOfertas && !enOferta(p)) return false;
    if (precioMax && precioFinal(p) > Number(precioMax)) return false;
    return true;
  });
  if (orden === 'precio-asc') lista = [...lista].sort((a, b) => precioFinal(a) - precioFinal(b));
  if (orden === 'precio-desc') lista = [...lista].sort((a, b) => precioFinal(b) - precioFinal(a));
  if (orden === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
  return lista;
}

export default function Productos() {
  const [params, setParams] = useSearchParams();
  const filtros = {
    q: params.get('q') ?? '',
    categoria: params.get('categoria') ?? '',
    soloOfertas: params.get('ofertas') === '1',
    precioMax: params.get('max') ?? '',
    orden: params.get('orden') ?? ''
  };

  const { datos, cargando, error, recargar } = useApi(async () => {
    const [productos, categorias] = await Promise.all([productosApi.listarConCategoria(), categoriasApi.listar()]);
    return { productos, categorias };
  });

  const resultado = useMemo(() => (datos ? filtrarProductos(datos.productos, filtros) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datos, params]);

  const cambiar = (clave, valor) => {
    const nuevos = new URLSearchParams(params);
    if (valor === '' || valor === false) nuevos.delete(clave);
    else nuevos.set(clave, valor === true ? '1' : valor);
    setParams(nuevos, { replace: true });
  };

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <TituloSeccion as="h1" titulo="Productos" subtitulo="Servicios y productos de barbería" />
        <MensajeError mensaje={error} alReintentar={recargar} />

        <form className="filtros-iron row g-2 align-items-end mb-4" onSubmit={(e) => e.preventDefault()} aria-label="Filtros de productos">
          <div className="col-md-4">
            <label htmlFor="filtro-q" className="form-label small">Buscar</label>
            <input id="filtro-q" type="search" className="form-control" placeholder="Nombre o descripción" value={filtros.q} onChange={(e) => cambiar('q', e.target.value)} />
          </div>
          <div className="col-6 col-md-2">
            <label htmlFor="filtro-categoria" className="form-label small">Categoría</label>
            <select id="filtro-categoria" className="form-select" value={filtros.categoria} onChange={(e) => cambiar('categoria', e.target.value)}>
              <option value="">Todas</option>
              {datos?.categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <label htmlFor="filtro-max" className="form-label small">Precio máximo</label>
            <input id="filtro-max" type="number" min="0" step="500" className="form-control" placeholder="Sin límite" value={filtros.precioMax} onChange={(e) => cambiar('max', e.target.value)} />
          </div>
          <div className="col-6 col-md-2">
            <label htmlFor="filtro-orden" className="form-label small">Ordenar por</label>
            <select id="filtro-orden" className="form-select" value={filtros.orden} onChange={(e) => cambiar('orden', e.target.value)}>
              <option value="">Relevancia</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            <div className="form-check mb-2">
              <input id="filtro-ofertas" type="checkbox" className="form-check-input" checked={filtros.soloOfertas} onChange={(e) => cambiar('ofertas', e.target.checked)} />
              <label htmlFor="filtro-ofertas" className="form-check-label small">Solo ofertas</label>
            </div>
            <button type="button" className="btn btn-sm btn-outline-light w-100" onClick={() => setParams({}, { replace: true })}>Limpiar</button>
          </div>
        </form>

        {cargando ? <Cargando /> : (
          <>
            <p className="small text-secondary">{resultado.length} resultado(s)</p>
            <GrillaProductos productos={resultado} />
          </>
        )}
      </div>
    </section>
  );
}
