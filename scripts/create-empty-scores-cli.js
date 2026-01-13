/**
 * Script alternativo para crear documentos vacíos en la colección 'scores' de Firestore
 * Usa Firebase CLI en lugar de Admin SDK (más lento pero no requiere credenciales de servicio)
 *
 * Uso:
 *   node scripts/create-empty-scores-cli.js [cantidad]
 *
 * Ejemplo:
 *   node scripts/create-empty-scores-cli.js 10
 *
 * Requiere:
 * - Firebase CLI instalado y autenticado (firebase login)
 * - Proyecto configurado (firebase use zyn-tag)
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Genera un ID único para el documento
 */
function generateScoreId() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Crea un documento vacío usando Firebase CLI
 */
function createScoreDocument(scoreId) {
  const data = {
    createdAt: new Date().toISOString(),
  };

  // Crear un archivo temporal con los datos
  const tempFile = path.join(__dirname, `temp-${scoreId}.json`);
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));

  try {
    // Usar Firebase CLI para crear el documento
    const command = `firebase firestore:set scores/${scoreId} ${tempFile} --project zyn-tag`;
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (error) {
    console.error(`Error al crear documento ${scoreId}:`, error.message);
    return false;
  } finally {
    // Eliminar archivo temporal
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

/**
 * Crea documentos vacíos en la colección 'scores'
 */
async function createEmptyScores(count = 10) {
  try {
    console.log(
      `\n🔄 Creando ${count} documentos vacíos en la colección 'scores'...\n`
    );

    // Verificar que Firebase CLI esté configurado
    try {
      execSync("firebase --version", { stdio: "pipe" });
    } catch (error) {
      console.error("❌ Error: Firebase CLI no está instalado");
      console.log("   Instala Firebase CLI: npm install -g firebase-tools");
      process.exit(1);
    }

    const createdScores = [];
    let successCount = 0;
    let failCount = 0;

    console.log("⏳ Creando documentos (esto puede tardar un momento)...\n");

    // Crear documentos uno por uno (Firebase CLI no soporta batch)
    for (let i = 0; i < count; i++) {
      const scoreId = generateScoreId();
      process.stdout.write(`  [${i + 1}/${count}] Creando ${scoreId}... `);

      if (createScoreDocument(scoreId)) {
        createdScores.push(scoreId);
        successCount++;
        console.log("✅");
      } else {
        failCount++;
        console.log("❌");
      }
    }

    // Mostrar resultados
    console.log("\n" + "=".repeat(60));
    console.log("✅ PROCESO COMPLETADO");
    console.log("=".repeat(60) + "\n");

    if (createdScores.length > 0) {
      console.log("📋 IDs creados exitosamente:\n");
      createdScores.forEach((scoreId, index) => {
        console.log(`  ${String(index + 1).padStart(3, " ")}. ${scoreId}`);
      });

      console.log("\n" + "-".repeat(60));
      console.log(`📊 Total: ${successCount} creados, ${failCount} fallidos`);
      console.log("-".repeat(60));

      // Guardar IDs en un archivo JSON
      const outputDir = path.join(__dirname, "..");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `created-scores-${timestamp}.json`;
      const filepath = path.join(outputDir, filename);

      const outputData = {
        collection: "scores",
        count: createdScores.length,
        createdAt: new Date().toISOString(),
        scoreIds: createdScores,
      };

      try {
        fs.writeFileSync(
          filepath,
          JSON.stringify(outputData, null, 2),
          "utf8"
        );
        console.log(`\n💾 IDs guardados en: ${filename}`);
        console.log(`   Ruta completa: ${filepath}\n`);
      } catch (fileError) {
        console.warn(
          `\n⚠️  No se pudo guardar el archivo: ${fileError.message}`
        );
      }

      // También mostrar los IDs en formato de lista simple
      console.log("\n📋 LISTA DE IDs (uno por línea):");
      console.log("-".repeat(60));
      createdScores.forEach((scoreId) => {
        console.log(scoreId);
      });
      console.log("-".repeat(60));

      console.log(
        "\n💡 Estos documentos están listos para ser completados por el juego."
      );
      console.log(
        "   El juego puede usar estos IDs para generar los links de registro.\n"
      );
    } else {
      console.error("\n❌ No se pudo crear ningún documento");
      process.exit(1);
    }

    return createdScores;
  } catch (error) {
    console.error("\n❌ Error al crear documentos:", error.message);
    throw error;
  }
}

// Ejecutar el script
if (require.main === module) {
  const count = process.argv[2] ? parseInt(process.argv[2], 10) : 10;

  if (isNaN(count) || count <= 0) {
    console.error(
      "❌ Error: El número de documentos debe ser un entero positivo"
    );
    process.exit(1);
  }

  createEmptyScores(count)
    .then(() => {
      console.log("✅ Script completado exitosamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error fatal:", error);
      process.exit(1);
    });
}

module.exports = { createEmptyScores, generateScoreId };
