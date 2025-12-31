/**
 * Parsea los parámetros de la URL de registro
 * Formato esperado: /registro/<avatarCode>&<score>&<hora-ini>&<hora-fin>&hash=<hash>&id=<id>
 * Ejemplo: /registro/adbc&850&2024-01-01T10:00:00Z&2024-01-01T10:05:00Z&hash=v54vfd&id=54f5gfDS4
 */
export const parseRegisterUrl = (pathname) => {
  try {
    // Decodificar el pathname completo primero para manejar caracteres codificados como %3A
    // Algunos navegadores ya decodifican el pathname, otros no, así que lo hacemos explícitamente
    let decodedPathname = pathname;
    try {
      // Intentar decodificar, si falla usar el original
      decodedPathname = decodeURIComponent(pathname);
    } catch (e) {
      // Si ya está decodificado, usar el original
      decodedPathname = pathname;
    }

    // Remover /registro/ del inicio
    // Con HashRouter, el pathname viene sin el hash (#), solo la ruta
    const paramsString = decodedPathname
      .replace(/^\/TAG-Register-score\/registro\//, "")
      .replace(/^\/registro\//, "");

    if (!paramsString) {
      return { error: "URL vacía o inválida" };
    }

    // Separar por & para obtener los parámetros
    const parts = paramsString.split("&");

    if (parts.length < 6) {
      return { error: "Faltan parámetros en la URL" };
    }

    // Los primeros 4 parámetros son: avatarCode, score, horaIni, horaFin
    // Decodificar cada parte por si acaso tiene caracteres codificados (como %3A para :)
    // Usar try-catch porque si ya están decodificados, decodeURIComponent puede fallar
    let avatarCode, score, horaIni, horaFin;
    try {
      avatarCode = decodeURIComponent(parts[0]);
      score = decodeURIComponent(parts[1]);
      horaIni = decodeURIComponent(parts[2]);
      horaFin = decodeURIComponent(parts[3]);
    } catch (e) {
      // Si ya están decodificados, usar directamente
      avatarCode = parts[0];
      score = parts[1];
      horaIni = parts[2];
      horaFin = parts[3];
    }

    // Los últimos dos tienen formato key=value
    let hash = "";
    let id = "";

    for (let i = 4; i < parts.length; i++) {
      if (parts[i].startsWith("hash=")) {
        // Decodificar el valor del hash también
        try {
          hash = decodeURIComponent(parts[i].replace("hash=", ""));
        } catch (e) {
          hash = parts[i].replace("hash=", "");
        }
      } else if (parts[i].startsWith("id=")) {
        // Decodificar el valor del id también
        try {
          id = decodeURIComponent(parts[i].replace("id=", ""));
        } catch (e) {
          id = parts[i].replace("id=", "");
        }
      }
    }

    // Validaciones básicas
    if (!avatarCode || avatarCode.length !== 4) {
      return { error: "Código de avatar inválido (debe ser 4 letras)" };
    }

    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum) || scoreNum < 0) {
      return { error: "Score inválido" };
    }

    if (!horaIni || !horaFin) {
      return { error: "Fechas de inicio o fin inválidas" };
    }

    // Validar formato de fecha ISO
    const dateIni = new Date(horaIni);
    const dateFin = new Date(horaFin);
    if (isNaN(dateIni.getTime()) || isNaN(dateFin.getTime())) {
      return { error: "Formato de fecha inválido" };
    }

    if (!hash) {
      return { error: "Hash no proporcionado" };
    }

    if (!id) {
      return { error: "ID no proporcionado" };
    }

    return {
      success: true,
      data: {
        avatarCode: avatarCode.toUpperCase(),
        score: scoreNum,
        horaIni: horaIni,
        horaFin: horaFin,
        hash: hash,
        id: id,
      },
    };
  } catch (error) {
    console.error("Error al parsear URL:", error);
    return { error: "Error al procesar la URL: " + error.message };
  }
};
