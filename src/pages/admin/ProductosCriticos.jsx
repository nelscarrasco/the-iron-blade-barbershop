import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin';
import { TablaProductos } from './ProductosAdmin';
import { Cargando, EstadoVacio, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { productosApi } from '../../api';
import { esStockCritico } from '../../utils/formato';

export default function ProductosCriticos() {
  const { datos, cargando, error, recargar } = useApi(() => productosApi.listarConCategoria());
  const criticos = (datos ?? []).filter(esStockCritico).sort((a, b) => a.stock - b.stock);

  return (
    <>
      <EncabezadoAdmin titulo="Listado de productos críticos" subtitulo="Productos con stock igual o menor a su stock crítico"
        acciones={[{ a: '/admin/productos', texto: 'Volver a productos', icono: 'bi-arrow-left', clase: 'btn btn-outline-light btn-sm' }]} />
      <MensajeError mensaje={error} alReintentar={recargar} />
      {cargando ? <Cargando /> : criticos.length
        ? <TablaProductos productos={criticos} />
        : <EstadoVacio icono="bi-check2-circle" titulo="Sin productos críticos" texto="Todo el inventario está sobre su nivel crítico." />}
    </>
  );
}
