# Route 53 Clone

A close visual and workflow clone of AWS Route 53's hosted-zone and record-management experience. It deliberately simulates DNS administration; it does not provision real DNS infrastructure.

## Included scope

- Mock sign-in/sign-out with a seven-day HttpOnly cookie session
- Persistent Hosted Zone create, list, search, edit, and delete
- Persistent DNS Record create, list, search, filter, edit, and delete per hosted zone
- Supported records: A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA
- Route 53-style shell, navigation, data tables, filters, pagination, modal forms, confirmations, and status notifications
- Dashboard, Traffic Policies, Health Checks, Resolver, and Profiles Coming Soon pages
- Import supported records from BIND zone files
- Export one zone or all hosted zones as JSON or BIND
- Persistent light/dark console appearance, keyboard shortcuts (`/`, `C`, `D`, `?`), and selection-based bulk deletion

Real AWS authentication, AWS credentials, IAM, DNS provisioning, and DNS resolution are intentionally not included.

## Run locally

Prerequisites: Python 3.11+ and Node.js 20+.

1. In one terminal, start the API:

   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

2. In a second terminal, start the web application:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

3. Visit `http://localhost:3000`. Sign in with any valid email address (the prefilled demo email works). API documentation is available at `http://localhost:8000/docs`.

## Architecture

`frontend/` is a Next.js 15 App Router application written in TypeScript. Client pages call the API with `credentials: include`, enabling the backend's cookie session to survive refreshes. A reusable application shell, modal/confirmation components, notification component, and responsive CSS provide the console experience.

`backend/` is a FastAPI application using SQLAlchemy and a local SQLite file (`backend/route53.db`). The API validates inputs, applies session authentication to all DNS resources, and manages associated record deletion through the hosted-zone relationship.

## Database schema

| Table | Key fields | Purpose |
| --- | --- | --- |
| `users` | `id`, `email`, `name` | Mock console identities |
| `sessions` | `token`, `user_id`, `expires_at` | Persistent login sessions |
| `hosted_zones` | `id`, `name`, `comment`, `zone_type`, `created_at` | Public/private DNS containers |
| `dns_records` | `id`, `zone_id`, `name`, `type`, `value`, `ttl`, `routing_policy` | Records owned by a hosted zone |

Deleting a hosted zone cascades to its records. SQLite storage is created automatically when the API starts.

## API overview

| Endpoint | Operations |
| --- | --- |
| `/auth/login`, `/auth/logout`, `/auth/me` | Session management |
| `/hosted-zones` | `GET` (search/pagination), `POST` |
| `/hosted-zones/{zone_id}` | `GET`, `PUT`, `DELETE` |
| `/hosted-zones/{zone_id}/records` | `GET` (search/type/pagination), `POST` |
| `/hosted-zones/{zone_id}/records/{record_id}` | `PUT`, `DELETE` |
| `/hosted-zones/export`, `/hosted-zones/{zone_id}/export` | `GET` JSON or BIND export |
| `/hosted-zones/{zone_id}/records/import-bind` | `POST` BIND import |
| `*/bulk-delete` | `POST` bulk delete selected zones or records |

All resource endpoints require the session cookie. FastAPI serves an interactive OpenAPI contract at `/docs`.
