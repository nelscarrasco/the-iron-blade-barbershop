// PRUEBAS CON MOCKS DE LA API
// No se usa json-server: se reemplaza fetch y las funciones de la API por
// espías de Jasmine (spyOn) para controlar sus respuestas.
import { crearRecurso, peticion, ApiError, API_URL } from '../api/cliente';
import { productosApi, ordenesApi, usuariosApi } from '../api';
import { procesarCompra } from '../services/compra';

function respuestaJson(datos, estado = 200) {
  return Promise.resolve(new Response(JSON.stringify(datos), { status: estado, headers: { 'Content-Type': 'application/json' } }));
}

describe('Capa de API (fetch simulado)', () => {
  it('listar arma la URL con los filtros y hace un GET', async () => {
    const fetchFalso = spyOn(window, 'fetch').and.returnValue(respuestaJson([{ id: 1 }]));
    const resultado = await crearRecurso('productos').listar({ categoriaId: 1, q: '' });

    expect(resultado).toEqual([{ id: 1 }]);
    const [url, opciones] = fetchFalso.calls.mostRecent().args;
    expect(url).toBe(`${API_URL}/productos?categoriaId=1`);
    expect(opciones.method).toBeUndefined(); // GET por defecto
  });

  it('crear hace un POST enviando los datos como JSON', async () => {
    const fetchFalso = spyOn(window, 'fetch').and.returnValue(respuestaJson({ id: 9, nombre: 'Gel' }, 201));
    await crearRecurso('productos').crear({ nombre: 'Gel' });

    const [url, opciones] = fetchFalso.calls.mostRecent().args;
    expect(url).toBe(`${API_URL}/productos`);
    expect(opciones.method).toBe('POST');
    expect(JSON.parse(opciones.body)).toEqual({ nombre: 'Gel' });
  });

  it('lanza ApiError con un mensaje claro si json-server no está corriendo', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new TypeError('Failed to fetch')));
    await expectAsync(peticion('/productos')).toBeRejectedWith(jasmine.any(ApiError));
    await expectAsync(peticion('/productos')).toBeRejectedWithError(ApiError, /No se pudo conectar con la API/);
  });

  it('lanza ApiError con el código HTTP cuando la respuesta no es exitosa', async () => {
    spyOn(window, 'fetch').and.returnValue(respuestaJson({}, 404));
    try {
      await peticion('/productos/999');
      fail('debía lanzar un error');
    } catch (error) {
      expect(error.estado).toBe(404);
    }
  });

  it('buscarPorEmail normaliza el correo y devuelve null si no existe', async () => {
    const fetchFalso = spyOn(window, 'fetch').and.returnValue(respuestaJson([]));
    const resultado = await usuariosApi.buscarPorEmail('  Usuario@IronBlade.CL ');

    expect(resultado).toBeNull();
    expect(fetchFalso.calls.mostRecent().args[0]).toBe(`${API_URL}/usuarios?email=usuario%40ironblade.cl`);
  });
});

describe('Proceso de compra (servicios simulados)', () => {
  const productos = [
    { id: 1, nombre: 'Corte Clásico', precio: 9000, precioOferta: null, stock: 5, imagen: '' },
    { id: 2, nombre: 'Kit de Afeitado', precio: 24990, precioOferta: 19990, stock: 1, imagen: '' }
  ];
  const datos = { nombre: 'Ana', apellidos: 'Pérez', email: 'ANA@correo.cl', telefono: '', tipoEntrega: 'retiro', medioPago: 'debito' };

  beforeEach(() => {
    spyOn(productosApi, 'listar').and.resolveTo(productos);
    spyOn(productosApi, 'modificar').and.resolveTo({});
    spyOn(ordenesApi, 'crear').and.callFake((orden) => Promise.resolve({ id: 10, ...orden }));
  });

  it('con pago aprobado crea la orden "pagada" y descuenta el stock', async () => {
    const orden = await procesarCompra({ items: [{ productoId: 1, nombre: 'Corte Clásico', cantidad: 2 }], datos, usuarioId: 2 });

    expect(orden.estado).toBe('pagada');
    expect(orden.total).toBe(18000);
    expect(orden.cliente.email).toBe('ana@correo.cl');
    expect(productosApi.modificar).toHaveBeenCalledOnceWith(1, { stock: 3 });
  });

  it('con pago rechazado guarda la orden "rechazada" y no toca el stock', async () => {
    const orden = await procesarCompra({ items: [{ productoId: 1, nombre: 'Corte Clásico', cantidad: 1 }], datos, simularRechazo: true });

    expect(orden.estado).toBe('rechazada');
    expect(orden.motivo).toContain('rechazó');
    expect(productosApi.modificar).not.toHaveBeenCalled();
  });

  it('rechaza la compra si no hay stock suficiente', async () => {
    const orden = await procesarCompra({ items: [{ productoId: 2, nombre: 'Kit de Afeitado', cantidad: 3 }], datos });

    expect(orden.estado).toBe('rechazada');
    expect(orden.motivo).toContain('Stock insuficiente');
    expect(productosApi.modificar).not.toHaveBeenCalled();
  });
});
