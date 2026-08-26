const { execSync } = require('child_process');

console.log('--- INICIANDO BUILD PERSONALIZADO DE NEXT.JS ---');
execSync('npx next build', { stdio: 'inherit' });

console.log('--- EJECUTANDO ADAPTADOR DE CLOUDFLARE ---');
// Invocamos directamente el script principal del adaptador sin pasar por la CLI que rechaza argumentos
require('./node_modules/@opennextjs/cloudflare/dist/index.js');

console.log('--- ¡PROCESO COMPLETADO CON ÉXITO! ---');
