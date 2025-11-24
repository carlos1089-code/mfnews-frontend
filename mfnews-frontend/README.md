# 📰 MFNews Client (Frontend)

Aplicación web moderna para la lectura y gestión de noticias, diseñada con un enfoque en la experiencia de usuario (UX), rendimiento y código limpio. Este proyecto forma parte del desafío técnico Fullstack.

## 🛠️ Tech Stack

* **Core:** React 18 + Vite (Build ultra-rápido)
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

---

## ⚙️ Configuración e Instalación

### Prerrequisitos
* Node.js (v18 o superior)
* NPM

### 1. Instalación de dependencias
```bash
npm install
