# 💻 MFNews - Frontend Client

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-Fast-purple) ![MUI](https://img.shields.io/badge/Material--UI-v5-blue) ![Axios](https://img.shields.io/badge/Axios-HTTP-yellow)

Cliente web SPA (Single Page Application) para el desafío técnico **MFNews**. Ofrece una interfaz moderna, responsive y rápida para la gestión y lectura de noticias.

Diseñado con un enfoque en **User Experience (UX)**, implementando estados de carga (Skeletons), feedback visual y validación de formularios en tiempo real.

## ✨ Características y Funcionalidad

* **Listado Completo (CRUD):** Permite Crear, Leer (Lista y Detalle), Editar y Eliminar noticias.
* **Diseño Responsive:** Adaptable a móviles, tablets y escritorio utilizando el sistema de Grid de Material UI.
* **Jerarquía Visual:** Uso de una sección **Hero (Noticia Destacada)** y Skeletons para mejorar la percepción de velocidad de carga.
* **Buscador Funcional:** Filtra noticias en tiempo real a través del endpoint del Backend.
* **Formularios Robustos:** Manejo y validación de esquemas de formularios con **Formik** y **Yup** (en el componente `NewsModal`).

## 🛠️ Stack Tecnológico

| Tecnología | Propósito |
| :--- | :--- |
| **React + Vite** | Librería de UI y Bundler de alto rendimiento. |
| **Material UI (MUI)** | Biblioteca de componentes y sistema de diseño. |
| **Axios** | Cliente HTTP con Interceptores configurados. |
| **Formik + Yup** | Manejo y validación de esquemas de formularios. |
| **React Router** | Navegación SPA. |

## ⚙️ Ejecución del Proyecto

El sistema completo se orquesta desde la carpeta del Backend (`mfnews-backend`).

### 1. Requisitos
* Docker y Docker Compose instalados.
* Los repositorios `mfnews-backend` y `mfnews-frontend` deben ser carpetas **hermanas**.

### 2. Arranque
Para levantar el Front, Back y la Base de Datos con un solo comando:

```bash
# Navegar a la carpeta del Backend
cd ../mfnews-backend 

# Ejecutar el orquestador
docker-compose up --build