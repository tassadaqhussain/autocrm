# Agent & AI Instructions (Cursor, Antigravity, and others)

**This file is mandatory context for any AI or code agent working in this repo.**

---

## Project identity

This codebase is an **Enterprise Laravel CRM** with strict architecture. Follow the rules below in every edit, refactor, and suggestion.

---

## Stack
- Laravel 11+
- PHP 8.3+
- MySQL 8+ / PostgreSQL
- Redis
- Horizon
- API-first architecture

---

## Architecture style (mandatory)

- **Modular Monolith** – feature modules with clear boundaries.
- **Domain-driven structure** – organize by domain (e.g. `app/Domain/Deals`, `app/Domain/Proposals`).
- **Service Layer pattern** – business logic in services, not in controllers or models.
- **Repository pattern** – data access behind repository interfaces, not raw Eloquent in controllers.
- **DTO usage** – use Data Transfer Objects when crossing layer or module boundaries.
- **Event-driven** – use Laravel events for side effects and cross-module communication.
- **Queue-based processing** – heavy or async work via jobs and Horizon.
- **Strict Multi-tenancy** – tenant context (e.g. `clinic_id`, `tenant_id`) enforced in all queries and writes.
- **Enterprise-level coding standards** – type hints, strict types, contracts, and tests.

---

## Multi-tenancy (mandatory)

- **Single database architecture** – one database; tenant isolation via tenant column (e.g. `company_id`).
- **company_id on all tenant-related tables** – every tenant-scoped table has a tenant column.
- **Global Scopes** – enforce tenant isolation on models so all queries are scoped.
- **Tenant resolved via middleware** – set tenant context from request (subdomain, header, etc.).
- **No cross-tenant queries allowed** – never query or expose data across tenants.
- **All repositories must respect tenant scope** – repositories never bypass tenant scoping.
- **Tenant context from authenticated user** – tenant is derived from the authenticated user (e.g. `auth()->user()->company_id`); do not trust client-supplied tenant for authorization.

---

## RBAC (Role-Based Access Control)

- **Tables:** `roles`, `permissions`, `role_permissions`, `user_roles`.
- **Permissions are module-based** – use dotted names: `leads.view`, `leads.create`, `leads.update`, `deals.move_stage`, etc. No flat or ad-hoc permission strings.
- **Policies enforce permissions** – authorization is done in Policies (e.g. `LeadPolicy`, `DealPolicy`); controllers use `authorize()` or middleware that delegates to policies.
- **Never manually check permissions in controllers** – do not write `if (auth()->user()->can('leads.view'))` or similar in controller code; use Policy authorization (`$this->authorize('view', $lead)`) or route middleware bound to permissions.

---

## Event-driven architecture

- **Domain events (examples):** `LeadCreated`, `LeadAssigned`, `LeadConvertedToDeal`, `DealStageChanged`, `DealClosed`, `TaskCompleted`. Use these (and similar) for cross-module and side-effect workflows.
- **Listeners must:**
  - **Be queueable** – implement `ShouldQueue` so listeners run via the queue (Horizon).
  - **Send notifications** – user-facing notifications are triggered from listeners, not from controllers or services directly.
  - **Log activities** – audit/activity log entries are created in listeners.
  - **Trigger automation** – automation rules (e.g. next step, assign, notify) run from listeners.
- **Never send emails synchronously** – all mail must be queued (e.g. `Mail::queue(...)` or notifications that implement `ShouldQueue`). No synchronous `Mail::send(...)` in the request path.

---

## API standards

- **Versioned API** – all HTTP endpoints are served under a versioned prefix (e.g. `/api/v1/...`), with new breaking changes introduced under a new version (e.g. `/api/v2/...`).
- **RESTful design** – use standard HTTP verbs (`GET`, `POST`, `PUT/PATCH`, `DELETE`) and resource-oriented URLs; avoid RPC-style or ad-hoc endpoints where a RESTful design is possible.
- **Use API Resources** – responses must use Laravel API Resources / Resource Collections instead of returning raw models or arbitrary arrays.
- **Use Form Request validation** – validation logic must live in dedicated `FormRequest` classes; controllers should depend on typed request objects, not inline `request()->validate()` for complex flows.
- **Proper HTTP status codes** – return appropriate status codes for success and error cases (e.g. `200/201/204` for success, `400/422` for validation/contract issues, `401/403` for auth/permission, `404` for missing resources, `500` for unhandled server errors).
- **Pagination required on index endpoints** – collection/index endpoints must use pagination (`paginate`/`cursorPaginate`) and accept standard pagination query params (e.g. `page`, `per_page`).
- **Consistent JSON response format** – API responses must follow a consistent JSON envelope (e.g. `{ "data": ..., "meta": ..., "errors": ... }`) as defined by the project’s API Resources; do not invent per-endpoint shapes.

