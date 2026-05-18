# UQAI — Gestión de Tarjetas de Crédito

Aplicación web para administrar tarjetas de crédito: alta, listado, bloqueo, registro de consumos y pagos.

## Stack

- **Backend:** Spring Boot 4 (Java 17) + Spring Data JPA
- **Base de datos:** PostgreSQL 16
- **Frontend:** React 19 + Vite + Axios
- **Contenedores:** Docker / Docker Compose

## Estructura del proyecto

```
UQAI/
├── backend/                # API Spring Boot
│   ├── src/main/java/uqai/prueba/
│   │   ├── controller/     # TarjetaCreditoController
│   │   ├── service/        # TarjetaCreditoService
│   │   ├── repository/     # TarjetaCreditoRepository
│   │   └── model/          # TarjetaCredito, EstadoTarjeta
│   ├── src/main/resources/application.properties
│   ├── .env
│   ├── Dockerfile
│   └── pom.xml
├── frontend/               # Cliente React + Vite
│   ├── src/
│   │   ├── api/tarjetas.js
│   │   ├── components/
│   │   └── App.jsx
│   └── Dockerfile
└── docker-compose.yml
```

## Requisitos previos

- **Docker** y **Docker Compose** (recomendado — levanta todo el stack)
- Opcional sin Docker: **JDK 17**, **PostgreSQL 16** y **Node.js** 18+

---

## Ejecución rápida (todo con Docker)

Desde la raíz del proyecto (`UQAI/`):

```bash
docker compose up --build
```

Esto levanta los tres servicios:

| Servicio          | Contenedor        | URL                       |
|-------------------|-------------------|---------------------------|
| Base de datos     | `postgres_db`     | `localhost:5432`          |
| Backend (Spring)  | `spring_backend`  | `http://localhost:8080`   |
| Frontend (React)  | `react_frontend`  | `http://localhost:5173`   |

Abrir `http://localhost:5173` en el navegador.

Para detenerlo:

```bash
docker compose down
```

Para eliminar también los datos de la BD:

```bash
docker compose down -v
```

---

## 1. Backend

### Variables de entorno

Archivo `backend/.env`:

```
DB_HOST=postgres
DB_PORT=5432
DB_NAME=tarjetas_db
DB_USER=postgres
DB_PASSWORD=123456
SERVER_PORT=8080
```

> Si se ejecuta el backend **fuera** de Docker (Postgres en local), cambia `DB_HOST=localhost`.

### Opción manual (sin Docker)

1. Levantar PostgreSQL local con base `tarjetas_db`.
2. Ajustar `backend/.env` (`DB_HOST=localhost`).
3. Ejecutar:

```bash
cd backend
./mvnw spring-boot:run        # Linux / macOS
mvnw.cmd spring-boot:run      # Windows
```

El servicio queda en `http://localhost:8080`.

Hibernate crea/actualiza la tabla automáticamente (`spring.jpa.hibernate.ddl-auto=update`).

---

## 2. Frontend

En Docker se construye con `npm run build` y se sirve con `vite preview` (puerto `4173` del contenedor, mapeado al `5173` del host).

### Opción manual (sin Docker, modo desarrollo)

```bash
cd frontend
npm install
npm run dev
```

Vite expone la app en `http://localhost:5173`.

La URL del backend está fijada en `frontend/src/api/tarjetas.js`:

```js
const BASE_URL = "http://localhost:8080/api/tarjetas";
```

Modificar si el backend está en otro host/puerto.

---

## 3. Documentación de los endpoints

Base URL: `http://localhost:8080/api/tarjetas`

CORS habilitado para cualquier origen (`@CrossOrigin(origins = "*")`).

### Modelo `TarjetaCredito`

| Campo             | Tipo          | Descripción                                |
|-------------------|---------------|--------------------------------------------|
| `id`              | Long          | Identificador autogenerado                 |
| `titular`         | String        | Nombre del titular                         |
| `numeroTarjeta`   | String        | Número de la tarjeta                       |
| `limiteCredito`   | BigDecimal    | Límite de crédito asignado                 |
| `saldoDisponible` | BigDecimal    | Saldo disponible actual                    |
| `estado`          | Enum          | `ACTIVA` o `BLOQUEADA`                     |

