/**
 * Script para generar el hash de validación para URLs de registro
 * 
 * Uso: node scripts/generate-hash.js <avatarCode> <score> <horaIni> <horaFin> <id> [secretKey]
 * 
 * Ejemplo:
 * node scripts/generate-hash.js ABCD 850 "2024-01-01T10:00:00Z" "2024-01-01T10:05:00Z" "54f5gfDS4" "mi-secret-key"
 */

const crypto = require('crypto');

// Obtener argumentos de la línea de comandos
const args = process.argv.slice(2);

if (args.length < 5) {
  console.error('Uso: node generate-hash.js <avatarCode> <score> <horaIni> <horaFin> <id> [secretKey]');
  console.error('');
  console.error('Ejemplo:');
  console.error('  node generate-hash.js ABCD 850 "2024-01-01T10:00:00Z" "2024-01-01T10:05:00Z" "54f5gfDS4" "mi-secret-key"');
  process.exit(1);
}

const [avatarCode, score, horaIni, horaFin, id, secretKey] = args;

// Si no se proporciona secretKey, usar una por defecto (solo para desarrollo)
const SECRET_KEY = secretKey || process.env.SECRET_KEY || 'default-secret-key-change-in-production';

// Validar avatarCode (4 letras)
if (!/^[A-Z]{4}$/.test(avatarCode)) {
  console.error('Error: avatarCode debe ser exactamente 4 letras mayúsculas');
  process.exit(1);
}

// Validar score
const scoreNum = parseInt(score, 10);
if (isNaN(scoreNum) || scoreNum < 0) {
  console.error('Error: score debe ser un número positivo');
  process.exit(1);
}

// Generar el hash
const dataToHash = `${avatarCode}${score}${horaIni}${horaFin}${id}`;
const hash = crypto
  .createHmac('sha256', SECRET_KEY)
  .update(dataToHash)
  .digest('hex')
  .substring(0, 6); // Primeros 6 caracteres

// Generar la URL completa
const url = `/registro/${avatarCode}&${score}&${encodeURIComponent(horaIni)}&${encodeURIComponent(horaFin)}&hash=${hash}&id=${id}`;

console.log('\n=== Datos de Registro ===');
console.log(`Avatar Code: ${avatarCode}`);
console.log(`Score: ${score}`);
console.log(`Hora Inicio: ${horaIni}`);
console.log(`Hora Fin: ${horaFin}`);
console.log(`ID: ${id}`);
console.log(`\n=== Hash Generado ===`);
console.log(`Hash: ${hash}`);
console.log(`\n=== URL Completa ===`);
console.log(url);
console.log(`\n=== URL Completa (con dominio) ===`);
console.log(`https://zyn-tag.web.app${url}`);
console.log('');

