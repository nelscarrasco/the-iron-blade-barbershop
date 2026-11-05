import { Link } from 'react-router-dom';

export function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="text-center py-5" role="status">
      <div className="spinner-border texto-dorado" aria-hidden="true"></div>
      <p className="mt-3 text-secondary">{texto}</p>
    </div>
  );
}

export function MensajeError({ mensaje, alReintentar }) {
  if (!mensaje) return null;
  return (
    <div className="alert alert-danger d-flex flex-wrap align-items-center gap-2" role="alert">
      <i className="bi bi-exclamation-triangle-fill"></i>
      <span className="flex-grow-1">{mensaje}</span>
      {alReintentar && <button className="btn btn-sm btn-outline-light" onClick={alReintentar}>Reintentar</button>}
    </div>
  );
}

export function EstadoVacio({ icono = 'bi-inbox', titulo, texto, enlace, textoEnlace }) {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icono} icono-vacio`}></i>
      <h2 className="h4 mt-3">{titulo}</h2>
      {texto && <p className="text-secondary">{texto}</p>}
      {enlace && <Link to={enlace} className="btn btn-iron mt-2">{textoEnlace}</Link>}
    </div>
  );
}

export function TituloSeccion({ titulo, subtitulo, as: Etiqueta = 'h2' }) {
  return (
    <>
      <Etiqueta className="titulo-seccion">{titulo}</Etiqueta>
      <hr className="divisor-dorado" />
      {subtitulo && <p className="subtitulo-seccion">{subtitulo}</p>}
    </>
  );
}