---

### 3.1 Listar tarjetas

`GET /api/tarjetas`

**Respuesta 200**

```json
[
  {
    "id": 1,
    "titular": "Kennet Rodriguez",
    "numeroTarjeta": "1234123412341234",
    "limiteCredito": 5000.00,
    "saldoDisponible": 4200.00,
    "estado": "ACTIVA"
  }
]
```

---

### 3.2 Crear tarjeta

`POST /api/tarjetas`

Al crearse, la tarjeta queda en estado `ACTIVA` y su `saldoDisponible` se inicializa con el valor de `limiteCredito`.

**Body**

```json
{
  "titular": "Kennet Rodriguez",
  "numeroTarjeta": "1234123412341234",
  "limiteCredito": 5000.00
}
```

**Respuesta 201**

```json
{
  "id": 1,
  "titular": "Kennet Rodriguez",
  "numeroTarjeta": "1234123412341234",
  "limiteCredito": 5000.00,
  "saldoDisponible": 5000.00,
  "estado": "ACTIVA"
}
```

---

### 3.3 Bloquear tarjeta

`PATCH /api/tarjetas/{id}/bloquear`

Cambia el estado de la tarjeta a `BLOQUEADA`. Falla si la tarjeta no existe o ya está bloqueada.

**Respuesta 200**

```json
{
  "id": 1,
  "titular": "Kennet Rodriguez",
  "numeroTarjeta": "1234123412341234",
  "limiteCredito": 5000.00,
  "saldoDisponible": 5000.00,
  "estado": "BLOQUEADA"
}
```

**Errores**

- Tarjeta inexistente → `Tarjeta no encontrada`
- Tarjeta ya bloqueada → `La tarjeta ya está bloqueada`

---

### 3.4 Registrar consumo

`POST /api/tarjetas/{id}/consumo`

Resta `monto` al `saldoDisponible`. La tarjeta debe estar `ACTIVA` y el monto no puede superar el saldo disponible.

**Body**

```json
{ "monto": 800.00 }
```

**Respuesta 200**

```json
{
  "id": 1,
  "titular": "Kennet Rodriguez",
  "numeroTarjeta": "1234123412341234",
  "limiteCredito": 5000.00,
  "saldoDisponible": 4200.00,
  "estado": "ACTIVA"
}
```

**Errores**

- Tarjeta inexistente → `Tarjeta no encontrada`
- Tarjeta bloqueada → `No se puede operar sobre una tarjeta bloqueada`
- Monto > saldo → `Saldo insuficiente`

---

### 3.5 Registrar pago

`POST /api/tarjetas/{id}/pago`

Suma `monto` al `saldoDisponible`. Si el nuevo saldo supera el `limiteCredito`, se ajusta al límite. La tarjeta debe estar `ACTIVA`.

**Body**

```json
{ "monto": 500.00 }
```

**Respuesta 200**

```json
{
  "id": 1,
  "titular": "Kennet Rodriguez",
  "numeroTarjeta": "1234123412341234",
  "limiteCredito": 5000.00,
  "saldoDisponible": 4700.00,
  "estado": "ACTIVA"
}
```

**Errores**

- Tarjeta inexistente → `Tarjeta no encontrada`
- Tarjeta bloqueada → `No se puede operar sobre una tarjeta bloqueada`

---

## Resumen rápido de endpoints

| Método | Ruta                              | Descripción              |
|--------|-----------------------------------|--------------------------|
| GET    | `/api/tarjetas`                   | Listar tarjetas          |
| POST   | `/api/tarjetas`                   | Crear tarjeta            |
| PATCH  | `/api/tarjetas/{id}/bloquear`     | Bloquear tarjeta         |
| POST   | `/api/tarjetas/{id}/consumo`      | Registrar consumo        |
| POST   | `/api/tarjetas/{id}/pago`         | Registrar pago           |

---

## Flujo de prueba sugerido

1. `docker compose up --build` desde la raíz (levanta BD, backend y frontend).
2. Abrir `http://localhost:5173`.
3. Crear una tarjeta → registrar un consumo → registrar un pago → bloquear.
