const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();

/**
 * Cloud Function para validar datos de registro
 * Verifica el hash usando HMAC-SHA256 y si el ID ya existe
 */
exports.validateRegisterData = functions.https.onCall(async (data, context) => {
  try {
    const { avatarCode, score, horaIni, horaFin, hash, id } = data;

    // Validar que todos los parámetros estén presentes
    if (!avatarCode || !score || !horaIni || !horaFin || !hash || !id) {
      return {
        success: false,
        error: "Faltan parámetros requeridos",
      };
    }

    // Obtener SECRET_KEY de las variables de entorno
    const SECRET_KEY = functions.config().secret?.key || process.env.SECRET_KEY;

    if (!SECRET_KEY) {
      console.error("SECRET_KEY no configurada");
      return {
        success: false,
        error: "Error de configuración del servidor",
      };
    }

    // Generar el hash esperado usando HMAC-SHA256
    const dataToHash = `${avatarCode}${score}${horaIni}${horaFin}${id}`;
    const expectedHash = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(dataToHash)
      .digest("hex")
      .substring(0, 6); // Primeros 6 caracteres del hash

    // Comparar hash
    if (hash !== expectedHash) {
      return {
        success: false,
        error: "Hash inválido. Los datos han sido modificados.",
      };
    }

    // Verificar si el ID ya existe en scores (como ID de documento)
    const db = admin.firestore();
    const scoreRef = db.collection("scores").doc(id);
    const scoreDoc = await scoreRef.get();

    if (!scoreDoc.exists) {
      return {
        success: false,
        error: "ID no encontrado. Este token no es válido.",
      };
    }

    // Verificar si el documento ya tiene datos completos (nombre y email)
    const scoreData = scoreDoc.data();
    if (scoreData.nombre && scoreData.email) {
      return {
        success: false,
        error:
          "Este registro ya ha sido utilizado. El ID ya tiene datos completos.",
      };
    }

    // Validar formato de avatarCode (4 letras)
    if (!/^[A-Z]{4}$/.test(avatarCode)) {
      return {
        success: false,
        error: "Código de avatar inválido",
      };
    }

    // Validar score (número positivo)
    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum) || scoreNum < 0) {
      return {
        success: false,
        error: "Score inválido",
      };
    }

    // Validar fechas
    const dateIni = new Date(horaIni);
    const dateFin = new Date(horaFin);
    if (isNaN(dateIni.getTime()) || isNaN(dateFin.getTime())) {
      return {
        success: false,
        error: "Formato de fecha inválido",
      };
    }

    if (dateFin <= dateIni) {
      return {
        success: false,
        error: "La fecha de fin debe ser posterior a la fecha de inicio",
      };
    }

    // Todo está válido
    return {
      success: true,
      message: "Datos válidos",
    };
  } catch (error) {
    console.error("Error en validateRegisterData:", error);
    return {
      success: false,
      error: "Error al validar los datos: " + error.message,
    };
  }
});
