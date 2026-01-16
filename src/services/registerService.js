import { functions } from "../firebase/config";
import { httpsCallable } from "firebase/functions";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Cache para evitar llamadas duplicadas con los mismos datos
const validationCache = new Map();
const CACHE_DURATION = 5000; // 5 segundos

/**
 * Valida los datos de registro usando la Cloud Function
 * Si la Cloud Function no está disponible, retorna success: true para permitir validación local
 * Incluye cache para evitar llamadas duplicadas
 */
export const validateRegisterData = async (registerData) => {
  try {
    // Crear una clave única para el cache basada en los datos
    const cacheKey = `${registerData.id}-${registerData.hash}`;
    const cached = validationCache.get(cacheKey);

    // Si hay un resultado en cache reciente, retornarlo
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.result;
    }

    // Llamar a la Cloud Function para validar
    const validateFunction = httpsCallable(functions, "validateRegisterData");
    const result = await validateFunction({
      avatarCode: registerData.avatarCode,
      score: registerData.score,
      horaIni: registerData.horaIni,
      horaFin: registerData.horaFin,
      hash: registerData.hash,
      id: registerData.id,
    });

    const resultData = result.data;

    // Guardar en cache solo si fue exitoso
    if (resultData.success) {
      validationCache.set(cacheKey, {
        result: resultData,
        timestamp: Date.now(),
      });

      // Limpiar cache después de un tiempo
      setTimeout(() => {
        validationCache.delete(cacheKey);
      }, CACHE_DURATION);
    }

    return resultData;
  } catch (error) {
    console.error("Error al validar datos con Cloud Function:", error);
    // Si la función no existe o hay un error, permitir validación local
    // La validación del ID se hará en checkIdExists
    console.warn("Cloud Function no disponible, usando validación local");
    return {
      success: true, // Permitir continuar con validación local
      warning: "Validación local (Cloud Function no disponible)",
    };
  }
};

/**
 * Verifica si el ID ya existe en partidas_registradas y si ya tiene datos completos
 * Los IDs deben existir previamente en Firestore pero vacíos (solo como tokens)
 * Retorna true si el documento existe Y ya tiene datos (nombre, email), false si está vacío o no existe
 */
export const checkIdExists = async (id) => {
  try {
    // Buscar en scores donde el ID es el documento
    const idRef = doc(db, "scores", id);
    const idDoc = await getDoc(idRef);

    if (!idDoc.exists()) {
      // El ID no existe, esto es un error porque deberían existir previamente
      return {
        exists: false,
        hasData: false,
        error: "ID no encontrado en Firestore",
      };
    }

    const data = idDoc.data();
    // Verificar si ya tiene datos completos (nombre y email)
    const hasData = !!(data.nombre && data.email);

    return { exists: true, hasData: hasData };
  } catch (error) {
    console.error("Error al verificar ID:", error);
    return { exists: false, hasData: false, error: error.message };
  }
};

/**
 * Guarda el registro en Firestore
 * Actualiza el documento existente (que debería estar vacío) con los datos del registro
 */
export const saveRegisterData = async (registerData, userData) => {
  try {
    // Validar que registerData tenga todos los campos necesarios
    if (
      !registerData ||
      !registerData.id ||
      !registerData.avatarCode ||
      registerData.score === undefined ||
      !registerData.horaIni ||
      !registerData.horaFin
    ) {
      throw new Error(
        "Datos de registro incompletos. Faltan campos requeridos."
      );
    }

    // Validar que userData tenga los campos necesarios
    if (!userData || !userData.nombre || !userData.email) {
      throw new Error("Datos de usuario incompletos. Faltan nombre o email.");
    }

    const { avatarCode, score, horaIni, horaFin, id } = registerData;
    const { nombre, email } = userData;

    // Calcular tiempo de juego en segundos
    const tiempoJuego = Math.floor(
      (new Date(horaFin).getTime() - new Date(horaIni).getTime()) / 1000
    );

    // Actualizar el documento existente en scores (el ID es el documento)
    const scoreRef = doc(db, "scores", id);
    await setDoc(
      scoreRef,
      {
        id: id,
        email: email,
        nombre: nombre,
        score: score,
        avatarCode: avatarCode,
        horaInicio: horaIni,
        horaFin: horaFin,
        tiempoJuego: tiempoJuego,
        partidaId: id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        registrationMethod: "url",
      },
      { merge: true }
    ); // merge: true para actualizar sin sobrescribir campos existentes

    // Guardar o actualizar en la colección 'users' usando el email como identificador
    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    const userDataToSave = {
      email: email,
      nombre: nombre,
      lastScore: score,
      lastAvatarCode: avatarCode,
      lastScoreDate: horaFin,
      updatedAt: new Date().toISOString(),
      registrationMethod: "url",
    };

    if (!userDoc.exists()) {
      // Crear nuevo documento de usuario
      userDataToSave.createdAt = new Date().toISOString();
      await setDoc(userRef, userDataToSave);
      console.log("✅ Usuario creado en Firestore. Colección: users");
    } else {
      // Actualizar documento existente
      await setDoc(userRef, userDataToSave, { merge: true });
      console.log("✅ Usuario actualizado en Firestore. Colección: users");
    }

    return {
      success: true,
      scoreId: id,
      partidaId: id,
    };
  } catch (error) {
    console.error("Error al guardar registro:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
