import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Campo from '../../components/common/Campo';
import { EstadoVacio } from '../../components/common/Estados';
import { useFormulario } from '../../hooks/useFormulario';
import { useAuth } from '../../context/AuthContext';
import { useCarrito } from '../../context/CarritoContext';
import { REGIONES, comunasDe } from '../../data/regiones';
import { calcularTotales, procesarCompra } from '../../services/compra';
import { formatearPrecio } from '../../utils/formato';
import { validarEmail, validarNombre, validarRequerido, validarTelefono } from '../../utils/validaciones';

const soloDespacho = (regla) => (v, todos) => (todos.tipoEntrega === 'despacho' ? regla(v) : '');

const REGLAS = {
  nombre: (v) => validarNombre(v),
  apellidos: (v) => validarNombre(v, 'Los apellidos'),
  email: validarEmail,
  telefono: (v) => validarTelefono(v, false),
  calle: soloDespacho((v) => validarRequerido(v, 'Calle', 3)),
  region: soloDespacho((v) => validarRequerido(v, 'Región')),
  comuna: soloDespacho((v) => validarRequerido(v, 'Comuna')),
  medioPago: (v) => validarRequerido(v, 'Medio de pago')
};

export default function Checkout() {
  const { usuario } = useAuth();
  const { items, vaciar } = useCarrito();
  const navegar = useNavigate();
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [simularRechazo, setSimularRechazo] = useState(false);

  const { valores, setValores, errores, manejarCambio, manejarBlur, validarTodo } = useFormulario({
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    email: usuario?.email ?? '',
    telefono: usuario?.telefono ?? '',
    tipoEntrega: 'despacho',
    calle: usuario?.direccion ?? '',
    departamento: usuario?.departamento ?? '',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    indicaciones: '',
    medioPago: ''
  }, REGLAS);

  if (!items.length) {
    return (
      <section className="seccion seccion-oscura pagina-media">
        <EstadoVacio icono="bi-cart-x" titulo="No hay productos para pagar" enlace="/productos" textoEnlace="Ir a productos" />
      </section>
    );
  }

  const lineas = items.map((i) => ({ ...i, subtotal: i.precio * i.cantidad }));
  const { subtotal, costoEnvio, total } = calcularTotales(lineas, valores.tipoEntrega);

  const pagar = async (e) => {
    e.preventDefault();
    setError('');
    if (!validarTodo()) {
      setError('Revisa los campos marcados en rojo.');
      return;
    }
    setProcesando(true);
    try {
      const orden = await procesarCompra({ items, datos: valores, usuarioId: usuario?.id, simularRechazo });
      if (orden.estado === 'pagada') {
        vaciar();
        navegar(`/compra/exitosa/${orden.id}`, { replace: true });
      } else {
        navegar(`/compra/error/${orden.id}`);
      }
    } catch (err) {
      setError(err.message);
      setProcesando(false);
    }
  };

  const props = (campo) => ({ id: campo, value: valores[campo], onChange: manejarCambio, onBlur: manejarBlur, error: errores[campo] });

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <form className="form-iron ancho-grande" onSubmit={pagar} noValidate>
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
            <div>
              <h1 className="h3 mb-0">Carrito de compra</h1>
              <p className="text-secondary mb-0">Completa la siguiente información</p>
            </div>
            <span className="badge-total">Total a pagar: {formatearPrecio(total)}</span>
          </div>

          <div className="table-responsive mb-4">
            <table className="table table-dark tabla-iron align-middle mb-0">
              <thead>
                <tr><th>Imagen</th><th>Nombre</th><th className="text-end">Precio</th><th className="text-center">Cantidad</th><th className="text-end">Subtotal</th></tr>
              </thead>
              <tbody>
                {lineas.map((i) => (
                  <tr key={i.productoId}>
                    <td><img src={i.imagen} alt="" className="miniatura" /></td>
                    <td>{i.nombre}</td>
                    <td className="text-end">{formatearPrecio(i.precio)}</td>
                    <td className="text-center">{i.cantidad}</td>
                    <td className="text-end">{formatearPrecio(i.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!usuario && <div className="alert alerta-iron alert-info small">¿Tienes cuenta? Inicia sesión y tus datos se completarán automáticamente.</div>}

          <h2 className="h5">Información del cliente</h2>
          <div className="row">
            <div className="col-md-6"><Campo etiqueta="Nombre" requerido {...props('nombre')} /></div>
            <div className="col-md-6"><Campo etiqueta="Apellidos" requerido {...props('apellidos')} /></div>
            <div className="col-md-6"><Campo etiqueta="Correo" requerido type="email" {...props('email')} /></div>
            <div className="col-md-6"><Campo etiqueta="Teléfono" opcional type="tel" placeholder="+56912345678" {...props('telefono')} /></div>
          </div>

          <h2 className="h5 mt-2">Entrega</h2>
          <div className="d-flex flex-wrap gap-3 mb-3" role="radiogroup" aria-label="Tipo de entrega">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="tipoEntrega" id="entrega-despacho" value="despacho" checked={valores.tipoEntrega === 'despacho'} onChange={manejarCambio} />
              <label className="form-check-label" htmlFor="entrega-despacho">Despacho a domicilio (+{formatearPrecio(2990)})</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="tipoEntrega" id="entrega-retiro" value="retiro" checked={valores.tipoEntrega === 'retiro'} onChange={manejarCambio} />
              <label className="form-check-label" htmlFor="entrega-retiro">Retiro en local (gratis)</label>
            </div>
          </div>

          {valores.tipoEntrega === 'despacho' && (
            <>
              <h3 className="h6 text-secondary">Dirección de entrega de los productos</h3>
              <div className="row">
                <div className="col-md-8"><Campo etiqueta="Calle" requerido placeholder="Calle y número" {...props('calle')} /></div>
                <div className="col-md-4"><Campo etiqueta="Departamento" opcional placeholder="Ej: 603" {...props('departamento')} /></div>
                <div className="col-md-6">
                  <Campo etiqueta="Región" requerido as="select" {...props('region')}
                    onChange={(e) => setValores((v) => ({ ...v, region: e.target.value, comuna: '' }))}>
                    <option value="">Selecciona una región</option>
                    {REGIONES.map((r) => <option key={r.nombre}>{r.nombre}</option>)}
                  </Campo>
                </div>
                <div className="col-md-6">
                  <Campo etiqueta="Comuna" requerido as="select" disabled={!valores.region} {...props('comuna')}>
                    <option value="">Selecciona una comuna</option>
                    {comunasDe(valores.region).map((c) => <option key={c}>{c}</option>)}
                  </Campo>
                </div>
              </div>
            </>
          )}
          <Campo etiqueta="Indicaciones para la entrega" opcional as="textarea" placeholder="Ej: Entre calles, color del edificio, no tiene timbre." {...props('indicaciones')} />

          <h2 className="h5 mt-2">Pago</h2>
          <Campo etiqueta="Medio de pago" requerido as="select" {...props('medioPago')}>
            <option value="">Selecciona un medio de pago</option>
            <option>Tarjeta de débito</option>
            <option>Tarjeta de crédito</option>
            <option>Transferencia bancaria</option>
          </Campo>
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="simular-rechazo" checked={simularRechazo} onChange={(e) => setSimularRechazo(e.target.checked)} />
            <label className="form-check-label small text-secondary" htmlFor="simular-rechazo">Modo demo: simular que el pago es rechazado</label>
          </div>

          <div className="resumen-carrito mb-3">
            <div className="d-flex justify-content-between"><span>Subtotal</span><span>{formatearPrecio(subtotal)}</span></div>
            <div className="d-flex justify-content-between"><span>Despacho</span><span>{costoEnvio ? formatearPrecio(costoEnvio) : 'Gratis'}</span></div>
            <div className="d-flex justify-content-between fs-5 mt-1"><strong>Total</strong><strong className="texto-dorado">{formatearPrecio(total)}</strong></div>
          </div>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className="text-end">
            <button type="submit" className="btn btn-success btn-lg" disabled={procesando}>
              {procesando ? 'Procesando pago...' : `Pagar ahora ${formatearPrecio(total)}`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
