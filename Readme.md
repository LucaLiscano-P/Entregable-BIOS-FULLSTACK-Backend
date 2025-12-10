Proyecto Backend BIOS

Backend desarrollado en Node.js + TypeScript, diseñado para el curso de Desarrollador Full Stack en BIOS.
Incluye una API REST, autenticación JWT, manejo de usuarios, categorías y posts, con persistencia en MongoDB.

🚀 Comenzando

Estas instrucciones te permitirán obtener una copia del proyecto funcionando en tu máquina local para desarrollo y pruebas.

📋 Pre-requisitos

Node.js v16 o superior

MongoDB local o Atlas

npm (incluido con Node)

Ejemplo para verificar Node:

node -v

🔧 Instalación

Clonar el repositorio

git clone <url-del-repo>
cd proyecto-backend-bios


Instalar dependencias

npm install


Configurar variables de entorno

Crear un archivo .env en la raíz:

DB_URI=mongodb://localhost:27017/Proyecto-Final-BIOS
JWT_SECRET=mi_secreto_fuerte
PORT= NUMERO DEL PORT


Ejecutar en modo desarrollo

npm run dev

📂 Estructura del Proyecto
src/
 ├─ controllers/   → Lógica de endpoints
 ├─ models/        → Modelos Mongoose (user, post, category)
 ├─ services/      → Lógica de negocio
 ├─ routes/        → Rutas de la API
 ├─ middlewares/   → Validación, auth, etc.
 └─ config/        → Configuración general
package.json       → Scripts y dependencias

📦 Despliegue

Configurar variables de entorno en el servidor (Docker, Railway, Render, Vercel, etc.)

Asegurar JWT_SECRET fuerte en producción.

Conectar la app a MongoDB Atlas.

🛠️ Construido con

Node.js

TypeScript

Express

MongoDB + Mongoose

JWT

Nodemon (dev)

EJECUCION DE COMANDOS
