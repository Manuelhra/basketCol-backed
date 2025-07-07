# 🏀 BasketCol Backend API

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-8.6.0-green.svg)

> **API Backend para la gestión integral de competiciones de baloncesto**

BasketCol Backend es una API RESTful robusta construida con **Clean Architecture** y **Domain-Driven Design (DDD)** que proporciona una plataforma completa para la gestión de ligas de baloncesto, equipos, jugadores, instalaciones y estadísticas.

## 📋 Tabla de Contenidos

- [🚀 Características Principales](#-características-principales)
- [🏗️ Arquitectura](#️-arquitectura)
- [⚙️ Requisitos Previos](#️-requisitos-previos)
- [🔧 Instalación](#-instalación)
- [🌍 Variables de Entorno](#-variables-de-entorno)
- [🚦 Uso](#-uso)
- [📚 Documentación de la API](#-documentación-de-la-api)
- [🏛️ Estructura del Proyecto](#️-estructura-del-proyecto)
- [🔐 Autenticación](#-autenticación)
- [💾 Base de Datos](#-base-de-datos)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

## 🚀 Características Principales

### 🎯 Gestión de Competiciones
- **Ligas**: Creación y administración de ligas de baloncesto
- **Temporadas**: Gestión de temporadas por liga
- **Fixtures**: Programación de partidos y fechas
- **Partidos**: Registro y seguimiento de juegos
- **Estadísticas**: Box scores detallados por jugador y equipo

### 👥 Gestión de Usuarios
- **Jugadores**: Perfiles completos con atributos físicos y técnicos
- **Organizadores**: Gestión de fundadores de ligas
- **Árbitros**: Administración de oficiales
- **Administradores**: Control total del sistema

### 🏟️ Instalaciones
- **Canchas**: Registro de instalaciones deportivas
- **Gimnasios**: Gestión de complejos deportivos

### 📊 Estadísticas Avanzadas
- **Estadísticas de Carrera**: Seguimiento histórico de jugadores
- **Box Scores**: Estadísticas detalladas por partido
- **Análisis de Rendimiento**: Métricas avanzadas de equipos

## 🏗️ Arquitectura

### Patrones Arquitectónicos
- **Clean Architecture**: Separación clara de responsabilidades
- **Domain-Driven Design (DDD)**: Diseño orientado al dominio
- **Repository Pattern**: Abstracción de la capa de persistencia
- **Dependency Injection**: Inyección de dependencias con Awilix

### Stack Tecnológico
- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5.5.4
- **Framework Web**: Express.js 4.19.2
- **Base de Datos**: MongoDB con Mongoose 8.6.0
- **Autenticación**: JWT + bcrypt
- **Almacenamiento**: AWS S3
- **Validación**: express-validator
- **Seguridad**: Helmet

## ⚙️ Requisitos Previos

- **Node.js**: v18.0.0 o superior
- **npm**: v8.0.0 o superior
- **MongoDB**: v5.0 o superior
- **Cuenta AWS**: Para almacenamiento S3

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/basketCol-backed.git
cd basketCol-backed
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 4. Inicializar la base de datos
```bash
# Asegúrate de que MongoDB esté ejecutándose
# La aplicación creará las colecciones automáticamente
```

### 5. Ejecutar la aplicación
```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## 🌍 Variables de Entorno

### Configuración del Servidor
```env
PORT=4000
NODE_ENV=development
```

### Base de Datos
```env
MONGO_URI=mongodb://localhost:27017/basketcol-dev
MONGO_DATABASE=basketcol-dev
```

### JWT Authentication
```env
JWT_AUTHENTICATE_USER_SECRET_KEY=tu-clave-secreta-jwt
JWT_REFRESH_TOKEN_SECRET_KEY=tu-clave-refresh-jwt
```

### Usuario Administrador
```env
HOST_USER_EMAIL=admin@basketcol.com
HOST_USER_PASSWORD=admin123
```

### AWS S3 (Opcional)
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key
AWS_S3_BUCKET_NAME_USER_PROFILE_IMAGE=basketcol-profiles
AWS_S3_BUCKET_NAME_LOGO=basketcol-logos
AWS_S3_BUCKET_NAME_MAIN_IMAGE=basketcol-main
AWS_S3_BUCKET_NAME_GALLERY_IMAGES=basketcol-gallery
```

## 🚦 Uso

### Comandos de Desarrollo
```bash
# Compilar TypeScript
npm run tsc

# Compilar en modo watch
npm run tsc:dev

# Servidor de desarrollo
npm run start:dev

# Servidor de producción
npm run start:prod
```

### Ejemplo de Uso de la API
```bash
# Autenticación
curl -X POST http://localhost:4000/api/v1/authentication/tokens \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@basketcol.com", "password": "admin123"}'

# Crear una liga
curl -X POST http://localhost:4000/api/v1/competitions/leagues \
  -H "Authorization: Bearer tu-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"name": "Liga Profesional", "description": "Liga oficial de baloncesto"}'
```

## 📚 Documentación de la API

### Endpoints Principales

#### 🔐 Autenticación (`/api/v1/authentication`)
- `POST /tokens` - Generar token de acceso
- `POST /tokens/refresh` - Renovar token
- `GET /users/me` - Obtener perfil del usuario autenticado
- `POST /password/request-reset` - Solicitar reset de contraseña

#### 👥 Usuarios (`/api/v1/users`)
- `GET /players` - Listar jugadores
- `POST /players` - Crear jugador
- `GET /players/:id` - Obtener jugador por ID
- `POST /host` - Crear usuario administrador
- `POST /league-founder` - Crear fundador de liga
- `POST /referee` - Crear árbitro
- `POST /team-founder` - Crear fundador de equipo

#### 🏆 Competiciones (`/api/v1/competitions`)
- `GET /leagues` - Listar ligas
- `POST /leagues` - Crear liga
- `GET /leagues/:id` - Obtener liga por ID
- `GET /leagues/:id/seasons` - Temporadas de una liga
- `POST /leagues/:id/seasons` - Crear temporada
- `GET /leagues/:leagueId/seasons/:seasonId/fixtures` - Fixtures de temporada
- `POST /leagues/:leagueId/seasons/:seasonId/fixtures` - Crear fixture

#### 👕 Equipos (`/api/v1/teams`)
- `GET /teams` - Listar equipos
- `POST /teams` - Crear equipo
- `GET /teams/:id` - Obtener equipo por ID
- `GET /teams/:id/players` - Jugadores de un equipo
- `POST /teams/:id/players` - Agregar jugador a equipo

#### 🏟️ Instalaciones (`/api/v1/facilities`)
- `GET /courts` - Listar canchas
- `POST /courts` - Crear cancha
- `GET /gyms` - Listar gimnasios
- `POST /gyms` - Crear gimnasio

### Códigos de Respuesta
- `200` - Éxito
- `201` - Creado
- `400` - Error en la solicitud
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `500` - Error interno del servidor

## 🏛️ Estructura del Proyecto

```
src/
├── basketCol/                    # Dominio principal
│   ├── authentication/          # Autenticación JWT
│   │   ├── application/         # Casos de uso
│   │   └── infrastructure/      # Implementaciones
│   ├── users/                   # Gestión de usuarios
│   │   ├── player/             # Jugadores
│   │   ├── host/               # Administradores
│   │   ├── league-founder/     # Fundadores de liga
│   │   ├── referee/            # Árbitros
│   │   └── team-founder/       # Fundadores de equipo
│   ├── competitions/           # Competiciones
│   │   ├── league/            # Ligas
│   │   │   ├── season/        # Temporadas
│   │   │   └── league-team/   # Equipos de liga
│   │   └── shared/            # Utilidades compartidas
│   ├── teams/                 # Gestión de equipos
│   │   ├── team-player/      # Jugadores de equipo
│   │   └── all-time-stats/   # Estadísticas históricas
│   ├── facilities/           # Instalaciones
│   │   ├── court/           # Canchas
│   │   └── gym/             # Gimnasios
│   └── shared/              # Utilidades compartidas
│       ├── application/     # Servicios compartidos
│       └── infrastructure/  # Implementaciones comunes
```

### Patrón de Capas por Dominio
```
[dominio]/
├── application/
│   ├── dtos/              # Data Transfer Objects
│   ├── exceptions/        # Excepciones específicas
│   ├── services/          # Servicios de aplicación
│   └── use-cases/         # Casos de uso
└── infrastructure/
    ├── dependency-injection/  # Configuración DI
    ├── persistence/       # Repositorios
    ├── server/           # Controladores y rutas
    └── services/         # Servicios de infraestructura
```

## 🔐 Autenticación

### Flujo de Autenticación
1. **Login**: `POST /api/v1/authentication/tokens`
2. **Refresh Token**: `POST /api/v1/authentication/tokens/refresh`
3. **Acceso Protegido**: Header `Authorization: Bearer <token>`

### Tipos de Usuario
- **Host**: Administrador del sistema
- **League Founder**: Fundador de ligas
- **Team Founder**: Fundador de equipos
- **Player**: Jugador
- **Referee**: Árbitro

### Middleware de Autorización
```typescript
// Ejemplo de uso en controladores
@AuthenticationMiddleware()
@UserTypeAuthorizationMiddleware(['host', 'league-founder'])
```

## 💾 Base de Datos

### Modelos Principales
- **Users**: Jugadores, administradores, árbitros
- **Leagues**: Ligas de baloncesto
- **Teams**: Equipos
- **Games**: Partidos
- **Stats**: Estadísticas de jugadores y equipos
- **Facilities**: Instalaciones deportivas

### Esquemas MongoDB
Los esquemas se definen usando Mongoose con validaciones estrictas:

```typescript
// Ejemplo de esquema
const LeagueSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  founderId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

## 🤝 Contribución

### Proceso de Contribución
1. Fork el repositorio
2. Crear rama para la característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit los cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

### Estándares de Código
- **Linting**: ESLint con configuración Airbnb
- **Formato**: Prettier para formato consistente
- **Commits**: Conventional Commits
- **TypeScript**: Tipado estricto obligatorio

### Estructura de Commits
```
feat: agregar endpoint para estadísticas de jugador
fix: corregir validación de email
docs: actualizar documentación de API
test: agregar tests para casos de uso
```

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🔧 Soporte y Mantenimiento

### Reportar Bugs
Si encuentras un bug, por favor abre un issue en GitHub con:
- Descripción detallada del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Capturas de pantalla (si aplica)

### Solicitudes de Características
Para solicitar nuevas características:
1. Verificar que no exista ya un issue similar
2. Describir claramente la funcionalidad deseada
3. Explicar el caso de uso
4. Proporcionar ejemplos si es posible

### Contacto
- **Autor**: Manuel Rivera
- **Email**: manuelh_ra@dominio.com
- **GitHub**: [@manuelhra](https://github.com/manuelhra)

---

<div align="center">
  <sub>Construido con ❤️ para la comunidad de baloncesto</sub>
</div>