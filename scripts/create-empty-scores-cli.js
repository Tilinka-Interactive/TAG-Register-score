/**
 * Script para crear documentos vacíos en la colección 'scores' de Firestore
 * Usa Firebase Admin SDK
 *
 * Uso:
 *   node scripts/create-empty-scores-cli.js [cantidad]
 *
 * Ejemplo:
 *   node scripts/create-empty-scores-cli.js 10
 *
 * Requiere:
 * - firebase-admin instalado: npm install firebase-admin
 * - Archivo de credenciales: zyn-tag-credentials.json en la raíz del proyecto
 */

let admin;
try {
  admin = require("firebase-admin");
} catch (error) {
  console.error("❌ Error: firebase-admin no está instalado");
  console.log("   Instala firebase-admin: npm install firebase-admin");
  process.exit(1);
}

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
 * Inicializa Firebase Admin SDK
 */
function initializeFirebase() {
  if (admin.apps.length === 0) {
    const credentialsPath = path.join(
      __dirname,
      "..",
      "zyn-tag-credentials.json"
    );

    if (!fs.existsSync(credentialsPath)) {
      throw new Error(
        `❌ No se encontró el archivo de credenciales: ${credentialsPath}\n` +
          "   Asegúrate de tener el archivo zyn-tag-credentials.json en la raíz del proyecto."
      );
    }

    const serviceAccount = require(credentialsPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin SDK inicializado\n");
  }

  return admin.firestore();
}

/**
 * Crea un documento vacío usando Firebase Admin SDK
 */
async function createScoreDocument(db, scoreId) {
  try {
    const data = {
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("scores").doc(scoreId).set(data);
    return true;
  } catch (error) {
    console.error(`Error al crear documento ${scoreId}:`, error.message);
    return false;
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

    // Inicializar Firebase Admin SDK
    const db = initializeFirebase();

    const createdScores = [];
    let successCount = 0;
    let failCount = 0;

    console.log("⏳ Creando documentos...\n");

    // Crear documentos usando batch para mejor rendimiento
    const batchSize = 500; // Firestore permite máximo 500 operaciones por batch
    const batches = [];
    let currentBatch = db.batch();
    let batchCount = 0;
    const scoreIds = [];

    // Generar todos los IDs primero
    for (let i = 0; i < count; i++) {
      scoreIds.push(generateScoreId());
    }

    // Preparar batches
    for (let i = 0; i < scoreIds.length; i++) {
      const scoreId = scoreIds[i];
      const docRef = db.collection("scores").doc(scoreId);
      currentBatch.set(docRef, {
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      batchCount++;

      // Si el batch está lleno o es el último, agregarlo a la lista
      if (batchCount >= batchSize || i === scoreIds.length - 1) {
        batches.push({ batch: currentBatch, count: batchCount });
        currentBatch = db.batch();
        batchCount = 0;
      }
    }

    // Ejecutar todos los batches
    console.log("⏳ Guardando en Firestore...\n");
    for (let i = 0; i < batches.length; i++) {
      try {
        await batches[i].batch.commit();
        const batchSuccessCount = batches[i].count;
        successCount += batchSuccessCount;
        console.log(
          `  ✅ Batch ${i + 1}/${
            batches.length
          } guardado (${batchSuccessCount} documentos)`
        );
      } catch (error) {
        const batchFailCount = batches[i].count;
        failCount += batchFailCount;
        console.error(`  ❌ Error en batch ${i + 1}:`, error.message);
      }
    }

    // Agregar todos los IDs generados a createdScores
    createdScores.push(...scoreIds);

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
        fs.writeFileSync(filepath, JSON.stringify(outputData, null, 2), "utf8");
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
