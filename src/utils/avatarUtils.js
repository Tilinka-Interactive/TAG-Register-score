// Importar marco genérico
import marcoGenerico from "../assets/Marco.png";

// Importar todos los avatares usando import.meta.glob de Vite
const avatarModules = import.meta.glob("../assets/avatars/*.png", {
  eager: true,
});

// Importar todos los marcos de fraternidad
const fraternityFrameModules = import.meta.glob(
  "../assets/Fraternidades/*.png",
  {
    eager: true,
  }
);

/**
 * Obtiene la ruta del avatar basado en los primeros 3 caracteres del código
 * @param {string} avatarCode - Código de 4 caracteres (3 primeros para avatar, 4to para fraternidad)
 * @returns {string|null} - Ruta del avatar o null si no existe
 */
export const getAvatarPath = (avatarCode) => {
  if (!avatarCode || avatarCode.length < 3) {
    return null;
  }

  // Tomar los primeros 3 caracteres
  const avatarPart = avatarCode.substring(0, 3).toUpperCase();

  // Buscar el avatar en los módulos importados
  const avatarPath = `../assets/avatars/${avatarPart}.png`;
  const avatarModule = avatarModules[avatarPath];

  if (avatarModule) {
    return avatarModule.default || avatarModule;
  }

  console.warn(`Avatar no encontrado: ${avatarPart}`);
  return null;
};

/**
 * Obtiene el color de fondo para la fraternidad basado en el cuarto carácter
 * @param {string} avatarCode - Código de 4 caracteres
 * @returns {string} - Color hexadecimal o clase de color
 */
export const getFraternityColor = (avatarCode) => {
  if (!avatarCode || avatarCode.length < 4) {
    return "#8B5CF6"; // Color por defecto (púrpura)
  }

  const fraternityChar = avatarCode.charAt(3).toUpperCase();

  // Mapeo de caracteres a colores (actualizados)
  const colorMap = {
    A: "#FF3B3B", // Rojo intenso
    B: "#FF8C00", // Naranja brillante
    C: "#FFD700", // Amarillo dorado
    D: "#7CFC00", // Verde lima
    E: "#00FF7F", // Verde primavera
    F: "#00CED1", // Turquesa
    G: "#00BFFF", // Azul cielo intenso
    H: "#1E90FF", // Azul fuerte
    I: "#4169E1", // Azul real
    J: "#8A2BE2", // Violeta
    K: "#FF00FF", // Magenta
    L: "#FF1493", // Rosa fuerte
    M: "#A52A2A", // Marrón rojo
    N: "#FF4500", // Rojo anaranjado
    O: "#00FF00", // Verde puro
    P: "#00FFFF", // Cian puro
    // Colores por defecto para Q-Z si se necesitan
    Q: "#8B5CF6",
    R: "#8B5CF6",
    S: "#8B5CF6",
    T: "#8B5CF6",
    U: "#8B5CF6",
    V: "#8B5CF6",
    W: "#8B5CF6",
    X: "#8B5CF6",
    Y: "#8B5CF6",
    Z: "#8B5CF6",
  };

  return colorMap[fraternityChar] || "#8B5CF6"; // Color por defecto si no está en el mapa
};

/**
 * Obtiene el nombre de la clase de color de Tailwind para la fraternidad
 * @param {string} avatarCode - Código de 4 caracteres
 * @returns {string} - Clase de color de Tailwind
 */
export const getFraternityColorClass = (avatarCode) => {
  if (!avatarCode || avatarCode.length < 4) {
    return "bg-purple-500"; // Color por defecto
  }

  const fraternityChar = avatarCode.charAt(3).toUpperCase();

  // Mapeo de caracteres a clases de color de Tailwind
  const colorClassMap = {
    A: "bg-red-400",
    B: "bg-teal-400",
    C: "bg-blue-400",
    D: "bg-green-400",
    E: "bg-yellow-400",
    F: "bg-purple-400",
    G: "bg-emerald-400",
    H: "bg-amber-400",
    I: "bg-violet-400",
    J: "bg-sky-400",
    K: "bg-orange-400",
    L: "bg-cyan-400",
    M: "bg-pink-400",
    N: "bg-lime-400",
    O: "bg-yellow-300",
    P: "bg-indigo-400",
    Q: "bg-emerald-300",
    R: "bg-rose-400",
    S: "bg-blue-300",
    T: "bg-gray-400",
    U: "bg-orange-300",
    V: "bg-teal-300",
    W: "bg-amber-500",
    X: "bg-purple-500",
    Y: "bg-blue-500",
    Z: "bg-yellow-500",
  };

  return colorClassMap[fraternityChar] || "bg-purple-500";
};

/**
 * Obtiene la ruta del marco de fraternidad basado en el cuarto carácter
 * Siempre retorna un marco (específico de fraternidad o genérico)
 * @param {string} avatarCode - Código de 4 caracteres (puede ser vacío para marco genérico)
 * @returns {string} - Ruta del marco de fraternidad o marco genérico
 */
export const getFraternityFrame = (avatarCode) => {
  // Si no hay código o es muy corto, retornar marco genérico
  if (!avatarCode || avatarCode.length < 4) {
    return marcoGenerico;
  }

  const fraternityChar = avatarCode.charAt(3).toUpperCase();

  // Buscar el marco de fraternidad en los módulos importados
  const framePath = `../assets/Fraternidades/${fraternityChar}.png`;
  const frameModule = fraternityFrameModules[framePath];

  // Si se encuentra el marco específico, usarlo
  if (frameModule) {
    return frameModule.default || frameModule;
  }

  // Si no se encuentra el marco específico, SIEMPRE usar el genérico
  return marcoGenerico;
};
