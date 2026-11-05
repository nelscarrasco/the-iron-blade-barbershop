import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Precio from '../../components/tienda/Precio';
import BotonAgregarCarrito from '../../components/tienda/BotonAgregarCarrito';
import GrillaProductos from '../../components/tienda/GrillaProductos';
import BotonVolver from '../../components/common/BotonVolver';
import { Cargando, EstadoVacio, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { productosApi } from '../../api';

export default function DetalleProducto() {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);

  const { datos, cargando, error } = useApi(async () => {
    try {
      const producto = await productosApi.obtenerConCategoria(id);
      const relacionados = (await productosApi.listarConCategoria({ categoriaId: producto.categoriaId }))
        .filter((p) => p.id !== producto.id)
        .slice(0, 4);
      return { producto, relacionados };
    } catch (e) {
      if (e.estado === 404) return { producto: null, relacionados: [] };
      throw e;
    }
  }, [id]);

  if (cargando) return <div className="seccion seccion-oscura"><Cargando /></div>;
  if (error) return <div className="container seccion"><MensajeError mensaje={error} /></div>;
  if (!datos.producto) {
    return <div className="seccion seccion-oscura"><EstadoVacio icono="bi-question-circle" titulo="Producto no encontrado" enlace="/productos" textoEnlace="Ver productos" /></div>;
  }

  const { producto, relacionados } = datos;
  const max = Math.max(producto.stock, 1);

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb breadcrumb-iron">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
            {producto.categoria && <li className="breadcrumb-item"><Link to={`/categorias/${producto.categoriaId}`}>{producto.categoria.nombre}</Link></li>}
            <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
          </ol>
        </nav>

        <div className="row g-5 align-items-start">
          <div className="col-lg-6">
            <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded shadow w-100 detalle-imagen" />
          </div>
          <div className="col-lg-6">
            {producto.categoria && <span className="badge-categoria">{producto.categoria.nombre}</span>}
            <h1 className="mt-2">{producto.nombre}</h1>
            <p className="small text-secondary">Código: {producto.codigo}</p>
            <div className="my-3"><Precio producto={producto} grande /></div>
            <p>{producto.descripcion}</p>
            <p className={producto.stock > 0 ? 'text-success' : 'text-danger'}>
              <i className="bi bi-box-seam me-1"></i>
              {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Producto sin stock'}
            </p>
            <div className="d-flex gap-2 align-items-end flex-wrap">
              <div>
                <label htmlFor="cantidad" className="form-label small">Cantidad</label>
                <input id="cantidad" type="number" className="form-control" style={{ width: 100 }} min="1" max={max} value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, Math.min(max, Number(e.target.value) || 1)))} />
              </div>
              <BotonAgregarCarrito producto={producto} cantidad={cantidad} className="btn btn-iron" texto="Añadir al carrito" />
              <BotonVolver />
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <div className="mt-5">
            <h2 className="h4 mb-4">Productos relacionados</h2>
            <GrillaProductos productos={relacionados} columnas="col-sm-6 col-lg-3" />
          </div>
        )}
      </div>
    </section>
  );
}
