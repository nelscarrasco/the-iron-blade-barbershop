import { useEffect, useState } from 'react';

export default function Carrusel({ diapositivas, intervalo = 5000 }) {
  const [activa, setActiva] = useState(0);
  const total = diapositivas.length;

  useEffect(() => {
    const temporizador = setInterval(() => setActiva((i) => (i + 1) % total), intervalo);
    return () => clearInterval(temporizador);
  }, [total, intervalo, activa]);

  const ir = (indice) => setActiva((indice + total) % total);

  return (
    <div className="carousel slide carousel-fade" aria-roledescription="carrusel">
      <div className="carousel-indicators">
        {diapositivas.map((d, i) => (
          <button key={d.titulo} type="button" className={i === activa ? 'active' : ''} aria-current={i === activa} aria-label={`Diapositiva ${i + 1}`} onClick={() => ir(i)}></button>
        ))}
      </div>
      <div className="carousel-inner">
        {diapositivas.map((d, i) => (
          <div key={d.titulo} className={`carousel-item ${i === activa ? 'active' : ''}`}>
            <img src={d.imagen} alt={d.alt} />
            <div className="carousel-caption d-none d-md-block">
              <p>{d.etiqueta}</p>
              <h3>{d.titulo}</h3>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" onClick={() => ir(activa - 1)}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" onClick={() => ir(activa + 1)}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
}
