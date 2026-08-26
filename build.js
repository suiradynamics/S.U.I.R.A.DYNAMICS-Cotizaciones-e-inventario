const { execSync } = require('child_process');

console.log('--- INICIANDO BUILD PERSONALIZADO DE NEXT.JS ---');
execSync('npx next build', { stdio: 'inherit' });

console.log('--- EJECUTANDO ADAPTADOR DE CLOUDFLARE ---');
execSync('npx @opennextjs/cloudflare build', { stdio: 'inherit' });

console.log('--- ¡PROCESO COMPLETADO CON ÉXITO! ---');
