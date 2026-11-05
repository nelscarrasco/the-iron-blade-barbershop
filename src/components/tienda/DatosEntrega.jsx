export default function DatosEntrega({ orden }) {
  const { cliente, entrega } = orden;
  const fila = (etiqueta, valor) => (
    <div className="col-md-4 col-sm-6 mb-3">
      <div className="small text-secondary">{etiqueta}</div>
      <div className="campo-lectura">{valor || '—'}</div>
    </div>
  );
  return (
    <>
      <h3 className="h6 mt-3">Datos del cliente</h3>
      <div className="row">
        {fila('Nombre', cliente.nombre)}
        {fila('Apellidos', cliente.apellidos)}
        {fila('Correo', cliente.email)}
      </div>
      <h3 className="h6">{entrega.tipo === 'despacho' ? 'Dirección de entrega' : 'Retiro en local'}</h3>
      {entrega.tipo === 'despacho' ? (
        <div className="row">
          {fila('Calle', entrega.calle)}
          {fila('Departamento', entrega.departamento)}
          {fila('Región', entrega.region)}
          {fila('Comuna', entrega.comuna)}
          <div className="col-12 mb-3">
            <div className="small text-secondary">Indicaciones</div>
            <div className="campo-lectura">{entrega.indicaciones || '—'}</div>
          </div>
        </div>
      ) : (
        <p className="text-secondary">Retiras en Av. Providencia 1234, Santiago (Lun a Sáb, 10:00 - 20:00).</p>
      )}
    </>
  );
}
