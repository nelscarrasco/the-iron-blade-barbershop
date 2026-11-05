import GrillaProductos from '../../components/tienda/GrillaProductos';
import { Cargando, MensajeError, TituloSeccion } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { productosApi } from '../../api';
import { enOferta, porcentajeDescuento } from '../../utils/formato';

export default function Ofertas() {
  const { datos, cargando, error, recargar } = useApi(() => productosApi.listarConCategoria());
  const ofertas = (datos ?? []).filter(enOferta).sort((a, b) => porcentajeDescuento(b) - porcentajeDescuento(a));

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <TituloSeccion as="h1" titulo="Ofertas" subtitulo="Todos los productos con precio rebajado" />
        <MensajeError mensaje={error} alReintentar={recargar} />
        {cargando ? <Cargando /> : <GrillaProductos productos={ofertas} />}
      </div>
    </section>
  );
}
