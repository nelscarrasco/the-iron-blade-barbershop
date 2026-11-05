import { Route, Routes } from 'react-router-dom';
import LayoutTienda from './components/layout/LayoutTienda';
import LayoutAdmin from './components/layout/LayoutAdmin';
import RutaProtegida from './components/common/RutaProtegida';

import Home from './pages/tienda/Home';
import Productos from './pages/tienda/Productos';
import DetalleProducto from './pages/tienda/DetalleProducto';
import Categorias from './pages/tienda/Categorias';
import Ofertas from './pages/tienda/Ofertas';
import Nosotros from './pages/tienda/Nosotros';
import Blog from './pages/tienda/Blog';
import BlogDetalle from './pages/tienda/BlogDetalle';
import Contacto from './pages/tienda/Contacto';
import Reservas from './pages/tienda/Reservas';
import Login from './pages/tienda/Login';
import Registro from './pages/tienda/Registro';
import Carrito from './pages/tienda/Carrito';
import Checkout from './pages/tienda/Checkout';
import ResultadoCompra from './pages/tienda/ResultadoCompra';
import MisCompras from './pages/tienda/MisCompras';
import NoEncontrada from './pages/NoEncontrada';

import Dashboard from './pages/admin/Dashboard';
import Ordenes from './pages/admin/Ordenes';
import OrdenDetalle from './pages/admin/OrdenDetalle';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import ProductoForm from './pages/admin/ProductoForm';
import ProductoDetalleAdmin from './pages/admin/ProductoDetalleAdmin';
import ProductosCriticos from './pages/admin/ProductosCriticos';
import ReportesProductos from './pages/admin/ReportesProductos';
import CategoriasAdmin from './pages/admin/CategoriasAdmin';
import CategoriaForm from './pages/admin/CategoriaForm';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import UsuarioForm from './pages/admin/UsuarioForm';
import UsuarioDetalle from './pages/admin/UsuarioDetalle';
import Reportes from './pages/admin/Reportes';
import Perfil from './pages/admin/Perfil';

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutTienda />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<DetalleProducto />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/:id" element={<Categorias />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="reservas" element={<Reservas />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="compra/exitosa/:id" element={<ResultadoCompra exitosa />} />
        <Route path="compra/error/:id" element={<ResultadoCompra exitosa={false} />} />
        <Route path="mis-compras" element={<RutaProtegida><MisCompras /></RutaProtegida>} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      <Route path="admin" element={<RutaProtegida rol="admin"><LayoutAdmin /></RutaProtegida>}>
        <Route index element={<Dashboard />} />
        <Route path="ordenes" element={<Ordenes />} />
        <Route path="ordenes/:id" element={<OrdenDetalle />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="productos/nuevo" element={<ProductoForm />} />
        <Route path="productos/criticos" element={<ProductosCriticos />} />
        <Route path="productos/reportes" element={<ReportesProductos />} />
        <Route path="productos/:id" element={<ProductoDetalleAdmin />} />
        <Route path="productos/:id/editar" element={<ProductoForm key="editar" />} />
        <Route path="categorias" element={<CategoriasAdmin />} />
        <Route path="categorias/nueva" element={<CategoriaForm />} />
        <Route path="categorias/:id/editar" element={<CategoriaForm />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
        <Route path="usuarios/nuevo" element={<UsuarioForm />} />
        <Route path="usuarios/:id" element={<UsuarioDetalle />} />
        <Route path="usuarios/:id/editar" element={<UsuarioForm />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}
