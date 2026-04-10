# Configuración de GitHub Pages - Instrucciones

## ✅ Lo que he configurado:

### 1. **vite.config.ts**
- Agregué `base: '/'` para que Vite genere los assets con rutas correctas
- Configuré la salida de build en `dist`

### 2. **src/router.tsx**  
- Cambié el pattern de rutas para manejar correctamente:
  - Ruta raíz `/` → redirige a `/Home`
  - Ruta comodín `*` → redirige a `/Home`
- Agregué `replace` en las redirecciones para mejor manejo de historial

### 3. **public/404.html**
- Archivo crítico para SPAs en GitHub Pages
- Automáticamente redirige 404s a `index.html` para que React Router maneje las rutas

### 4. **.github/workflows/deploy.yml**
- Workflow de GitHub Actions que:
  - Automáticamente build y publica en GitHub Pages al hacer push a `main` o `master`
  - Usa pnpm para instalar dependencias
  - Corre `pnpm build` automáticamente

## 📋 Pasos finales en GitHub:

1. **Asegúrate que tu rama principal es `main` o `master`**

2. **En GitHub, ve a:**
   - Repositorio → Settings → Pages
   - Verifica que:
     - **Source**: Selecciona "GitHub Actions"
     - **Branch**: No es necesario seleccionar si usas Actions

3. **Haz un push con estos cambios:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push
   ```

4. **El el workflow se ejecutará automáticamente:**
   - Ve a Actions → Verifica que el deployment esté en progreso
   - Una vez completado, tu sitio estará en: `https://tu-usuario.github.io/nombre-repo`

## ⚠️ Importante - Cambia la base si es necesario:

Si tu repositorio NO es `tu-usuario.github.io` sino algo como `tu-usuario/mi-proyecto`:
- En **vite.config.ts**, cambia:
  ```typescript
  base: '/mi-proyecto/',  // ← Nombre exacto del repositorio
  ```

Si tu repositorio SÍ es `tu-usuario.github.io`:
- Dejar `base: '/'` está correcto ✅

## 🧪 Para probar localmente antes de push:

```bash
pnpm build
pnpm preview
```

Luego abre: `http://localhost:4173`

## 🔍 Solucionar problemas:

**Si ves errores de MIME type o módulos no encontrados:**
- Verifica que `base` en vite.config.ts coincida con la estructura de URL
- Limpia el caché del navegador (Ctrl+Shift+Delete)
- Revisa los Logs en GitHub Actions

**Si las rutas no funcionan:**
- Asegúrate que 404.html está en `public/`
- Verifica que el workflow completó correctamente
