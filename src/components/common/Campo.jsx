export default function Campo({ id, etiqueta, error, requerido = false, opcional = false, as = 'input', opciones, ayuda, children, ...props }) {
  const clase = as === 'select' ? 'form-select' : 'form-control';
  const claseEstado = error ? ' is-invalid input-invalido' : '';
  const nombre = props.name ?? id;
  const comunes = { id, name: nombre, className: clase + claseEstado, 'aria-invalid': Boolean(error), 'aria-describedby': error ? `error-${id}` : undefined, ...props };

  return (
    <div className="mb-3">
      {etiqueta && (
        <label htmlFor={id}>
          {etiqueta}
          {requerido && <span className="text-danger ms-1">*</span>}
          {opcional && <span className="text-secondary ms-1 small">(opcional)</span>}
        </label>
      )}
      {as === 'select' ? (
        <select {...comunes}>
          {children ?? opciones?.map((op) => (
            <option key={op.valor ?? op} value={op.valor ?? op}>{op.texto ?? op}</option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea rows={3} {...comunes}></textarea>
      ) : (
        <input {...comunes} />
      )}
      {ayuda && !error && <div className="form-text text-secondary">{ayuda}</div>}
      {error && <span className="mensaje-error d-block" id={`error-${id}`} role="alert">{error}</span>}
    </div>
  );
}
