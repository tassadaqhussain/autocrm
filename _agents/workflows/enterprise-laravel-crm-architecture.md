---
description: Mandatory Enterprise Laravel CRM architecture and coding standards. Never simplify or merge layers.
---

# Enterprise Laravel CRM – Mandatory Architecture

This project is an **Enterprise Laravel CRM**. All code and refactors must follow this architecture. **Never simplify architecture. Never merge layers.**

## Stack
- Laravel 11+
- PHP 8.3+
- MySQL 8+ / PostgreSQL
- Redis
- Horizon
- API-first architecture

## Folder Structure (Mandatory)

**Never dump files in default Laravel folders (e.g. `app/Http/Controllers`, `app/Models`). Everything must be module-based.**

### Base structure under `app/`
```
app/
├── Core/
├── Modules/
├── DTO/
├── Enums/
├── Traits/
├── Support/
├── Exceptions/
```

### Module structure
Each feature lives under `app/Modules/{ModuleName}/`:
```
Modules/
└── {ModuleName}/
     ├── Controllers/
     ├── Services/
     ├── Repositories/
     ├── Models/
     ├── DTOs/
     ├── Requests/
     ├── Policies/
     ├── Events/
     ├── Listeners/
     ├── Resources/
     ├── Routes/
     └── Tests/
```

New code belongs in the appropriate module folder, not in Laravel’s default `app/Http`, `app/Models`, etc.

## Architecture Style (Mandatory)
- **Modular Monolith** – feature modules with clear boundaries under `app/Modules/`
- **Module-based structure** – all feature code lives under `app/Modules/{ModuleName}/`
- **Service Layer pattern** – business logic in services, not controllers or models
- **Repository pattern** – data access behind repository interfaces
- **DTO usage** – use Data Transfer Objects for crossing boundaries
- **Event-driven** – use Laravel events for side effects and cross-module communication
- **Queue-based processing** – heavy or async work via jobs and Horizon
- **Strict Multi-tenancy** – tenant context (e.g. `clinic_id`, `tenant_id`) enforced everywhere
- **Enterprise-level coding standards** – type hints, strict types, contracts, tests

## Multi-Tenancy (Mandatory)
- **Single database architecture** – one database; tenant isolation via `company_id` (or project’s tenant column).
- **company_id on all tenant-related tables** – every tenant-scoped table has a tenant column (e.g. `company_id`).
- **Global Scopes** – enforce tenant isolation on models so queries are always scoped.
- **Tenant resolved via middleware** – set tenant context from request (e.g. subdomain, header, auth).
- **No cross-tenant queries allowed** – never query or expose data across tenants.
- **All repositories must respect tenant scope** – repositories never bypass tenant scoping.
- **Tenant context from authenticated user** – tenant is derived from the authenticated user (e.g. `auth()->user()->company_id`); do not trust client-supplied tenant for authorization.

## RBAC (Role-Based Access Control)

- **Tables:** `roles`, `permissions`, `role_permissions`, `user_roles`.
- **Permissions are module-based** – use dotted names: `leads.view`, `leads.create`, `leads.update`, `deals.move_stage`, etc. No flat or ad-hoc permission strings.
- **Policies enforce permissions** – authorization is done in Policies (e.g. `LeadPolicy`, `DealPolicy`); controllers use `authorize()` or middleware that delegates to policies.
- **Never manually check permissions in controllers** – do not write `if (auth()->user()->can('leads.view'))` or similar in controller code; use Policy authorization (`$this->authorize('view', $lead)`) or route middleware bound to permissions.

## Event-Driven Architecture

- **Domain events (examples):** `LeadCreated`, `LeadAssigned`, `LeadConvertedToDeal`, `DealStageChanged`, `DealClosed`, `TaskCompleted`. Use these (and similar) for cross-module and side-effect workflows.
- **Listeners must:**
  - **Be queueable** – implement `ShouldQueue` so listeners run via the queue (Horizon).
  - **Send notifications** – user-facing notifications are triggered from listeners, not from controllers or services directly.
  - **Log activities** – audit/activity log entries are created in listeners.
  - **Trigger automation** – automation rules (e.g. next step, assign, notify) run from listeners.
- **Never send emails synchronously** – all mail must be queued (e.g. `Mail::queue(...)` or notifications that implement `ShouldQueue`). No synchronous `Mail::send(...)` in request path.

## API Standards

- **Versioned API** – all HTTP endpoints are served under a versioned prefix (e.g. `/api/v1/...`), with new breaking changes introduced under a new version (e.g. `/api/v2/...`).
- **RESTful design** – use standard HTTP verbs (`GET`, `POST`, `PUT/PATCH`, `DELETE`) and resource-oriented URLs; avoid RPC-style or ad-hoc endpoints where a RESTful design is possible.
- **Use API Resources** – responses must use Laravel API Resources / Resource Collections instead of returning raw models or arbitrary arrays.
- **Use Form Request validation** – validation logic must live in dedicated `FormRequest` classes; controllers should depend on typed request objects, not inline `request()->validate()` for complex flows.
- **Proper HTTP status codes** – return appropriate status codes for success and error cases (e.g. `200/201/204` for success, `400/422` for validation/contract issues, `401/403` for auth/permission, `404` for missing resources, `500` for unhandled server errors).
- **Pagination required on index endpoints** – collection/index endpoints must use pagination (`paginate`/`cursorPaginate`) and accept standard pagination query params (e.g. `page`, `per_page`).
- **Consistent JSON response format** – API responses must follow a consistent JSON envelope (e.g. `{ "data": ..., "meta": ..., "errors": ... }`) as defined by the project’s API Resources; do not invent per-endpoint shapes.

