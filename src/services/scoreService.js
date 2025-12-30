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

