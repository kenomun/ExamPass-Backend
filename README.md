# ExamPass

Este proyecto es una API backend para la gestión de usuarios, como administradores, profesores o estudiantes. el estudiante podra responder los test que le correspondan mientras que el admnistrador podra gestionar los usuarios y crear nuevos test. Está construido con Node.js, Express y Prisma, y utiliza PostgreSQL como base de datos.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
- **Express**: Framework de Node.js para crear la API.
- **Prisma**: ORM para gestionar la base de datos PostgreSQL.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar los datos.
- **Swagger**: Documentación interactiva de la API.

## Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local.

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/alondra-nuts-backend.git
```

## Intalar dependencias

npm install

## Configurar la base de datos

Asegúrate de tener PostgreSQL instalado y en ejecución. Crea una base de datos en PostgreSQL y actualiza el archivo .env con las credenciales correctas.

Ejemplo de archivo .env:
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/exam_pass

## Ejecutar migraciones

Prisma se utiliza para gestionar la base de datos. Ejecuta las migraciones para crear las tablas en PostgreSQL.

npx prisma migrate dev

## Ejecutar el servidor

Inicia el servidor de la API.

npm start o npm run dev

El servidor estará disponible en http://localhost:5000

## Documentación de la API

La API cuenta con documentación interactiva utilizando Swagger. Puedes acceder a la documentación en el siguiente enlace:

http://localhost:5000/api-docs

En la interfaz de Swagger podrás explorar todas las rutas disponibles de la API, ver ejemplos de solicitudes y respuestas, e incluso probar las API directamente desde el navegador. (Acutalmente puede contener errores)

## Variables de entorno

El archivo .env debe contener las siguientes variables:

DATABASE_URL: URL de conexión a la base de datos PostgreSQL.
