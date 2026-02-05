# 🚀 Todo List App

Bienvenido a la **Todo List App**

Diseñada con **React** y **MUI**, esta aplicación no es solo una lista de tareas: es tu centro de productividad personal, con soporte para subtareas anidadas y una interfaz limpia.

![React](https://img.shields.io/badge/react-18.x-61dafb.svg) ![TypeScript](https://img.shields.io/badge/typescript-5.x-3178c6.svg) ![MUI](https://img.shields.io/badge/mui-5.x-007fff.svg)

---

## ✨ Características Principales

*   **⚡ Gestión de Tareas Jerárquica**: Crea tareas principales y añade infinitas subtareas para desglosar tus objetivos.
*   **🎨 Diseño Premium**: Interfaz moderna basada en Material UI (MUI), con transiciones suaves, sombras elegantes y un diseño responsivo.
*   **🔄 Estado Sincronizado**: 
    *   Marca una tarea padre y sus hijos se completarán automáticamente.
    *   Indentación visual clara para entender la jerarquía de un vistazo.
*   **📦 Persistencia de Datos**: Tus tareas se guardan automáticamente (vía `zustand` persist middleware), así que nunca perderás tu progreso.
*   **🛠️ Tech Stack Robusto**:
    *   **Frontend**: React + TypeScript + Vite
    *   **UI Library**: Material UI (@mui/material) + TailwindCSS (utilidades)
    *   **State Management**: Zustand (ligero y potente)
    *   **Iconos**: Material Icons

---

## 🚀 Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/todo_2.git
    cd todo_2
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o si usas pnpm (recomendado)
    pnpm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **¡Listo!** Abre tu navegador en `http://localhost:5173` y empieza a organizarte.

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura modular y limpia:

```plaintext
src/
├── components/       # Componentes visuales genéricos (Nav, Layouts)
├── modules/          # Módulos de funcionalidad específica
│   └── mainToDo/     # Núcleo de la aplicación To-Do
│       ├── MainToDo.tsx        # Contenedor principal
│       ├── MainItem.tsx        # Renderizado de tareas padre
│       ├── ChildItem.tsx       # Renderizado de subtareas (recursivo/anidado)
│       └── CreateChildForm.tsx # Formulario para nuevas subtareas
├── store/            # Gestión de estado global (Zustand)
│   └── todoStore/    # Store principal de tareas
└── types/            # Definiciones de tipos TypeScript compartidos
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la app:

1.  Haz un Fork del proyecto.
2.  Crea una rama con tu nueva funcionalidad (`git checkout -b feature/AmazingFeature`).
3.  Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Haz Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

---

Hecho con ❤️ por [Jaigobe]
