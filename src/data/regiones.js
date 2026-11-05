export const REGIONES = [
  { nombre: 'Región Metropolitana de Santiago', comunas: ['Cerrillos', 'La Florida', 'Las Condes', 'Maipú', 'Ñuñoa', 'Providencia', 'Puente Alto', 'San Miguel', 'Santiago', 'Vitacura'] },
  { nombre: 'Región de Valparaíso', comunas: ['Quilpué', 'San Antonio', 'Valparaíso', 'Villa Alemana', 'Viña del Mar'] },
  { nombre: 'Región del Biobío', comunas: ['Chiguayante', 'Concepción', 'Los Ángeles', 'Penco', 'Talcahuano', 'Tomé'] },
  { nombre: "Región del Libertador General Bernardo O'Higgins", comunas: ['Machalí', 'Rancagua', 'San Fernando'] },
  { nombre: 'Región del Maule', comunas: ['Curicó', 'Linares', 'Talca'] },
  { nombre: 'Región de La Araucanía', comunas: ['Angol', 'Temuco', 'Villarrica'] },
  { nombre: 'Región de Coquimbo', comunas: ['Coquimbo', 'La Serena', 'Ovalle'] },
  { nombre: 'Región de Antofagasta', comunas: ['Antofagasta', 'Calama', 'Tocopilla'] }
];

export function comunasDe(region) {
  return REGIONES.find((r) => r.nombre === region)?.comunas ?? [];
}

export const COSTO_DESPACHO = 2990;
