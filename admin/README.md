# Bihar College Super Admin Portal (Port 3001)

Dedicated, isolated administrative application for the State Directorate to supervise institutional accreditation, moderate recruitment vacancies, and audit system activity across the Bihar College Portal network.

## 🚀 Running the Admin App
```bash
npm run dev
# Starts server on http://localhost:3001
```

## 🔐 Credentials
- **Login URL:** [http://localhost:3001/login](http://localhost:3001/login)
- **Email:** `admin@biharcollegeportal.in`
- **Password:** `BiharAdmin@2026#Secure`

## 🛡️ Security
- **Middleware:** `src/middleware.ts` guards all routes and enforces active `bihar_admin_session` JWT cookies.
- **Database:** Connects directly to Aiven PostgreSQL 16 with real-time terminal query logging (`⚡ [Admin PostgreSQL Query]`).