---

## Performance & queue

- **Redis queue driver** – use Redis as the queue driver in all non-local environments; do not fall back to `sync` or database queues in production.
- **Horizon integration** – all queued jobs (notifications, emails, heavy tasks) must run under Laravel Horizon with proper supervisors configured for worker concurrency and priorities.
- **All notifications queued** – notifications must implement `ShouldQueue` (or otherwise be dispatched to the queue); do not send notifications synchronously in the HTTP request lifecycle.
- **All emails queued** – emails must be queued (`Mail::queue(...)` or queued notifications); no direct `Mail::send(...)` in request paths or synchronous jobs.
- **Heavy tasks queued** – CPU- or I/O-heavy work (imports, exports, reports, external API calls, background calculations) must be extracted into Jobs and run via the queue.
- **Use caching for dashboards** – expensive dashboard or summary endpoints must use caching or pre-computed aggregates (e.g. cached metrics, materialized views) instead of raw live aggregation on every request.
- **Index filtered columns** – add database indexes for frequently filtered/sorted columns (e.g. status, foreign keys, date fields used in `WHERE`/`ORDER BY`) to keep queries performant at scale.
- **Avoid N+1 queries** – never ship N+1 patterns; use eager loading (`with`, `load`, `loadMissing`) and query-level joins where appropriate.
- **Use eager loading properly** – ensure eager loading is scoped to the data actually needed (avoid over-eager loading large graphs) while still preventing N+1 behaviour.

---

## Core goals
- Scalable to 100k+ users
- Multi-tenant SaaS ready
- Strict separation of concerns
- API-first design
- Production-ready

---

## Non-negotiable rules

1. **Never simplify architecture** – keep Service, Repository, DTO, and Domain layers distinct. Do not remove or merge them for “simplicity.”
2. **Never merge layers** – e.g. do not put repository logic in services, or service logic in controllers. Each layer has a single responsibility.
3. **Prefer services** – new business logic belongs in a Service class; controllers only validate input, call services, and return responses.
4. **Prefer repositories** – new data access belongs behind a Repository; use models inside repositories, not directly in controllers for complex logic.
5. **API-first** – design for API consumption; web UI can call the same application/API layer.
6. **Multi-tenancy** – always scope by tenant; never return or update data across tenants.
7. **Use queues** – for emails, reports, imports, and any long-running or external I/O where appropriate.
8. **Use events** – for side effects (logging, notifications, sync) instead of direct calls across modules.
9. **RBAC via policies** – enforce permissions via Policies and `authorize()`; never manually check permissions in controllers.
10. **Events for side effects** – listeners must be queueable; use them for notifications, activity logging, and automation. Never send emails synchronously.
11. **API standards** – all APIs must be versioned under `/api/v1/` (or later versions), RESTful, use API Resources and Form Request validation, paginate index endpoints, and return a consistent JSON response format.
12. **Performance & queue** – use Redis + Horizon for queues, ensure all notifications/emails/heavy tasks are queued, cache expensive dashboards, index filtered columns, and eliminate N+1s via correct eager loading.

---

## Strict mode rules for AI generation

**If the AI does any of the following, STOP generation and correct the architecture:**

- Collapses Service into Controller (business logic in controller)
- Skips Repository layer (direct Eloquent/model usage in controller or service for data access)
- Skips DTO usage (raw request/array passing across layers instead of typed DTOs)
- Avoids Policies (manual permission checks, or no authorization on protected actions)
- Removes tenant enforcement (queries or writes without tenant scope)
- Sends emails synchronously (`Mail::send()` in request path; must use queue)
- Uses fat models (business logic, repository logic, or orchestration in models)

**Enterprise-grade patterns only.** Do not simplify or shortcut the architecture to “make it work.” Refactor to match the mandated layers and patterns before proceeding.

---

## Layer responsibilities

| Layer        | Responsibility |
|-------------|----------------|
| Controllers | HTTP in/out, validation, call services, return response. No business logic. |
| Services    | Use cases, call repositories, emit events. No HTTP, no raw SQL. |
| Repositories| Query and persist entities. No business rules. |
| Models      | Domain entities, relationships, casting. No business logic. |
| DTOs        | Immutable data for input/output and between layers. |
| Events/Listeners | Side effects and cross-module communication. |
| Jobs        | Queue work; may use services and repositories. |

When adding features or refactoring, preserve these boundaries. Do not collapse or merge layers for convenience.

---

*This document is the single source of truth for architecture and agent behavior. Cursor rules in `.cursor/rules/` align with this file.*
