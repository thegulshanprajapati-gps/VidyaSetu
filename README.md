# Bihar College Recruitment & News Portal

Official centralized recruitment, official notice dissemination, and accreditation platform for polytechnics, engineering colleges, and universities across the State of Bihar.

---

## 🏛️ Architecture Overview

The system operates as a **dual-application setup** backed by a shared **Aiven PostgreSQL** database instance:

| Application | Path | Port | Purpose |
|---|---|---|---|
| **Public Portal** | `/` (Root directory) | `http://localhost:3000` | Candidates discovery, filterable vacancies, verified college directory, notices, registration wizard, college workspace |
| **Super Admin Portal** | `/admin` | `http://localhost:3001` | State Directorate console, college credential vetting, vacancy & circular moderation, audit logging |
| **Aiven PostgreSQL 16** | Cloud-hosted | `28429` | Central relational database with Prisma ORM and live terminal telemetry |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js:** v20+ or v24+
- **Database:** Aiven PostgreSQL 16 (Configured in `.env` and `admin/.env`)

### 2. Run the Applications

#### Public Portal (Port 3000)
```bash
npm run dev
# Running on http://localhost:3000
```

#### Super Admin Portal (Port 3001)
```bash
cd admin
npm run dev
# Running on http://localhost:3001
```

---

## 🔐 Credentials & Session Management

### Platform Super Admin
- **URL:** [http://localhost:3001/login](http://localhost:3001/login)
- **Email:** `admin@biharcollegeportal.in`
- **Password:** `BiharAdmin@2026#Secure`
- **Reset Password CLI:** `npx tsx scripts/set-admin-password.ts [newPassword]`

### College Administrators (Public Portal)
- **URL:** [http://localhost:3000/login](http://localhost:3000/login)
- **MIT Muzaffarpur:** `principal@mitmuzaffarpur.org` / `password123`
- **BCE Bhagalpur:** `principal@bcebhagalpur.ac.in` / `password123`
- **GP Patna-7:** `principal@gppatna7.org` / `password123`
- **Patna Women's College:** `info@patnawomenscollege.in` / `password123`
- **NCE Chandi:** `principal@ncechandi.ac.in` / `password123`

---

## ⚡ Key Features

1. **Full Session Lifecycle:**
   - Secure HTTP-only cookies (`bihar_portal_session` & `bihar_admin_session`) signed with `jose` JWTs.
   - Dynamic Header on the public portal automatically toggles between **"Login"** and **"College Name / User + Logout"**.
   - Admin routes (`http://localhost:3001/`) are shielded with Next.js middleware and auto-redirect unauthenticated users to `/login`.
2. **Real-Time Database Logging:**
   - Every database query prints duration and truncated SQL directly to the console (`⚡ [Aiven PostgreSQL Query]`).
   - Mutations print color-coded operation tags (`[DB FETCH]`, `[DB STORE]`, `[ADMIN DB UPDATE]`).
3. **Institutional Vetting Desk:**
   - 4-step registration wizard on public portal saves with status `PENDING`.
   - Super Admin can inspect affiliation orders and 1-click **Approve & Activate**, **Request Clarification**, or **Reject**.
4. **Content Moderation:**
   - Colleges submit recruitment circulars to the moderation queue.
   - Directorate authorizes circulars before they are released to candidates on the public portal.
5. **Branding & Presentation:**
   - First-load animation skeleton with official Directorate crest (`src/app/loading.tsx`).
   - High-contrast academic theme (`#17365D` Navy, `#2563EB` Blue).
   - Dedicated sponsored banner slots (`AdBanner.tsx`).

---

## 📂 Documentation

- [Roadmap & Milestones](file:///home/ashu/Desktop/bihar%20college/roadmap/roadmap.md)
- [Technical Implementation](file:///home/ashu/Desktop/bihar%20college/roadmap/implementation.md)
- [What to Update Next Action Plan](file:///home/ashu/Desktop/bihar%20college/roadmap/what-to-update-next.md)
