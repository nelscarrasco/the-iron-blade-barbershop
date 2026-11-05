import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import TarjetaResumen from '../../components/admin/TarjetaResumen';
import BarrasHorizontales from '../../components/admin/BarrasHorizontales';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { categoriasApi, ordenesApi, productosApi } from '../../api';
import { resumenVentas, ventasPorCategoria, ventasPorMes, ventasPorProducto } from '../../services/reportes';
import { formatearPrecio } from '../../utils/formato';

export default function Reportes() {
  const { datos, cargando, error, recargar } = useApi(async () => {
    const [ordenes, productos, categorias] = await Promise.all([ordenesApi.listar(), productosApi.listar(), categoriasApi.listar()]);
    return { ordenes, productos, categorias };
  });

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} alReintentar={recargar} />;

  const r = resumenVentas(datos.ordenes);
  const tasa = r.totalOrdenes ? Math.round((r.pagadas / r.totalOrdenes) * 100) : 0;

  return (
    <>
      <EncabezadoAdmin titulo="Reportes" subtitulo="Indicadores de ventas calculados desde las órdenes registradas" />
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><TarjetaResumen titulo="Ingresos" valor={formatearPrecio(r.ingresos)} icono="bi-cash-coin" color="success" /></div>
        <div className="col-sm-6 col-xl-3"><TarjetaResumen titulo="Órdenes pagadas" valor={r.pagadas} detalle={`${tasa}% de aprobación`} icono="bi-check2-circle" color="primary" /></div>
        <div className="col-sm-6 col-xl-3"><TarjetaResumen titulo="Rechazadas" valor={r.rechazadas} icono="bi-x-circle" color="danger" /></div>
        <div className="col-sm-6 col-xl-3"><TarjetaResumen titulo="Ticket promedio" valor={formatearPrecio(r.ticketPromedio)} icono="bi-receipt" color="warning" /></div>
      </div>
      <div className="row g-4">
        <div className="col-lg-6"><div className="panel-admin"><h2 className="h5">Ventas por mes</h2><BarrasHorizontales datos={ventasPorMes(datos.ordenes)} formato={formatearPrecio} /></div></div>
        <div className="col-lg-6"><div className="panel-admin"><h2 className="h5">Ventas por categoría</h2><BarrasHorizontales datos={ventasPorCategoria(datos.ordenes, datos.productos, datos.categorias)} formato={formatearPrecio} /></div></div>
        <div className="col-12"><div className="panel-admin"><h2 className="h5">Ventas por producto</h2><BarrasHorizontales datos={ventasPorProducto(datos.ordenes)} formato={formatearPrecio} /></div></div>
      </div>
    </>
  );
}
