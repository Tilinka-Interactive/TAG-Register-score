// Importar todos los avatares usando import.meta.glob de Vite
const avatarModules = import.meta.glob("../assets/avatars/*.png", {
  eager: true,
});

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

  // Mapeo de caracteres a colores
  const colorMap = {
    A: "#FF6B6B", // Rojo coral
    B: "#4ECDC4", // Turquesa
    C: "#45B7D1", // Azul claro
    D: "#96CEB4", // Verde menta
    E: "#FFEAA7", // Amarillo pastel
    F: "#DDA0DD", // Ciruela
    G: "#98D8C8", // Verde agua
    H: "#F7DC6F", // Amarillo dorado
    I: "#BB8FCE", // Púrpura claro
    J: "#85C1E2", // Azul cielo
    K: "#F8B88B", // Melocotón
    L: "#AED6F1", // Azul pastel
    M: "#F1948A", // Salmón
    N: "#82E0AA", // Verde lima
    O: "#F9E79F", // Amarillo crema
    P: "#D7BDE2", // Lavanda
    Q: "#A9DFBF", // Verde esmeralda claro
    R: "#F5B7B1", // Rosa claro
    S: "#AED6F1", // Azul bebé
    T: "#D5DBDB", // Gris claro
    U: "#FAD7A0", // Durazno
    V: "#A3E4D7", // Turquesa claro
    W: "#F8C471", // Naranja claro
    X: "#C39BD3", // Púrpura medio
    Y: "#85C1E9", // Azul claro
    Z: "#F7DC6F", // Amarillo
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
