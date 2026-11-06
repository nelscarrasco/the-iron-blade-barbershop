// Configuración de Karma: ejecuta las pruebas unitarias escritas con Jasmine
// en un navegador real (Chrome / Chromium / Edge).
const fs = require('fs');
const path = require('path');
const { createInstrumenter, defaultOpts } = require('istanbul-lib-instrument');

// --- Navegador -------------------------------------------------------------
// karma-chrome-launcher busca Google Chrome. Si no está instalado, se usa
// Microsoft Edge (que también es Chromium) en Windows, o el Chromium de
// Playwright si existe. También se puede indicar uno con la variable CHROME_BIN.
function buscarNavegador() {
  if (process.env.CHROME_BIN) return;
  const candidatos = [];
  if (process.platform === 'win32') {
    const pf = process.env.PROGRAMFILES || 'C:\\Program Files';
    const pf86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)';
    const local = process.env.LOCALAPPDATA || '';
    candidatos.push(
      path.join(pf, 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(pf86, 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(local, 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(pf86, 'Microsoft\\Edge\\Application\\msedge.exe'),
      path.join(pf, 'Microsoft\\Edge\\Application\\msedge.exe')
    );
  } else if (process.platform === 'darwin') {
    candidatos.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  } else {
    candidatos.push('/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser');
    try { candidatos.push(require('playwright').chromium.executablePath()); } catch { /* opcional */ }
  }
  const encontrado = candidatos.find((ruta) => ruta && fs.existsSync(ruta));
  if (encontrado) process.env.CHROME_BIN = encontrado;
}
buscarNavegador();

// --- Cobertura -------------------------------------------------------------
// Plugin de esbuild que instrumenta con Istanbul el código de src/ (no las
// pruebas) para que karma-coverage pueda medir qué líneas se ejecutaron.
function pluginCobertura() {
  const instrumentador = createInstrumenter({
    esModules: true,
    compact: false,
    parserPlugins: [...defaultOpts.parserPlugins, 'jsx']
  });
  return {
    name: 'cobertura-istanbul',
    setup(build) {
      build.onLoad({ filter: /[\\/]src[\\/].+\.jsx?$/ }, async (args) => {
        if (/[\\/]__tests__[\\/]|[\\/]main\.jsx$/.test(args.path)) return undefined;
        const codigo = await fs.promises.readFile(args.path, 'utf8');
        return { contents: instrumentador.instrumentSync(codigo, args.path), loader: 'jsx' };
      });
    }
  };
}

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],

    // Todas las pruebas están en src/__tests__ y terminan en .spec.js
    // (se usa .js también para las pruebas con JSX: esbuild las compila igual)
    files: [{ pattern: 'src/__tests__/**/*.spec.js', watched: true }],
    preprocessors: { 'src/__tests__/**/*.spec.js': ['esbuild'] },

    // esbuild compila JSX e importaciones de módulos para el navegador
    esbuild: {
      jsx: 'automatic',
      loader: { '.js': 'jsx' },
      define: {
        'process.env.NODE_ENV': '"development"',
        'import.meta.env': '{"VITE_API_URL":"http://localhost:3001"}'
      },
      plugins: [pluginCobertura()],
      sourcemap: true
    },

    // spec: lista cada prueba en la terminal · kjhtml: reporte visual de Jasmine en el navegador
    reporters: ['spec', 'kjhtml', 'coverage'],
    specReporter: { suppressSkipped: true, showSpecTiming: false },
    client: {
      clearContext: false, // deja visible el reporte HTML de Jasmine
      jasmine: { random: false }
    },

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'json-summary', subdir: '.', file: 'resumen-cobertura.json' },
        { type: 'text-summary' }
      ]
    },

    browsers: ['ChromeHeadlessSinSandbox'],
    customLaunchers: {
      ChromeHeadlessSinSandbox: { base: 'ChromeHeadless', flags: ['--no-sandbox'] },
      ChromeVisible: { base: 'Chrome', flags: ['--no-sandbox'] }
    },

    singleRun: true,
    autoWatch: false,
    browserNoActivityTimeout: 60000,
    logLevel: config.LOG_WARN
  });
};
