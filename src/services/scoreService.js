import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Obtiene todos los scores de Firestore
 */
export const getAllScores = async () => {
  try {
    const scoresRef = collection(db, 'scores');
    const scoresSnapshot = await getDocs(scoresRef);
    
    const scores = [];
    scoresSnapshot.forEach((doc) => {
      scores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: scores };
  } catch (error) {
    console.error('Error al obtener scores:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Obtiene el mejor score de cada usuario
 */
export const getBestScoresByUser = async () => {
  try {
    const result = await getAllScores();
    if (!result.success) return result;
    
    // Agrupar por email y obtener el mejor score de cada uno
    const userBestScores = {};
    
    result.data.forEach((score) => {
      const email = score.email;
      if (!userBestScores[email] || score.score > userBestScores[email].score) {
        userBestScores[email] = score;
      }
    });
    
    // Convertir objeto a array
    const bestScores = Object.values(userBestScores);
    
    return { success: true, data: bestScores };
  } catch (error) {
    console.error('Error al obtener mejores scores:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Formatea el tiempo de juego en formato legible
 */
export const formatTiempoJuego = (segundos) => {
  if (!segundos) return '0s';
  
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;
  
  if (horas > 0) {
    return `${horas}h ${minutos}m ${segs}s`;
  } else if (minutos > 0) {
    return `${minutos}m ${segs}s`;
  } else {
    return `${segs}s`;
  }
};

/**
 * Obtiene el top 3 de una fraternidad específica
 * @param {string} fraternityChar - Carácter de la fraternidad (A-P)
 * @returns {Promise} - Top 3 scores de la fraternidad
 */
export const getTopFraternity = async (fraternityChar) => {
  try {
    if (!fraternityChar) {
      return { success: false, error: 'Carácter de fraternidad requerido', data: [] };
    }

    const fraternityUpper = fraternityChar.toUpperCase();
    
    // Obtener todos los scores con datos completos
    const scoresRef = collection(db, 'scores');
    const scoresSnapshot = await getDocs(scoresRef);
    
    const fraternityScores = [];
    scoresSnapshot.forEach((doc) => {
      const data = doc.data();
      // Verificar que tenga datos completos (nombre y email) y que pertenezca a la fraternidad
      if (data.nombre && data.email && data.avatarCode && data.score) {
        const userFraternity = data.avatarCode.charAt(3)?.toUpperCase();
        if (userFraternity === fraternityUpper) {
          fraternityScores.push({
            id: doc.id,
            nombre: data.nombre,
            email: data.email,
            score: data.score || 0,
            avatarCode: data.avatarCode,
          });
        }
      }
    });
    
    // Ordenar por score descendente y tomar top 3
    fraternityScores.sort((a, b) => (b.score || 0) - (a.score || 0));
    const top3 = fraternityScores.slice(0, 3);
    
    return { success: true, data: top3 };
  } catch (error) {
    console.error('Error al obtener top de fraternidad:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Obtiene el top 3 general (de todas las fraternidades)
 * @returns {Promise} - Top 3 scores globales
 */
export const getTopGeneral = async () => {
  try {
    // Obtener todos los scores con datos completos
    const scoresRef = collection(db, 'scores');
    const scoresSnapshot = await getDocs(scoresRef);
    
    const allScores = [];
    scoresSnapshot.forEach((doc) => {
      const data = doc.data();
      // Verificar que tenga datos completos (nombre y email) y score
      if (data.nombre && data.email && data.score) {
        allScores.push({
          id: doc.id,
          nombre: data.nombre,
          email: data.email,
          score: data.score || 0,
          avatarCode: data.avatarCode,
        });
      }
    });
    
    // Ordenar por score descendente y tomar top 3
    allScores.sort((a, b) => (b.score || 0) - (a.score || 0));
    const top3 = allScores.slice(0, 3);
    
    return { success: true, data: top3 };
  } catch (error) {
    console.error('Error al obtener top general:', error);
    return { success: false, error: error.message, data: [] };
  }
};
