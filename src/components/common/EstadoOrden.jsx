export default function EstadoOrden({ estado }) {
  const pagada = estado === 'pagada';
  return <span className={`badge ${pagada ? 'bg-success' : 'bg-danger'}`}>{pagada ? 'Pagada' : 'Rechazada'}</span>;
}
