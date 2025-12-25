# Instrucciones para corregir el favicon estirado

El favicon se muestra estirado porque necesita tener dimensiones cuadradas (1:1).

## Solución rápida (recomendada):

1. Ve a https://favicon.io/favicon-converter/
2. Sube el archivo `public/favicon.png`
3. Descarga el `favicon.ico` generado
4. Reemplaza `public/favicon.png` con `favicon.ico`
5. Actualiza `index.html` para usar:
   ```html
   <link rel="icon" type="image/x-icon" href="/favicon.ico" />
   ```

## Solución alternativa:

1. Ve a https://realfavicongenerator.net/
2. Sube `public/favicon.png`
3. Configura para generar múltiples tamaños
4. Descarga y reemplaza los archivos en `public/`
5. Actualiza las referencias en `index.html`

## Nota:

El favicon debe ser cuadrado (ej: 32x32, 64x64, 128x128 píxeles) para evitar el estiramiento.

