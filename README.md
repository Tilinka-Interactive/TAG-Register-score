# TAG-Register-score

Proyecto de registro y puntuación para TAG - Level Up by ZYN

## Descripción

Aplicación web React responsive para registro de puntuaciones. **Solo se permite el registro mediante URL válida con parámetros**.

### Flujo de Registro

**Registro por URL** (`/registro/ABCD&850&...`):

- Animación inicial (3 segundos) mientras se valida la URL
- Validación del hash y verificación del ID en Firestore
- Si la URL es válida: Formulario con campos para nombre completo y correo electrónico
- Opción de registro con Google
- Confirmación después del registro exitoso

**Rutas inválidas:**

- `/registro/` sin parámetros → Error: "Ruta inválida"
- Cualquier otra ruta no definida → Error: "Ruta No Encontrada"

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación se ejecutará en `http://localhost:5173`

## Construcción

```bash
npm run build
```

## Tecnologías

- React 18
- React Router DOM
- Vite
- Tailwind CSS
