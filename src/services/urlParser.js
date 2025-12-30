/**
 * Parsea los parámetros de la URL de registro
 * Formato esperado: /registro/<avatarCode>&<score>&<hora-ini>&<hora-fin>&hash=<hash>&id=<id>
 * Ejemplo: /registro/adbc&850&2024-01-01T10:00:00Z&2024-01-01T10:05:00Z&hash=v54vfd&id=54f5gfDS4
 */
export const parseRegisterUrl = (pathname) => {
  try {
    // Remover /registro/ del inicio
    const paramsString = pathname.replace(/^\/registro\//, '');
    
    if (!paramsString) {
      return { error: 'URL vacía o inválida' };
    }

    // Separar por & para obtener los parámetros
    const parts = paramsString.split('&');
    
    if (parts.length < 6) {
      return { error: 'Faltan parámetros en la URL' };
    }

    // Los primeros 4 parámetros son: avatarCode, score, horaIni, horaFin
    const avatarCode = parts[0];
    const score = parts[1];
    const horaIni = decodeURIComponent(parts[2]);
    const horaFin = decodeURIComponent(parts[3]);

    // Los últimos dos tienen formato key=value
    let hash = '';
    let id = '';

    for (let i = 4; i < parts.length; i++) {
      if (parts[i].startsWith('hash=')) {
        hash = parts[i].replace('hash=', '');
      } else if (parts[i].startsWith('id=')) {
        id = parts[i].replace('id=', '');
      }
    }

    // Validaciones básicas
    if (!avatarCode || avatarCode.length !== 4) {
      return { error: 'Código de avatar inválido (debe ser 4 letras)' };
    }

    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum) || scoreNum < 0) {
      return { error: 'Score inválido' };
    }

    if (!horaIni || !horaFin) {
      return { error: 'Fechas de inicio o fin inválidas' };
    }

    // Validar formato de fecha ISO
    const dateIni = new Date(horaIni);
    const dateFin = new Date(horaFin);
    if (isNaN(dateIni.getTime()) || isNaN(dateFin.getTime())) {
      return { error: 'Formato de fecha inválido' };
    }

    if (!hash) {
      return { error: 'Hash no proporcionado' };
    }

    if (!id) {
      return { error: 'ID no proporcionado' };
    }

    return {
      success: true,
      data: {
        avatarCode: avatarCode.toUpperCase(),
        score: scoreNum,
        horaIni: horaIni,
        horaFin: horaFin,
        hash: hash,
        id: id
      }
    };
  } catch (error) {
    console.error('Error al parsear URL:', error);
    return { error: 'Error al procesar la URL: ' + error.message };
  }
};