## Performance & Queue

- **Redis queue driver** – use Redis as the queue driver in all non-local environments; do not fall back to `sync` or database queues in production.
- **Horizon integration** – all queued jobs (notifications, emails, heavy tasks) must run under Laravel Horizon with proper supervisors configured for worker concurrency and priorities.
- **All notifications queued** – notifications must implement `ShouldQueue` (or otherwise be dispatched to the queue); do not send notifications synchronously in the HTTP request lifecycle.
- **All emails queued** – emails must be queued (`Mail::queue(...)` or queued notifications); no direct `Mail::send(...)` in request paths or synchronous jobs.
- **Heavy tasks queued** – CPU- or I/O-heavy work (imports, exports, reports, external API calls, background calculations) must be extracted into Jobs and run via the queue.
- **Use caching for dashboards** – expensive dashboard or summary endpoints must use caching or pre-computed aggregates (e.g. cached metrics, materialized views) instead of raw live aggregation on every request.
- **Index filtered columns** – add database indexes for frequently filtered/sorted columns (e.g. status, foreign keys, date fields used in `WHERE`/`ORDER BY`) to keep queries performant at scale.
- **Avoid N+1 queries** – never ship N+1 patterns; use eager loading (`with`, `load`, `loadMissing`) and query-level joins where appropriate.
- **Use eager loading properly** – ensure eager loading is scoped to the data actually needed (avoid over-eager loading large graphs) while still preventing N+1 behaviour.

## Core Goals
- Scalable to 100k+ users
- Multi-tenant SaaS ready
- Strict separation of concerns
- API-first design
- Production-ready

## Rules (Non-negotiable)
1. **Module-based placement** – do not put feature code in default Laravel folders; use `app/Modules/{ModuleName}/` and the defined subfolders.
2. **Do not simplify architecture** – keep Service, Repository, DTO, and Domain layers distinct.
3. **Do not merge layers** – e.g. do not put repository logic in services, or service logic in controllers.
4. **Prefer services** – new business logic goes in a Service class; controllers only orchestrate and return responses.
5. **Prefer repositories** – new data access goes behind a Repository; models are used inside repositories.
6. **API-first** – design for API consumption; web routes can use the same application layer.
7. **Multi-tenancy** – always scope queries and writes by tenant; never expose cross-tenant data.
8. **Use queues** – for emails, reports, imports, and any long-running or external calls where appropriate.
9. **Use events** – for side effects (logging, notifications, sync) instead of inline calls across modules.
10. **RBAC via policies** – enforce permissions via Policies and `authorize()`; never manually check permissions in controllers.
11. **Events for side effects** – listeners must be queueable; use them for notifications, activity logging, and automation. Never send emails synchronously.
12. **API standards** – all APIs must be versioned under `/api/v1/` (or later versions), RESTful, use API Resources and Form Request validation, paginate index endpoints, and return a consistent JSON response format.
13. **Performance & queue** – use Redis + Horizon for queues, ensure all notifications/emails/heavy tasks are queued, cache expensive dashboards, index filtered columns, and eliminate N+1s via correct eager loading.

## Strict Mode Rules for AI Generation

**If the AI does any of the following, STOP generation and correct the architecture:**

- Collapses Service into Controller (business logic in controller)
- Skips Repository layer (direct Eloquent/model usage in controller or service for data access)
- Skips DTO usage (raw request/array passing across layers instead of typed DTOs)
- Avoids Policies (manual permission checks, or no authorization on protected actions)
- Removes tenant enforcement (queries or writes without tenant scope)
- Sends emails synchronously (`Mail::send()` in request path; must use queue)
- Uses fat models (business logic, repository logic, or orchestration in models)

**Enterprise-grade patterns only.** Do not simplify or shortcut the architecture to “make it work.” Refactor to match the mandated layers and patterns before proceeding.

## Layer Responsibilities

### Controller
- Accept request
- Convert to DTO
- Call Service
- Return API Resource
- **No business logic**

### Service
- Business rules
- Transactions
- Workflow orchestration
- Dispatch events
- **No raw DB queries**

### Repository
- Database access only
- Eloquent abstraction
- **No business logic**

### DTO
- Immutable typed objects
- Used between Controller → Service (and across layer boundaries)

### Other
- **Models** – domain entities, relationships, casting. No business logic.
- **Events / Listeners** – side effects and cross-module communication.
- **Jobs** – queue work; may use services and repositories.

When adding features or refactoring, preserve these boundaries and do not collapse layers for convenience.
