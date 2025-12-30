import { 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  collection,
  addDoc
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

/**
 * Inicia sesión con Google
 * Usa signInWithPopup que es compatible con navegadores estándar
 */
export const signInWithGoogle = async () => {
  try {
    // signInWithPopup funciona mejor que signInWithRedirect para evitar problemas de user agent
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Guardar información del usuario en Firestore
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Crear documento del usuario si no existe
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    } else {
      // Actualizar último login
      await setDoc(userRef, {
        lastLogin: new Date().toISOString()
      }, { merge: true });
    }
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    };
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Cierra sesión
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Observa cambios en el estado de autenticación
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Genera un código de 4 letras aleatorias para avatares
 */
export const generateAvatarCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return code;
};

/**
 * Genera una fraternidad aleatoria de una lista predefinida
 */
export const generateFraternidad = () => {
  const fraternidades = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
    'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
    'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'
  ];
  return fraternidades[Math.floor(Math.random() * fraternidades.length)];
};

/**
 * Guarda el registro del usuario con puntaje y datos en Firestore Database
 * Se guarda en la colección 'scores' y actualiza 'users'
 */
export const saveUserScore = async (userData) => {
  try {
    const user = auth.currentUser;
    
    // Generar puntaje aleatorio entre 100 y 1000
    const score = Math.floor(Math.random() * 901) + 100;
    
    // Generar código de avatar
    const avatarCode = generateAvatarCode();
    
    // Generar fraternidad aleatoria
    const fraternidad = generateFraternidad();
    
    // Obtener hora actual
    const horaFin = new Date().toISOString();
    
    // Obtener hora inicio
    const horaInicio = userData.horaInicio || new Date(Date.now() - 5 * 60 * 1000).toISOString();

    // Calcular tiempo de juego en segundos
    const tiempoJuego = Math.floor((new Date(horaFin).getTime() - new Date(horaInicio).getTime()) / 1000);

    // Preparar datos para guardar
    const scoreData = {
      email: userData.email,
      nombre: userData.nombre,
      fraternidad: fraternidad, // Generada automáticamente
      score: score,
      avatarCode: avatarCode,
      horaInicio: horaInicio,
      horaFin: horaFin,
      tiempoJuego: tiempoJuego, // Tiempo en segundos
      createdAt: new Date().toISOString(),
      registrationMethod: user ? 'google' : 'manual'
    };

    // Si hay usuario autenticado, agregar userId
    if (user) {
      scoreData.userId = user.uid;
    }

    // Guardar en la colección 'scores' de Firestore Database
    console.log('Guardando en Firestore Database - Colección: scores', scoreData);
    const scoreRef = await addDoc(collection(db, 'scores'), scoreData);
    console.log('✅ Guardado exitosamente en Firestore. ID del documento:', scoreRef.id);

    // Si hay usuario autenticado, también actualizar el documento del usuario
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        lastScore: score,
        lastAvatarCode: avatarCode,
        lastScoreDate: horaFin
      }, { merge: true });
      console.log('✅ Usuario actualizado en Firestore. Colección: users');
    }

    return {
      success: true,
      scoreId: scoreRef.id,
      data: {
        score,
        avatarCode,
        horaInicio,
        horaFin
      }
    };
  } catch (error) {
    console.error('❌ Error al guardar en Firestore Database:', error);
    console.error('Detalles del error:', {
      code: error.code,
      message: error.message
    });
    return {
      success: false,
      error: error.message
    };
  }
};

