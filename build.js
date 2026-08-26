const { execSync } = require('child_process');

try {
  console.log('--- Iniciando compilación de Next.js ---');
  execSync('npx next build', { stdio: 'inherit' });
  
  console.log('--- Ejecutando adaptador de Cloudflare ---');
  execSync('npx @opennextjs/cloudflare', { stdio: 'inherit' });
  
  console.log('--- ¡Compilación y empaquetado exitosos! ---');
} catch (error) {
  console.error('Error durante el proceso de compilación:', error);
  process.exit(1);
}
