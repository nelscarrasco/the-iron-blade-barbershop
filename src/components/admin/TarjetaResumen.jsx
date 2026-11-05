export default function TarjetaResumen({ titulo, valor, detalle, icono, color = 'primary' }) {
  return (
    <div className={`card text-bg-${color} h-100 tarjeta-resumen`}>
      <div className="card-body d-flex align-items-center gap-3">
        <i className={`bi ${icono} display-6`} aria-hidden="true"></i>
        <div>
          <div className="small text-uppercase">{titulo}</div>
          <div className="fs-3 fw-bold">{valor}</div>
          {detalle && <div className="small">{detalle}</div>}
        </div>
      </div>
    </div>
  );
}
