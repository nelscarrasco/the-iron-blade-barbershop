export default function BarrasHorizontales({ datos, formato = (v) => v }) {
  const maximo = Math.max(...datos.map((d) => d.valor), 1);
  if (!datos.length) return <p className="text-secondary">Sin datos.</p>;
  return (
    <ul className="list-unstyled mb-0">
      {datos.map((d) => (
        <li key={d.etiqueta} className="mb-2">
          <div className="d-flex justify-content-between small"><span>{d.etiqueta}</span><strong>{formato(d.valor)}</strong></div>
          <div className="progress progress-iron" role="progressbar" aria-label={d.etiqueta} aria-valuenow={d.valor} aria-valuemin="0" aria-valuemax={maximo}>
            <div className="progress-bar" style={{ width: `${(d.valor / maximo) * 100}%` }}></div>
          </div>
        </li>
      ))}
    </ul>
  );
}
