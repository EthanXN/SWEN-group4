# HW2 — Full-Stack Food Ordering App

## Architecture

- **Backend:** Spring Boot 4.0.3, MariaDB (via XAMPP), session-based auth
- **Frontend:** React 18 + TypeScript + Vite, proxied to backend

## Running the Full Stack

### 1. Start MariaDB (via XAMPP)

Open XAMPP Control Panel and start **Apache** and **MySQL**. The database `swen_db` will be auto-created.

### 2. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`.

### 3. Start the Frontend

```bash
cd frontend
npm install    # first time only
npm run dev
```

Frontend starts at `http://localhost:4200` and proxies API calls to the backend.

### 4. Open the App

Navigate to **http://localhost:4200** in your browser.

## Default Accounts

| Username | Password | Role | Capabilities |
|----------|----------|------|-------------|
| `admin` | _(empty)_ | OWNER | Manage catalog items |
| `alice` | `password123` | HELPER | Browse menu, manage cart, place orders |
| _any new username_ | _your choice_ | HELPER | Auto-created on first login |

## API Base URL

The frontend dev server proxies `/auth/*`, `/items/*`, and `/collection/*` to `http://localhost:8080`. No CORS configuration changes are needed for development.

For production builds, set `VITE_API_BASE_URL` in the frontend `.env` file to the backend URL.
