const { execSync } = require('child_process');

console.log('--- INICIANDO BUILD PERSONALIZADO DE NEXT.JS ---');
execSync('npx next build', { stdio: 'inherit' });

console.log('--- EJECUTANDO ADAPTADOR DE CLOUDFLARE ---');
// Ejecutamos directamente el archivo binario del paquete instalado
execSync('node node_modules/@opennextjs/cloudflare/dist/cli/index.js build', { stdio: 'inherit' });

console.log('--- ¡PROCESO COMPLETADO CON ÉXITO! ---');
