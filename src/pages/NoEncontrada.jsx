import { EstadoVacio } from '../components/common/Estados';

export default function NoEncontrada() {
  return (
    <section className="seccion seccion-oscura pagina-media">
      <EstadoVacio icono="bi-signpost-split" titulo="Página no encontrada (404)" texto="La ruta que buscas no existe." enlace="/" textoEnlace="Volver al inicio" />
    </section>
  );
}
