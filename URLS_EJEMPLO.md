# URLs de Ejemplo para Pruebas

## Clave Privada Configurada

La SECRET_KEY está configurada en Firebase Functions y guardada en `SECRET_KEY.txt` (NO subir a Git).

## URLs de Prueba - Localhost

### Ejemplo 1
**ID**: `yEzsdrkNsQaBqMVDzedK`
- Avatar Code: `ABCD`
- Score: `850`
- Hash: `430378`

**URL Localhost:**
```
http://localhost:5173/registro/ABCD&850&2024-01-15T10:00:00Z&2024-01-15T10:05:00Z&hash=430378&id=yEzsdrkNsQaBqMVDzedK
```

**URL Producción:**
```
https://zyn-tag.web.app/registro/ABCD&850&2024-01-15T10:00:00Z&2024-01-15T10:05:00Z&hash=430378&id=yEzsdrkNsQaBqMVDzedK
```

---

### Ejemplo 2
**ID**: `m8R6BHzWKN7JvmaybPML`
- Avatar Code: `EFGH`
- Score: `920`
- Hash: `512cd6`

**URL Localhost:**
```
http://localhost:5173/registro/EFGH&920&2024-01-15T14:30:00Z&2024-01-15T14:35:30Z&hash=512cd6&id=m8R6BHzWKN7JvmaybPML
```

**URL Producción:**
```
https://zyn-tag.web.app/registro/EFGH&920&2024-01-15T14:30:00Z&2024-01-15T14:35:30Z&hash=512cd6&id=m8R6BHzWKN7JvmaybPML
```

---

### Ejemplo 3
**ID**: `QlUlX8Rq5iwt9MD9kB5H`
- Avatar Code: `IJKL`
- Score: `750`
- Hash: `251aea`

**URL Localhost:**
```
http://localhost:5173/registro/IJKL&750&2024-01-15T18:00:00Z&2024-01-15T18:04:15Z&hash=251aea&id=QlUlX8Rq5iwt9MD9kB5H
```

**URL Producción:**
```
https://zyn-tag.web.app/registro/IJKL&750&2024-01-15T18:00:00Z&2024-01-15T18:04:15Z&hash=251aea&id=QlUlX8Rq5iwt9MD9kB5H
```

---

## ⚠️ IMPORTANTE

Antes de probar estas URLs, asegúrate de que los IDs existan en Firestore:

1. Ve a [Firebase Console](https://console.firebase.google.com/project/zyn-tag/firestore)
2. Colección: `partidas_registradas`
3. Crea documentos con estos IDs (pueden estar vacíos):
   - `yEzsdrkNsQaBqMVDzedK`
   - `m8R6BHzWKN7JvmaybPML`
   - `QlUlX8Rq5iwt9MD9kB5H`

## Generar Más URLs

Para generar más URLs de prueba:

```powershell
node scripts/generate-hash.js <avatarCode> <score> <horaIni> <horaFin> <id> "fca300b2dc2e8b911f56514f596783ae7926a9cd81fd642888ed3d66457e7f2c"
```

Ejemplo:
```powershell
node scripts/generate-hash.js MNOP 1000 "2024-01-16T12:00:00Z" "2024-01-16T12:10:00Z" "nuevo-id-aqui" "fca300b2dc2e8b911f56514f596783ae7926a9cd81fd642888ed3d66457e7f2c"
```

