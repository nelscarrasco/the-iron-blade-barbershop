import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import BarrasHorizontales from '../../components/admin/BarrasHorizontales';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { categoriasApi, ordenesApi, productosApi } from '../../api';
import { inventarioPorCategoria, ventasPorProducto } from '../../services/reportes';
import { formatearPrecio } from '../../utils/formato';

export default function ReportesProductos() {
  const { datos, cargando, error, recargar } = useApi(async () => {
    const [productos, categorias, ordenes] = await Promise.all([productosApi.listar(), categoriasApi.listar(), ordenesApi.listar()]);
    return { productos, categorias, ordenes };
  });

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} alReintentar={recargar} />;

  const inventario = inventarioPorCategoria(datos.productos, datos.categorias);
  const vendidos = ventasPorProducto(datos.ordenes);
  const valorTotal = inventario.reduce((a, i) => a + i.valor, 0);

  return (
    <>
      <EncabezadoAdmin titulo="Reportes de productos" subtitulo={`Valor del inventario (precio normal): ${formatearPrecio(valorTotal)}`}
        acciones={[{ a: '/admin/productos', texto: 'Volver a productos', icono: 'bi-arrow-left', clase: 'btn btn-outline-light btn-sm' }]} />
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="panel-admin">
            <h2 className="h5">Unidades en stock por categoría</h2>
            <BarrasHorizontales datos={inventario.map((i) => ({ etiqueta: i.etiqueta, valor: i.unidades }))} formato={(v) => `${v} u.`} />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="panel-admin">
            <h2 className="h5">Productos más vendidos (unidades)</h2>
            <BarrasHorizontales datos={vendidos.slice(0, 6).map((v) => ({ etiqueta: v.etiqueta, valor: v.unidades }))} formato={(v) => `${v} u.`} />
          </div>
        </div>
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-dark tabla-iron">
              <thead><tr><th>Categoría</th><th className="text-center">Productos</th><th className="text-center">Unidades</th><th className="text-end">Valor inventario</th></tr></thead>
              <tbody>
                {inventario.map((i) => (
                  <tr key={i.etiqueta}><td>{i.etiqueta}</td><td className="text-center">{i.productos}</td><td className="text-center">{i.unidades}</td><td className="text-end">{formatearPrecio(i.valor)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
