import { useNavigate } from 'react-router-dom';

export default function BotonVolver({ texto = 'Volver', className = 'btn btn-iron-outline btn-sm' }) {
  const navegar = useNavigate();
  return (
    <button type="button" className={className} onClick={() => navegar(-1)}>
      <i className="bi bi-arrow-left me-1"></i>{texto}
    </button>
  );
}
