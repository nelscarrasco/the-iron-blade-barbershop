import { Link } from 'react-router-dom';
import TarjetaResumen from '../../components/admin/TarjetaResumen';
import { Cargando, MensajeError } from '../../components/common/Estados';
import { useApi } from '../../hooks/useApi';
import { ordenesApi, productosApi, usuariosApi } from '../../api';
import { resumenVentas } from '../../services/reportes';
import { esStockCritico, formatearPrecio } from '../../utils/formato';

const ACCESOS = [
  { a: '/admin', icono: 'bi-speedometer2', titulo: 'Dashboard', texto: 'Visión general de métricas y estadísticas clave.' },
  { a: '/admin/ordenes', icono: 'bi-receipt', titulo: 'Órdenes', texto: 'Gestión y seguimiento de las órdenes de compra.' },
  { a: '/admin/productos', icono: 'bi-box-seam', titulo: 'Productos', texto: 'Administrar inventario y detalle de productos.' },
  { a: '/admin/categorias', icono: 'bi-tags', titulo: 'Categorías', texto: 'Organizar productos en categorías.' },
  { a: '/admin/usuarios', icono: 'bi-people', titulo: 'Usuarios', texto: 'Gestión de cuentas de usuario y sus roles.' },
  { a: '/admin/reportes', icono: 'bi-graph-up', titulo: 'Reportes', texto: 'Informes de ventas e inventario.' },
  { a: '/admin/perfil', icono: 'bi-person', titulo: 'Perfil', texto: 'Tu información personal y de cuenta.' },
  { a: '/', icono: 'bi-shop', titulo: 'Tienda', texto: 'Ver la tienda tal como la ven los clientes.' }
];

export default function Dashboard() {
  const { datos, cargando, error, recargar } = useApi(async () => {
    const [ordenes, productos, usuarios] = await Promise.all([ordenesApi.listar(), productosApi.listar(), usuariosApi.listar()]);
    return { ordenes, productos, usuarios };
  });

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} alReintentar={recargar} />;

  const resumen = resumenVentas(datos.ordenes);
  const stockTotal = datos.productos.reduce((a, p) => a + Number(p.stock), 0);
  const criticos = datos.productos.filter(esStockCritico).length;
  const mesActual = new Date().toISOString().slice(0, 7);
  const nuevosMes = datos.usuarios.filter((u) => u.fechaRegistro?.startsWith(mesActual)).length;

  return (
    <>
      <h1 className="h3 mb-0">Dashboard</h1>
      <p className="text-secondary">Resumen de las actividades de la tienda</p>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><TarjetaResumen titulo="Compras" valor={resumen.pagadas} detalle={`Ingresos: ${formatearPrecio(resumen.ingresos)}`} icono="bi-cart-check" color="primary" /></div>
        <div className="col-md-4"><TarjetaResumen titulo="Productos" valor={datos.productos.length} detalle={`Inventario: ${stockTotal} u. · ${criticos} crítico(s)`} icono="bi-box-seam" color="success" /></div>
        <div className="col-md-4"><TarjetaResumen titulo="Usuarios" valor={datos.usuarios.length} detalle={`Nuevos este mes: ${nuevosMes}`} icono="bi-people" color="warning" /></div>
      </div>
      {criticos > 0 && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span><i className="bi bi-exclamation-triangle me-2"></i>Hay {criticos} producto(s) con stock crítico.</span>
          <Link to="/admin/productos/criticos" className="btn btn-sm btn-dark">Ver listado</Link>
        </div>
      )}
      <div className="row g-3">
        {ACCESOS.map((a) => (
          <div className="col-sm-6 col-xl-3" key={a.titulo}>
            <Link to={a.a} className="acceso-admin">
              <i className={`bi ${a.icono}`}></i>
              <strong>{a.titulo}</strong>
              <span>{a.texto}</span>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
