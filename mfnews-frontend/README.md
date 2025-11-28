# 📰 MFNews Client (Frontend)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Aplicación web moderna para la lectura y gestión de noticias, diseñada con un enfoque en la experiencia de usuario (UX), rendimiento y código limpio. Este proyecto forma parte del desafío técnico Fullstack.

## 🛠️ Tech Stack

* **Core:** React 18 + Vite (Build ultra-rápido)
* **Lenguaje:** TypeScript / JavaScript (ESModules)
* **UI Framework:** Material UI (MUI v5)
* **Estado Global:** React Context API (Autenticación)
* **Formularios:** Formik + Yup (Validación de esquemas)
* **Cliente HTTP:** Axios (Instancia centralizada con interceptores)
* **Feedback UI:** Sonner (Notificaciones Toast elegantes)
* **Routing:** React Router Dom v6

## ✨ Características Principales

* **Diseño Responsive:** Layout adaptativo (Grid/Flexbox) optimizado para móviles y escritorio.
* **Autenticación Segura:** Manejo de sesión con JWT, persistencia en LocalStorage y rutas protegidas.
* **UX Optimista:**
    * **Búsqueda Inteligente:** Implementación de *Debounce* (500ms) para evitar saturar la API durante la escritura.
    * **Feedback Inmediato:** Uso de Toasts (`sonner`) para confirmar acciones (Crear/Editar) en lugar de alertas nativas.
    * **Skeletons:** Pantallas de carga para mejorar la percepción de velocidad.
* **CRUD Completo:** Creación, lectura, edición y listado de noticias con validaciones en tiempo real.

## 📂 Estructura del Proyecto

```bash
src/
├── api/            # Configuración de Axios y servicios de API
├── assets/         # Recursos estáticos (imágenes, iconos)
├── components/     # Componentes reutilizables (Navbar, Cards, Modals)
├── Context/        # Contextos de React (AuthContext)
├── hooks/          # Custom Hooks
├── layout/         # Layouts principales de la aplicación
├── pages/          # Páginas (Vistas principales)
├── router/         # Configuración de rutas (React Router)
├── theme/          # Configuración de tema (MUI)
├── types/          # Definiciones de tipos TypeScript (si aplica)
└── main.tsx        # Punto de entrada
```

---

## ⚙️ Configuración e Instalación

### Prerrequisitos
* Node.js (v18 o superior)
* NPM

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd mfnews-frontend
```

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el ejemplo:

```env
VITE_API_URL="http://localhost:3000/api"
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

---

## 🐳 Docker Support

El proyecto incluye configuración para despliegue en contenedores.

### Construir la imagen
```bash
docker build -t mfnews-frontend .
```

### Correr el contenedor
```bash
docker run -p 5173:5173 mfnews-frontend
```

---

## 📜 Scripts Disponibles

* `npm run dev`: Inicia el servidor de desarrollo.
* `npm run build`: Compila la aplicación para producción.
* `npm run preview`: Vista previa local de la build de producción.
* `npm run lint`: Ejecuta el linter para encontrar errores de código.
