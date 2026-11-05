import { validarConfirmacion, validarEmail, validarFormulario, validarNumero, validarPassword, validarRun, validarTelefono } from '../utils/validaciones';

describe('validaciones de formularios', () => {
  it('valida el RUN chileno con dígito verificador', () => {
    expect(validarRun('11111111-1')).toBe('');
    expect(validarRun('19876543-0')).toBe('');
    expect(validarRun('19876543-2')).toMatch(/dígito verificador/);
    expect(validarRun('123')).toMatch(/Formato/);
  });

  it('exige formato de correo válido', () => {
    expect(validarEmail('nombre@correo.cl')).toBe('');
    expect(validarEmail('nombre@correo')).toMatch(/inválido/);
    expect(validarEmail('')).toMatch(/obligatorio/);
  });

  it('exige contraseña con letras y números y que la confirmación coincida', () => {
    expect(validarPassword('abc')).toMatch(/6 caracteres/);
    expect(validarPassword('abcdefg')).toMatch(/letras y números/);
    expect(validarPassword('barber123')).toBe('');
    expect(validarConfirmacion('barber123', 'barber124')).toMatch(/no coinciden/);
  });

  it('teléfono opcional acepta vacío pero no un formato incorrecto', () => {
    expect(validarTelefono('', false)).toBe('');
    expect(validarTelefono('12345', false)).toMatch(/inválido/);
    expect(validarTelefono('+56912345678')).toBe('');
  });

  it('validarNumero controla enteros y mínimos', () => {
    expect(validarNumero('-1', 'Stock', { entero: true })).toMatch(/menor a 0/);
    expect(validarNumero('2.5', 'Stock', { entero: true })).toMatch(/entero/);
    expect(validarNumero('0', 'Precio', { permitirCero: false })).toMatch(/mayor a 0/);
  });

  it('validarFormulario devuelve solo los campos con error', () => {
    const errores = validarFormulario({ email: 'malo', password: 'barber123' }, { email: validarEmail, password: validarPassword });
    expect(Object.keys(errores)).toEqual(['email']);
  });
});
