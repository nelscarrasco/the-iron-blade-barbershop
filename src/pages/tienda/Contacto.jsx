import { useState } from 'react';
import Campo from '../../components/common/Campo';
import { TituloSeccion } from '../../components/common/Estados';
import { useFormulario } from '../../hooks/useFormulario';
import { useToast } from '../../context/ToastContext';
import { mensajesApi } from '../../api';
import { validarEmail, validarNombre, validarRequerido } from '../../utils/validaciones';

const INICIAL = { nombre: '', email: '', asunto: '', mensaje: '' };
const REGLAS = {
  nombre: (v) => validarNombre(v),
  email: validarEmail,
  asunto: (v) => validarRequerido(v, 'Asunto', 4),
  mensaje: (v) => validarRequerido(v, 'Mensaje', 10)
};

export default function Contacto() {
  const { valores, errores, manejarCambio, manejarBlur, validarTodo, reiniciar } = useFormulario(INICIAL, REGLAS);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const mostrarToast = useToast();

  const enviar = async (e) => {
    e.preventDefault();
    setErrorEnvio('');
    if (!validarTodo()) return;
    setEnviando(true);
    try {
      await mensajesApi.crear({ ...valores, fecha: new Date().toISOString(), leido: false });
      mostrarToast('¡Mensaje enviado! Te responderemos a la brevedad.');
      reiniciar();
    } catch (err) {
      setErrorEnvio(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const props = (campo) => ({ id: campo, value: valores[campo], onChange: manejarCambio, onBlur: manejarBlur, error: errores[campo] });

  return (
    <section className="seccion seccion-oscura">
      <div className="container">
        <TituloSeccion as="h1" titulo="Contacto" subtitulo="Escríbenos tus dudas, sugerencias o pedidos especiales" />
        <div className="row g-4 g-lg-5">
          <div className="col-lg-6">
            <form className="form-iron ancho" onSubmit={enviar} noValidate>
              {errorEnvio && <div className="alert alert-danger">{errorEnvio}</div>}
              <Campo etiqueta="Nombre completo" requerido placeholder="Ej: Juan Pérez" autoComplete="name" {...props('nombre')} />
              <Campo etiqueta="Correo electrónico" requerido type="email" placeholder="nombre@correo.cl" autoComplete="email" {...props('email')} />
              <Campo etiqueta="Asunto" requerido placeholder="Ej: Consulta por un producto" {...props('asunto')} />
              <Campo etiqueta="Mensaje" requerido as="textarea" rows={5} placeholder="Escribe tu mensaje" {...props('mensaje')} />
              <button type="submit" className="btn btn-iron w-100" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar mensaje'}</button>
            </form>
          </div>
          <div className="col-lg-6">
            <h2 className="h4">Visítanos</h2>
            <hr className="divisor-dorado divisor-izquierda" />
            <p><i className="bi bi-geo-alt-fill texto-dorado me-2"></i>Av. Providencia 1234, Santiago, Chile</p>
            <p><i className="bi bi-telephone-fill texto-dorado me-2"></i>+56 9 1234 5678</p>
            <p><i className="bi bi-clock-fill texto-dorado me-2"></i>Lunes a Sábado: 10:00 - 20:00 hrs</p>
            <p><i className="bi bi-envelope-fill texto-dorado me-2"></i>hola@ironblade.cl</p>
            <div className="video-wrapper mt-4">
              <iframe
                src="https://www.google.com/maps?q=Av.+Providencia+1234,+Providencia,+Santiago&output=embed"
                className="mapa-embed" loading="lazy" title="Ubicación The Iron Blade Barbershop"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
