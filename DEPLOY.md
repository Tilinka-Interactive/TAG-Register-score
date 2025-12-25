# Guía de Deploy - TAG Register Score

## Opción Recomendada: Vercel (Gratis + SSL + Dominio)

### Pasos para deployar en Vercel:

1. **Preparar el repositorio en GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tag-register-score.git
   git push -u origin main
   ```

2. **Deploy en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con GitHub
   - Click en "Add New Project"
   - Importa tu repositorio
   - Vercel detectará automáticamente que es un proyecto Vite
   - Click en "Deploy"
   - ¡Listo! Tu app estará en `tu-proyecto.vercel.app` con SSL automático

3. **Configurar dominio personalizado (opcional)**
   - En el dashboard de Vercel, ve a Settings > Domains
   - Agrega tu dominio o subdominio
   - Sigue las instrucciones para configurar DNS
   - SSL se configura automáticamente

### Alternativas gratuitas:

#### 1. Netlify (Similar a Vercel)
- Gratis con SSL
- Dominio: `tu-proyecto.netlify.app`
- Deploy desde GitHub o drag & drop
- [netlify.com](https://netlify.com)

#### 2. Cloudflare Pages
- Gratis con SSL
- Dominio: `tu-proyecto.pages.dev`
- Integración con Cloudflare
- [pages.cloudflare.com](https://pages.cloudflare.com)

#### 3. GitHub Pages
- Gratis con SSL
- Dominio: `tu-usuario.github.io/tu-proyecto`
- Requiere configuración adicional para SPA
- Más limitado que Vercel/Netlify

## Configuración del proyecto

El proyecto ya está configurado con `vercel.json` para un deploy óptimo en Vercel.

### Build Command
```bash
npm run build
```

### Output Directory
```
dist
```

### Instalación
```bash
npm install
```

## Notas importantes

- Las imágenes en `src/assets/` se incluirán automáticamente en el build
- El proyecto usa React Router, por lo que necesita configuración de rewrites (ya incluida en vercel.json)
- Vercel detecta automáticamente Vite y configura todo correctamente

