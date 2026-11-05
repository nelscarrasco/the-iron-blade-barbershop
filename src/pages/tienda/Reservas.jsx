import { useState } from 'react';
import Campo from '../../components/common/Campo';
import { TituloSeccion } from '../../components/common/Estados';
import { useFormulario } from '../../hooks/useFormulario';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { categoriasApi, productosApi, reservasApi } from '../../api';
import { validarEmail, validarFechaFutura, validarNombre, validarRequerido, validarTelefono } from '../../utils/validaciones';

const HORAS = ['10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const REGLAS = {
  nombre: (v) => validarNombre(v),
  email: validarEmail,
  telefono: (v) => validarTelefono(v),
  servicio: (v) => validarRequerido(v, 'Servicio'),
  fecha: validarFechaFutura,
  hora: (v) => validarRequerido(v, 'Hora')
};

export default function Reservas() {
  const { usuario } = useAuth();
  const mostrarToast = useToast();
  const [enviando, setEnviando] = useState(false);
  const [confirmada, setConfirmada] = useState(null);
  const inicial = {
    nombre: usuario ? `${usuario.nombre} ${usuario.apellidos ?? ''}`.trim() : '',
    email: usuario?.email ?? '',
    telefono: usuario?.telefono ?? '',
    servicio: '', fecha: '', hora: '', comentario: ''
  };
  const { valores, errores, manejarCambio, manejarBlur, validarTodo, reiniciar } = useFormulario(inicial, REGLAS);

  const { datos: servicios } = useApi(async () => {
    const categorias = await categoriasApi.listar({ tipo: 'Servicio' });
    const productos = await productosApi.listar();
    const ids = categorias.map((c) => c.id);
    return productos.filter((p) => ids.includes(p.categoriaId));
  });

  const enviar = async (e) => {
    e.preventDefault();
    if (!validarTodo()) return;
    setEnviando(true);
    try {
      const reserva = await reservasApi.crear({ ...valores, usuarioId: usuario?.id ?? null, estado: 'pendiente', creada: new Date().toISOString() });
      setConfirmada(reserva);
      mostrarToast('Reserva registrada correctamente.');
      reiniciar({ ...inicial });
    } catch (err) {
      mostrarToast(err.message, 'error');
    } finally {
      setEnviando(false);
    }
  };

  const props = (campo) => ({ id: campo, value: valores[campo], onChange: manejarCambio, onBlur: manejarBlur, error: errores[campo] });

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <TituloSeccion as="h1" titulo="Reserva tu hora" subtitulo="Agenda tu próxima visita a The Iron Blade" />
        <div className="row justify-content-center">
          <div className="col-lg-7">
            {confirmada && (
              <div className="alert alert-success" role="status">
                <i className="bi bi-check-circle-fill me-2"></i>
                Reserva #{confirmada.id} confirmada para el {confirmada.fecha} a las {confirmada.hora} ({confirmada.servicio}).
              </div>
            )}
            <form className="form-iron ancho" onSubmit={enviar} noValidate>
              <Campo etiqueta="Nombre completo" requerido placeholder="Ej: Juan Pérez" {...props('nombre')} />
              <div className="row">
                <div className="col-md-6"><Campo etiqueta="Correo" requerido type="email" placeholder="nombre@correo.cl" {...props('email')} /></div>
                <div className="col-md-6"><Campo etiqueta="Teléfono" requerido type="tel" placeholder="+56912345678" {...props('telefono')} /></div>
              </div>
              <Campo etiqueta="Servicio" requerido as="select" {...props('servicio')}>
                <option value="">Selecciona un servicio</option>
                {servicios?.map((s) => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
              </Campo>
              <div className="row">
                <div className="col-md-6"><Campo etiqueta="Fecha" requerido type="date" {...props('fecha')} /></div>
                <div className="col-md-6">
                  <Campo etiqueta="Hora" requerido as="select" {...props('hora')}>
                    <option value="">Selecciona una hora</option>
                    {HORAS.map((h) => <option key={h}>{h}</option>)}
                  </Campo>
                </div>
              </div>
              <Campo etiqueta="Comentario" opcional as="textarea" placeholder="Alguna preferencia o detalle" {...props('comentario')} />
              <button type="submit" className="btn btn-iron w-100" disabled={enviando}>{enviando ? 'Registrando...' : 'Confirmar reserva'}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
