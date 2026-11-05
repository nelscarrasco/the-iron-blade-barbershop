export default function ModalConfirmacion({ abierto, titulo, mensaje, textoConfirmar = 'Eliminar', alConfirmar, alCancelar, procesando = false }) {
  if (!abierto) return null;
  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="modal-confirmacion-titulo">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modal-iron">
            <div className="modal-header">
              <h2 className="modal-title h5" id="modal-confirmacion-titulo">{titulo}</h2>
              <button type="button" className="btn-close btn-close-white" aria-label="Cerrar" onClick={alCancelar}></button>
            </div>
            <div className="modal-body"><p className="mb-0">{mensaje}</p></div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-light" onClick={alCancelar} disabled={procesando}>Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={alConfirmar} disabled={procesando}>
                {procesando ? 'Procesando...' : textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}
