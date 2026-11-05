import { Link } from 'react-router-dom';

export default function EncabezadoAdmin({ titulo, subtitulo, acciones = [] }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
      <div>
        <h1 className="h3 mb-0">{titulo}</h1>
        {subtitulo && <p className="text-secondary mb-0">{subtitulo}</p>}
      </div>
      <div className="d-flex flex-wrap gap-2">
        {acciones.map((a) => (
          <Link key={a.a} to={a.a} className={a.clase ?? 'btn btn-iron btn-sm'}>
            {a.icono && <i className={`bi ${a.icono} me-1`}></i>}{a.texto}
          </Link>
        ))}
      </div>
    </div>
  );
}
