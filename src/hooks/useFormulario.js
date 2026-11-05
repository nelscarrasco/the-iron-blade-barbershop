import { useState } from 'react';
import { validarFormulario } from '../utils/validaciones';

export function useFormulario(valoresIniciales, reglas) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});

  const validarCampo = (campo, nuevosValores) => {
    if (!reglas[campo]) return;
    const mensaje = reglas[campo](nuevosValores[campo], nuevosValores);
    setErrores((prev) => {
      const copia = { ...prev };
      if (mensaje) copia[campo] = mensaje;
      else delete copia[campo];
      return copia;
    });
  };

  const manejarCambio = (evento) => {
    const { name, value, type, checked } = evento.target;
    const nuevos = { ...valores, [name]: type === 'checkbox' ? checked : value };
    setValores(nuevos);
    if (tocados[name]) validarCampo(name, nuevos);
  };

  const manejarBlur = (evento) => {
    const { name } = evento.target;
    setTocados((prev) => ({ ...prev, [name]: true }));
    validarCampo(name, valores);
  };

  const validarTodo = () => {
    const encontrados = validarFormulario(valores, reglas);
    setErrores(encontrados);
    setTocados(Object.keys(reglas).reduce((a, c) => ({ ...a, [c]: true }), {}));
    return Object.keys(encontrados).length === 0;
  };

  const reiniciar = (nuevos = valoresIniciales) => {
    setValores(nuevos);
    setErrores({});
    setTocados({});
  };

  return { valores, setValores, errores, manejarCambio, manejarBlur, validarTodo, reiniciar };
}
