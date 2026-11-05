const SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_CL = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;

export function validarNombre(valor, etiqueta = 'El nombre') {
  const v = (valor ?? '').trim();
  if (v === '') return `${etiqueta} es obligatorio.`;
  if (v.length < 2) return `${etiqueta} debe tener al menos 2 caracteres.`;
  if (!SOLO_LETRAS.test(v)) return `${etiqueta} solo puede contener letras y espacios.`;
  return '';
}

export function validarEmail(valor) {
  const v = (valor ?? '').trim();
  if (v === '') return 'El correo es obligatorio. Ej: nombre@correo.cl';
  if (!EMAIL.test(v)) return 'Formato de correo inválido. Sugerencia: nombre@correo.cl';
  return '';
}

export function validarPassword(valor) {
  const v = valor ?? '';
  if (v === '') return 'La contraseña es obligatoria.';
  if (v.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  if (!/[a-zA-Z]/.test(v) || !/[0-9]/.test(v)) return 'La contraseña debe combinar letras y números. Ej: barber123';
  return '';
}

export function validarConfirmacion(password, confirmacion) {
  if (!confirmacion) return 'Debes repetir la contraseña.';
  if (password !== confirmacion) return 'Las contraseñas no coinciden.';
  return '';
}

export function validarTelefono(valor, obligatorio = true) {
  const v = (valor ?? '').trim();
  if (v === '') return obligatorio ? 'El teléfono es obligatorio. Ej: +56912345678' : '';
  if (!TELEFONO_CL.test(v)) return 'Teléfono inválido. Sugerencia: +56912345678 o 912345678';
  return '';
}

export function validarRun(valor) {
  const v = (valor ?? '').trim().replace(/\./g, '').toUpperCase();
  if (v === '') return 'El RUN es obligatorio. Ej: 12345678-5';
  if (!/^\d{7,8}-[\dK]$/.test(v)) return 'Formato de RUN inválido. Ej: 12345678-5 (sin puntos, con guión)';
  const [cuerpo, dv] = v.split('-');
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  if (dv !== dvEsperado) return 'El dígito verificador del RUN no es válido.';
  return '';
}

export function validarRequerido(valor, etiqueta, minimo = 0) {
  const v = String(valor ?? '').trim();
  if (v === '') return `El campo ${etiqueta} es obligatorio.`;
  if (minimo && v.length < minimo) return `${etiqueta} debe tener al menos ${minimo} caracteres.`;
  return '';
}

export function validarNumero(valor, etiqueta, { minimo = 0, entero = false, permitirCero = true } = {}) {
  if (valor === '' || valor === null || valor === undefined) return `El campo ${etiqueta} es obligatorio.`;
  const n = Number(valor);
  if (isNaN(n)) return `${etiqueta} debe ser un número.`;
  if (entero && !Number.isInteger(n)) return `${etiqueta} debe ser un número entero.`;
  if (!permitirCero && n <= 0) return `${etiqueta} debe ser mayor a 0.`;
  if (n < minimo) return `${etiqueta} no puede ser menor a ${minimo}.`;
  return '';
}

export function validarFechaFutura(valor) {
  if (!valor) return 'Debes seleccionar una fecha.';
  const [a, m, d] = valor.split('-').map(Number);
  const fecha = new Date(a, m - 1, d);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fecha < hoy) return 'La fecha no puede ser anterior a hoy.';
  return '';
}

export function validarFormulario(valores, reglas) {
  const errores = {};
  for (const campo of Object.keys(reglas)) {
    const mensaje = reglas[campo](valores[campo], valores);
    if (mensaje) errores[campo] = mensaje;
  }
  return errores;
}
