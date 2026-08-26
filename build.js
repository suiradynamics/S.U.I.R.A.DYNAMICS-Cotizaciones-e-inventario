const { execSync } = require('child_process');

console.log('--- INICIANDO BUILD PERSONALIZADO DE NEXT.JS ---');
execSync('npx next build', { stdio: 'inherit' });

console.log('--- EJECUTANDO ADAPTADOR DE CLOUDFLARE ---');
// Usamos require para invocar el script del adaptador de forma interna y nativa de Node
require('./node_modules/@opennextjs/cloudflare/dist/index.js');

console.log('--- ¡PROCESO COMPLETADO CON ÉXITO! ---');

